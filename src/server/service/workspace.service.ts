import { workspaceRepository } from '../repository/workspace.repository';
import { kube } from '../module/kube.module';
import { Workspace } from '@prisma/client';

interface CreateWorkspaceResult {
  workspace?: Workspace;
  error?: string;
  code?: 'NAMESPACE_EXISTS' | 'WORKSPACE_EXISTS' | 'NAMESPACE_FAILED' | 'INGRESS_FAILED' | 'DB_FAILED' | 'UNKNOWN';
}

export const workspaceService = {
  list: (userId: string) => workspaceRepository.listByUser(userId),

  create: async ({ name, userId }: { name: string; userId: string }): Promise<CreateWorkspaceResult> => {
    console.log(`Creating workspace: ${name} for user: ${userId}`);

    // Step 1: Check if workspace already exists in database
    try {
      const existingWorkspace = await workspaceRepository.findByName(name);
      if (existingWorkspace) {
        return {
          error: `Workspace "${name}" already exists`,
          code: 'WORKSPACE_EXISTS'
        };
      }
    } catch (e) {
      console.error('Error checking existing workspace:', e);
      // Continue - this is not a blocking error
    }

    // Step 2: Check if namespace already exists
    try {
      const namespaceExists = await kube.checkNamespaceExists(name);
      if (namespaceExists) {
        return {
          error: `Namespace "${name}" already exists. Please choose a different workspace name.`,
          code: 'NAMESPACE_EXISTS'
        };
      }
    } catch (e) {
      console.error('Error checking namespace existence:', e);
      return {
        error: 'Failed to verify namespace availability',
        code: 'UNKNOWN'
      };
    }

    // Step 3: Create namespace with retry logic
    try {
      console.log(`Creating namespace: ${name}`);
      const namespaceResponse = await workspaceService.createNamespaceWithRetry(name, 3);
      console.log('Namespace created successfully:', namespaceResponse);
    } catch (e) {
      console.error('Failed to create namespace after retries:', e);
      return {
        error: 'Failed to create namespace. Please try again.',
        code: 'NAMESPACE_FAILED'
      };
    }

    // Step 4: Create ingress with retry and fallback
    try {
      console.log(`Creating ingress for namespace: ${name}`);
      const ingressResponse = await workspaceService.createIngressWithRetry(name, 3);
      console.log('Ingress created successfully:', ingressResponse);
    } catch (e) {
      console.error('Failed to create ingress:', e);
      
      // Cleanup: Delete namespace if ingress creation fails
      try {
        await kube.deleteNamespace(name);
        console.log('Cleaned up namespace after ingress failure');
      } catch (cleanupError) {
        console.error('Failed to cleanup namespace:', cleanupError);
      }
      
      return {
        error: 'Failed to create ingress. Workspace creation rolled back.',
        code: 'INGRESS_FAILED'
      };
    }

    // Step 5: Create workspace in database
    try {
      const workspace = await workspaceRepository.create({ name, userId });
      console.log('Workspace created in database:', workspace);
      
      return {
        workspace
      };
    } catch (e) {
      console.error('Failed to create workspace in database:', e);

      // Cleanup: Delete namespace and ingress if database creation fails
      try {
        await kube.deleteNamespace(name);
        console.log('Cleaned up Kubernetes resources after database failure');
      } catch (cleanupError) {
        console.error('Failed to cleanup Kubernetes resources:', cleanupError);
      }
      
      return {
        error: 'Failed to save workspace. All resources have been cleaned up.',
        code: 'DB_FAILED'
      };
    }
  },

  // Helper method for namespace creation with retry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createNamespaceWithRetry: async (name: string, maxRetries: number): Promise<any> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await kube.createNamespace(name);
        return response;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Namespace creation attempt ${attempt}/${maxRetries} failed:`, error);
        
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  },

  // Helper method for ingress creation with retry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createIngressWithRetry: async (name: string, maxRetries: number): Promise<any> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await kube.createNamespaceIngress(name);
        return response;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Ingress creation attempt ${attempt}/${maxRetries} failed:`, error);
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  },

  remove: async (id: string) => {
    try {
      // Get workspace details first
      const workspace = await workspaceRepository.findById(id);
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      // Delete from database first
      await workspaceRepository.delete(id);
      
      // Then cleanup Kubernetes resources
      try {
        await kube.deleteNamespace(workspace.name);
      } catch (kubeError) {
        console.error('Failed to delete Kubernetes namespace:', kubeError);
        // Don't throw here - workspace is already deleted from DB
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error removing workspace:', error);
      throw error;
    }
  },
};