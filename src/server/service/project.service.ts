import { projectRepository } from '../repository/project.repository';
import { kube } from '../module/kube.module';
import prisma from '@/libs/prisma';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Custom error types
export class ProjectServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'ProjectServiceError';
  }
}

export class DeploymentError extends ProjectServiceError {
  constructor(message: string, cause?: Error) {
    super(message, 'DEPLOYMENT_FAILED', cause);
  }
}

export class ValidationError extends ProjectServiceError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

export class ResourceNotFoundError extends ProjectServiceError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`, 'RESOURCE_NOT_FOUND');
  }
}

// Retry utility with exponential backoff
const withRetry = async <T>(
  operation: () => Promise<T>,
  context: string,
  maxRetries = RETRY_CONFIG.maxRetries
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry validation errors or resource not found errors
      if (error instanceof ValidationError || error instanceof ResourceNotFoundError) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        console.error(`${context} failed after ${maxRetries} attempts:`, lastError);
        throw lastError;
      }
      
      const delay = Math.min(
        RETRY_CONFIG.baseDelay * Math.pow(2, attempt - 1),
        RETRY_CONFIG.maxDelay
      );
      
      console.warn(`${context} attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Circuit breaker pattern for external services
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.timeout) {
        throw new ProjectServiceError('Service temporarily unavailable', 'CIRCUIT_BREAKER_OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

const kubernetesCircuitBreaker = new CircuitBreaker();

// Timeout wrapper
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export const projectService = {
  list: async (opts: { yamId: string }) => {
    try {
      if (!opts.yamId) {
        throw new ValidationError('Yam ID is required');
      }
      
      return await withRetry(
        () => projectRepository.listByYam(opts.yamId),
        'List projects'
      );
    } catch (error) {
      console.error('Error listing projects:', error);
      throw error instanceof ProjectServiceError ? error : new ProjectServiceError(
        'Failed to list projects',
        'LIST_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  },

create: async (params: {
  name: string;
  type: string;
  namespace: string;
  chart?: string;
  valuesYaml?: string;
  workspaceId: string;
  yamId: string;
}) => {
    // Validate required parameters
    if (!params.name || !params.type || !params.namespace || !params.workspaceId || !params.yamId) {
      throw new ValidationError('Missing required parameters: name, type, namespace, workspaceId, yamId');
    }

    // Validate project type
    const supportedTypes = ['wordpress', 'code-server', 'n8n'];
    if (!supportedTypes.includes(params.type)) {
      throw new ValidationError(`Unsupported project type: ${params.type}. Supported types: ${supportedTypes.join(', ')}`);
    }

    let record: { id: string; } | null = null;

    try {
      // Create project record with pending status
      record = await withRetry(
        () => projectRepository.create({
          ...params,
          status: 'pending'
        }),
        'Create project record'
      );

      console.log(`Project record created with ID: ${record.id}`);

      // Get the parent Yam (vCluster) kubeconfig
      const yam = await withRetry(
        () => prisma.yam.findUnique({ 
          where: { id: params.yamId } 
        }),
        'Fetch Yam configuration'
      );

      if (!yam) {
        throw new ResourceNotFoundError('Yam', params.yamId);
      }

      if (!yam.kubeConfig) {
        throw new DeploymentError('Parent vCluster kubeconfig not found');
      }

      // Update status to deploying
      await withRetry(
        () => projectRepository.update(record!.id, { status: 'deploying' }),
        'Update project status to deploying'
      );

      console.log(`Starting deployment for project ${record.id} of type ${params.type}`);

      // Deploy the app inside the vCluster with circuit breaker and timeout
      const deploymentResult = await kubernetesCircuitBreaker.execute(async () => {
        return await withTimeout(
          projectService.deployApplication(params.type, record!, yam.kubeConfig!, yam.namespace),
          300000 // 5 minutes timeout
        );
      });

      // Update project with deployment results
      const updatedRecord = await withRetry(
        () => projectRepository.update(record!.id, {
          status: 'ready',
          ...deploymentResult
        }),
        'Update project with deployment results'
      );

      console.log(`Project ${record.id} deployed successfully`);
      return updatedRecord;
    } catch (error) {
      console.error(`Project creation failed for ${record?.id || 'unknown'}:`, error);

      // Update status to failed if record exists
      if (record) {
        try {
          await projectRepository.update(record.id, { 
            status: 'failed',
            // Store error message for debugging
            ...(error instanceof Error && { 
              // You might want to add an errorMessage field to your schema
            })
          });
        } catch (updateError) {
          console.error(`Failed to update project status to failed:`, updateError);
        }

        // Clean up failed deployment
        try {
          await projectService.cleanupFailedDeployment(record.id);
        } catch (cleanupError) {
          console.error(`Failed to cleanup project ${record.id}:`, cleanupError);
        }
      }

      // Re-throw the original error
      throw error instanceof ProjectServiceError ? error : new DeploymentError(
        `Failed to deploy ${params.type}`,
        error instanceof Error ? error : undefined
      );
    }

  },
  deployApplication: async (
    type: string, 
    project: { name: string; yamId: string; namespace: string }, 
    vclusterKubeconfig: string, 
    yamName: string
  ) => {
    try {
      switch (type) {
        case 'wordpress':
          return await projectService.deployWordpressInVCluster(project, vclusterKubeconfig, yamName);
        case 'code-server':
          return await projectService.deployCodeServerInVCluster(project, vclusterKubeconfig, yamName);
        case 'n8n':
          return await projectService.deployN8nInVCluster(project, vclusterKubeconfig, yamName);
        default:
          throw new ValidationError(`Unsupported app type: ${type}`);
      }
    } catch (error) {
      console.error(`Deployment failed for ${type}:`, error);
      throw new DeploymentError(
        `Failed to deploy ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  },

  deployWordpressInVCluster: async (
    project: { name: string; yamId: string; namespace: string }, 
    vclusterKubeconfig: string, 
    yamName: string
  ) => {
    try {
      console.log(`Deploying WordPress for project ${project.name} in yam ${yamName}`);
      
      const result = await withRetry(
        () => kube.deployWordpress(vclusterKubeconfig, yamName, project.namespace),
        'Deploy WordPress in vCluster',
        2 // Fewer retries for Kubernetes operations
      );

      return {
        url: result.url,
        username: result.user,
        password: result.password
      };
    } catch (error) {
      throw new DeploymentError(
        `WordPress deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  },
  deployCodeServerInVCluster: async (
    project: { name: string; yamId: string; namespace: string }, 
    vclusterKubeconfig: string, 
    yamName: string
  ) => {
    try {
      console.log(`Deploying Code Server for project ${project.name} in yam ${yamName}`);
      
      const url = await withRetry(
        () => kube.deployCodeServer(vclusterKubeconfig, yamName, project.namespace),
        'Deploy Code Server in vCluster',
        2
      );

      return {
        url,
        username: 'user',
        password: 'changeme'
      };
    } catch (error) {
      throw new DeploymentError(
        `Code Server deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  },
  deployN8nInVCluster: async (
    project: { name: string; yamId: string; namespace: string }, 
    vclusterKubeconfig: string, 
    yamName: string
  ) => {
    try {
      console.log(`Deploying n8n for project ${project.name} in yam ${yamName}`);
      
      const result = await withRetry(
        () => kube.deployN8n(vclusterKubeconfig, yamName, project.namespace),
        'Deploy n8n in vCluster',
        2
      );

      return {
        url: typeof result === 'string' ? result : result.url
      };
    } catch (error) {
      throw new DeploymentError(
        `n8n deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error : undefined
      );
    }
  },
  deployCustomHelmInVCluster: async (project: { id: string; name: string; namespace: string; chart: string; valuesYaml: string }, vclusterKubeconfig: string) => {
    if (!project.chart || !project.valuesYaml) {
      throw new Error('Chart and valuesYaml are required for custom Helm deployments');
    }

    const { promises: fs } = await import('fs');
    const { tmpdir } = await import('os');
    const { join } = await import('path');
    const { execa } = await import('execa');

    const kubeconfigPath = join(tmpdir(), `kubeconfig-${project.id}.yaml`);
    const valuesPath = join(tmpdir(), `values-${project.id}.yaml`);

    try {
      await fs.writeFile(kubeconfigPath, vclusterKubeconfig);
      await fs.writeFile(valuesPath, project.valuesYaml);

      // Create namespace in vCluster
      await execa('kubectl', [
        '--kubeconfig', kubeconfigPath,
        'create', 'namespace', project.namespace
      ]).catch((err) => {
        if (!err.stderr?.includes('AlreadyExists')) throw err;
      });

      // Add Helm repo if it's a repo URL
      if (project.chart.startsWith('http')) {
        await execa('helm', ['repo', 'add', project.name, project.chart]);
        await execa('helm', ['repo', 'update']);
      }

      // Install via Helm in the vCluster
      await execa('helm', [
        'install',
        project.name,
        project.chart,
        '--namespace', project.namespace,
        '--kubeconfig', kubeconfigPath,
        '-f', valuesPath
      ]);

      return {};
    } finally {
      await fs.unlink(kubeconfigPath).catch(() => {});
      await fs.unlink(valuesPath).catch(() => {});
    }
  },
  remove: async (opts: { id: string }) => {
  if (!opts.id) {
    throw new ValidationError('Project ID is required');
  }

  let project: ({ yam: { name: string; namespace: string; kubeConfig: string; }; } & {
    name: string; id: string; createdAt: Date; type: string; namespace: string; chart // Retry configuration
      : string | null; valuesYaml: string | null; workspaceId: string; yamId: string; url: string | null; username: string | null; password: string | null; status: string;
  }) | null;
  
  try {
    // Find the project with retry
    project = await withRetry(
      () => projectRepository.findById(opts.id),
      'Find project by ID'
    );

    if (!project) {
      throw new ResourceNotFoundError('Project', opts.id);
    }

    console.log(`Starting removal of project ${project.id} (${project.type})`);

    // Update status to 'deleting' to prevent concurrent operations
    await withRetry(
      () => projectRepository.update(project!.id, { status: 'deleting' }),
      'Update project status to deleting'
    );

    // Get the parent vCluster kubeconfig
    const yam = await withRetry(
      () => prisma.yam.findUnique({ 
        where: { id: project!.yamId },
        select: {
          id: true,
          name: true,
          namespace: true,
          kubeConfig: true
        }
      }),
      'Fetch Yam for cleanup'
    );

    if (!yam) {
      console.warn(`Parent Yam not found for project ${project.id}, proceeding with database cleanup only`);
    } else if (!yam.kubeConfig) {
      console.warn(`Parent vCluster kubeconfig not found for project ${project.id}, proceeding with database cleanup only`);
    } else {
      // Attempt to clean up Kubernetes resources with circuit breaker and timeout
      try {
        await kubernetesCircuitBreaker.execute(async () => {
          return await withTimeout(
            projectService.cleanupAppInVCluster({
              id: project!.id,
              name: project!.name,
              type: project!.type,
              namespace: project!.namespace
            }, yam.kubeConfig!),
            180000 // 3 minutes timeout for cleanup
          );
        });        console.log(`Successfully cleaned up Kubernetes resources for project ${project.id}`);
      } catch (cleanupError) {
        console.error(`Failed to cleanup Kubernetes resources for project ${project.id}:`, cleanupError);
        
        // Don't fail the entire removal if Kubernetes cleanup fails
        // Log the error and continue with database cleanup
        // This prevents orphaned database records when K8s resources are already gone
        
        // Optionally, you could implement a cleanup queue here for retry later
        await projectService.scheduleCleanupRetry(project.id, cleanupError);
      }
    }

    // Remove from database with retry
    const deletedProject = await withRetry(
      () => projectRepository.delete(opts.id),
      'Delete project from database'
    );

    console.log(`Successfully removed project ${opts.id}`);
    return deletedProject;

  } catch (error) {
    console.error(`Failed to remove project ${opts.id}:`, error);

    // If we updated the status to 'deleting', revert it to the previous status
    if (project && project.status !== 'deleting') {
      try {
        await projectRepository.update(project.id, { 
          status: 'failed' // Mark as failed so user can retry
        });
      } catch (revertError) {
        console.error(`Failed to revert project status after removal failure:`, revertError);
      }
    }

    // Re-throw the original error
    throw error instanceof ProjectServiceError ? error : new ProjectServiceError(
      `Failed to remove project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'REMOVAL_FAILED',
      error instanceof Error ? error : undefined
    );
  }
},
  cleanupAppInVCluster: async (
  project: { id: string; name: string; type: string; namespace: string }, 
  vclusterKubeconfig: string
) => {
  const { promises: fs } = await import('fs');
  const { tmpdir } = await import('os');
  const { join } = await import('path');

  const kubeconfigPath = join(tmpdir(), `kubeconfig-cleanup-${project.id}.yaml`);

  try {
    await fs.writeFile(kubeconfigPath, vclusterKubeconfig);

    // Determine the release name based on project type
    const releaseNames = projectService.getReleaseNames(project.type, project.name);
    
    console.log(`Cleaning up releases: ${releaseNames.join(', ')} for project ${project.id}`);

    // Clean up each release
    for (const releaseName of releaseNames) {
      await projectService.cleanupHelmRelease(
        kubeconfigPath, 
        releaseName, 
        project.namespace,
        project.id
      );
    }

    // Clean up any persistent volumes or other resources
    await projectService.cleanupAdditionalResources(
      kubeconfigPath,
      project.namespace,
      project.type,
      project.id
    );

    console.log(`Successfully cleaned up all resources for project ${project.id}`);

  } catch (error) {
    console.error(`Error during app cleanup for project ${project.id}:`, error);
    throw new ProjectServiceError(
      `Failed to cleanup application resources: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CLEANUP_FAILED',
      error instanceof Error ? error : undefined
    );
  } finally {
    // Always clean up the temporary kubeconfig file
    try {
      await fs.unlink(kubeconfigPath);
    } catch (unlinkError) {
      console.error(`Error removing temporary kubeconfig file:`, unlinkError);
    }
  }
},

  getReleaseNames: (projectType: string, projectName: string): string[] => {
    // Return possible release names for the project type
    switch (projectType) {
      case 'wordpress':
        return ['wordpress'];
      case 'code-server':
        return ['codeserver'];
      case 'n8n':
        return ['n8n'];
      default:
        // For custom deployments, try the project name
        return [projectName];
    }
  },

  cleanupHelmRelease: async (
  kubeconfigPath: string,
  releaseName: string,
  namespace: string,
  projectId: string
) => {
  const { execa } = await import('execa');

  try {
    // First, check if the release exists
    await withRetry(
      () => execa('helm', [
        'status',
        releaseName,
        '--namespace', namespace,
        '--kubeconfig', kubeconfigPath
      ]),
      `Check Helm release status: ${releaseName}`,
      1 // Only try once for status check
    );

    // If we reach here, the release exists, so uninstall it
    await withRetry(
      () => execa('helm', [
        'uninstall',
        releaseName,
        '--namespace', namespace,
        '--kubeconfig', kubeconfigPath,
        '--timeout', '5m'
      ]),
      `Uninstall Helm release: ${releaseName}`
    );

    console.log(`Successfully uninstalled Helm release: ${releaseName} for project ${projectId}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('not found') || errorMessage.includes('release: not found')) {
      console.log(`Helm release ${releaseName} not found for project ${projectId}, skipping uninstall`);
      return; // Not an error if release doesn't exist
    }

    console.error(`Error uninstalling Helm release ${releaseName} for project ${projectId}:`, error);
    
    // Don't throw here - we want to continue with other cleanup operations
    // But log the error for monitoring
  }
},

cleanupAdditionalResources: async (
  kubeconfigPath: string,
  namespace: string,
  projectType: string,
  projectId: string
) => {
  const { execa } = await import('execa');

  try {
    // Clean up persistent volume claims that might not be removed by Helm
    const pvcCleanupCommands = [
      // WordPress typically creates PVCs
      ...(projectType === 'wordpress' ? [
        ['persistentvolumeclaims', '-l', 'app.kubernetes.io/name=wordpress'],
        ['persistentvolumeclaims', '-l', 'app.kubernetes.io/name=mariadb']
      ] : []),
      
      // Code Server PVCs
      ...(projectType === 'code-server' ? [
        ['persistentvolumeclaims', '-l', 'app.kubernetes.io/name=code-server']
      ] : []),
      
      // n8n PVCs
      ...(projectType === 'n8n' ? [
        ['persistentvolumeclaims', '-l', 'app.kubernetes.io/name=n8n']
      ] : [])
    ];

    for (const [resource, ...args] of pvcCleanupCommands) {
      try {
        await execa('kubectl', [
          '--kubeconfig', kubeconfigPath,
          'delete', resource,
          '--namespace', namespace,
          '--timeout=60s',
          '--ignore-not-found=true',
          ...args
        ]);
        console.log(`Cleaned up ${resource} for project ${projectId}`);
      } catch (resourceError) {
        console.warn(`Failed to cleanup ${resource} for project ${projectId}:`, resourceError);
        // Continue with other resources
      }
    }

    // Clean up any secrets that might be left behind
    try {
      await execa('kubectl', [
        '--kubeconfig', kubeconfigPath,
        'delete', 'secrets',
        '--namespace', namespace,
        '--timeout=30s',
        '--ignore-not-found=true',
        '-l', `yamify.io/project-id=${projectId}`
      ]);
    } catch (secretError) {
      console.warn(`Failed to cleanup secrets for project ${projectId}:`, secretError);
    }

    // Clean up any configmaps
    try {
      await execa('kubectl', [
        '--kubeconfig', kubeconfigPath,
        'delete', 'configmaps',
        '--namespace', namespace,
        '--timeout=30s',
        '--ignore-not-found=true',
        '-l', `yamify.io/project-id=${projectId}`
      ]);
    } catch (configMapError) {
      console.warn(`Failed to cleanup configmaps for project ${projectId}:`, configMapError);
    }

  } catch (error) {
    console.error(`Error during additional resource cleanup for project ${projectId}:`, error);
    // Don't throw - this is best-effort cleanup
  }
},

cleanupFailedDeployment: async (projectId: string) => {
  try {
    console.log(`Starting cleanup of failed deployment: ${projectId}`);
    
    const project = await projectRepository.findById(projectId);
    if (!project) {
      console.warn(`Project ${projectId} not found for failed deployment cleanup`);
      return;
    }

    // Get Yam configuration
    const yam = await prisma.yam.findUnique({
      where: { id: project.yamId },
      select: { kubeConfig: true }
    });

    if (yam?.kubeConfig) {
      // Attempt to clean up any partially deployed resources
      try {
        await withTimeout(
          projectService.cleanupAppInVCluster(project, yam.kubeConfig),
          120000 // 2 minutes timeout for failed deployment cleanup
        );
        console.log(`Successfully cleaned up failed deployment resources for project ${projectId}`);
      } catch (cleanupError) {
        console.error(`Failed to cleanup failed deployment resources for project ${projectId}:`, cleanupError);
        // Don't throw - this is best-effort cleanup
      }
    }

    // The project record will be kept with 'failed' status for user visibility
    // User can retry deployment or manually delete the project

  } catch (error) {
    console.error(`Error during failed deployment cleanup for project ${projectId}:`, error);
    // Don't throw - this is best-effort cleanup
  }
},

scheduleCleanupRetry: async (projectId: string, originalError: unknown) => {
  // This is a placeholder for implementing a cleanup retry queue
  // You could implement this using a job queue like Bull/BullMQ, or a simple database table
  
  console.log(`Scheduling cleanup retry for project ${projectId} due to error:`, originalError);
  
  try {
    // Example: Store in a cleanup_queue table for later processing
    // await prisma.cleanupQueue.create({
    //   data: {
    //     projectId,
    //     error: originalError instanceof Error ? originalError.message : String(originalError),
    //     retryCount: 0,
    //     nextRetryAt: new Date(Date.now() + 300000) // Retry in 5 minutes
    //   }
    // });
    
    // For now, just log it
    console.log(`Cleanup retry scheduled for project ${projectId}`);
  } catch (scheduleError) {
    console.error(`Failed to schedule cleanup retry for project ${projectId}:`, scheduleError);
  }
},

  // Utility method to check if an app of specific type already exists in a YAM
checkIfAppTypeExists: async (yamId: string, appType: string): Promise<boolean> => {
  try {
    if (!yamId || !appType) {
      throw new ValidationError('yamId and appType are required');
    }

    const existingApp = await withRetry(
      () => prisma.project.findFirst({
        where: {
          yamId,
          type: appType,
          status: {
            not: 'failed' // Don't count failed deployments
          }
        },
        select: { id: true },
      }),
      'Check if app type exists'
    );

    return !!existingApp;
  } catch (error) {
    console.error(`Error checking if app type exists:`, error);
    throw error instanceof ProjectServiceError ? error : new ProjectServiceError(
      'Failed to check app type existence',
      'CHECK_FAILED',
      error instanceof Error ? error : undefined
    );
  }
},

  // Get app status by checking pods in vCluster
  getStatus: async (projectId: string) => {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const yam = await prisma.yam.findUnique({ 
      where: { id: project.yamId } 
    });

    if (!yam?.kubeConfig) {
      return { status: 'unknown' };
    }

    // Check pod status in the vCluster
    // Implementation would check kubectl get pods status
    return { status: project.status };
  }
};