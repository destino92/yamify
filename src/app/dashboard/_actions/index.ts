'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { yamModule } from '@/server/module/yam.module';
import { workspaceModule } from '@/server/module/workspace.module';
import { projectModule } from '@/server/module/project.module';
import prisma from '@/libs/prisma';
import { z } from 'zod';

// Validation schemas
const createYamSchema = z.object({
  workspace: z.string().min(1, 'Workspace name is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  yam: z.string().min(1, 'Yam name is required'),
});

const createWorkspaceSchema = z.object({
  namespace: z.string().min(1, 'Namespace is required'),
  createYam: z.boolean(),
});

const deployProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  namespace: z.string().min(1, 'Namespace is required'),
  yamId: z.string().min(1, 'Yam ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
});

// Error types
export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

// Helper function for consistent error handling
const handleActionError = (error: unknown, context: string): ActionResult => {
  console.error(`${context} error:`, error);
  
  if (error instanceof z.ZodError) {
    return {
      success: false,
      error: error.errors[0]?.message || 'Validation failed',
      code: 'VALIDATION_ERROR'
    };
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: 'OPERATION_FAILED'
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
};

interface CreateYamData {
  workspace: string;
  workspaceId: string;
  yam: string;
}

export const createYamAction = async (data: CreateYamData): Promise<ActionResult> => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return {
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    };
  }

  try {

    // Validate input
    const validatedData = createYamSchema.parse(data);
    const { workspace, workspaceId, yam } = validatedData;

    const createYam = await yamModule.service.createAndStoreVCluster(yam, 
      workspace,
      workspaceId
    )

    console.log('Yam created for workspace', createYam)

    return {
      success: true,
      data: createYam
    };
  } catch(error) {
    return handleActionError(error, 'createYamAction');
  }
}

interface CreateWorkspaceData {
  namespace: string;
  createYam: boolean;
}

export const createWorkspaceAction = async (data: CreateWorkspaceData): Promise<ActionResult> => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return {
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    };
  }

  const { id } = user
  let workspaceId
  
  try {
    // Validate input
    const validatedData = createWorkspaceSchema.parse(data);

    const result = await workspaceModule.service.create({
      name: validatedData.namespace,
      userId: id,
    })
    
    if (result.error) {
      return {
        success: false,
        error: result.error || 'Failed to create workspace',
        code: result.code || 'WORKSPACE_CREATION_FAILED'
      };
    }

    console.log('Workspace created for user', result.workspace)
    workspaceId = result?.workspace?.id

    if(validatedData.createYam && workspaceId){
      try {
        const yam = await yamModule.service.createAndStoreVCluster(
          validatedData.namespace,
          validatedData.namespace,
          workspaceId
        )
        console.log('Yam created for workspace', yam)
      } catch(e) {
        console.error('Error creating yam (non-blocking):', e)
        // Don't fail the entire onboarding if yam creation fails
        // The user can create it later from the dashboard
        console.warn('Yam creation failed, but continuing with onboarding')
      }
    }

    return {
      success: true,
      data: {
        workspace: result.workspace,
        message: 'Onboarding completed successfully'
      }
    };

  } catch(error) {
    return handleActionError(error, 'createWorkspaceAction');
  }
}

interface DeployProject {
  name: string;
  namespace: string;
  yamId: string;
  workspaceId: string;
}

const checkAppLimit = async (yamId: string, appType: string): Promise<{ canDeploy: boolean; error?: string }> => {
  try {
    const existingApps = await prisma.project.count({
      where: {
        yamId,
        type: appType,
      },
    });

    // Limite à 1 application du même type par YAM
    if (existingApps >= 1) {
      return {
        canDeploy: false,
        error: `You have reached the maximum number of deployments for (${appType}). Limit: 1`
      };
    }

    return { canDeploy: true };
  } catch (error) {
    console.error('Error checking app limit:', error);
    return { canDeploy: false, error: 'Failed to verify deployment limits' };
  }
};

export const deployCodeServerProjectAction = async (data: DeployProject): Promise<ActionResult> => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return {
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    };
  }
  

  try {
    // Validate input
    const validatedData = deployProjectSchema.parse(data);
    
    // Check deployment limits
    const limitCheck = await checkAppLimit(validatedData.yamId, 'wordpress');
    if (!limitCheck.canDeploy) {
      return {
        success: false,
        error: limitCheck.error || 'Deployment limit exceeded',
        code: 'DEPLOYMENT_LIMIT_EXCEEDED'
      };
    }

    const project = await projectModule.service.create({
      name: validatedData.name,
      type: 'wordpress',
      namespace: validatedData.namespace,
      workspaceId: validatedData.workspaceId,
      yamId: validatedData.yamId
    });

    console.log('WordPress project created:', project);
    
    return {
      success: true,
      data: project
    };

  } catch(error) {
    return handleActionError(error, 'deployWordpressProjectAction');
  }
}

export const deployWordpressProjectAction = async (data: DeployProject): Promise<ActionResult> => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return {
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    };
  }
  
  try {
    // Validate input
    const validatedData = deployProjectSchema.parse(data);
    
    // Check deployment limits
    const limitCheck = await checkAppLimit(validatedData.yamId, 'wordpress');
    if (!limitCheck.canDeploy) {
      return {
        success: false,
        error: limitCheck.error || 'Deployment limit exceeded',
        code: 'DEPLOYMENT_LIMIT_EXCEEDED'
      };
    }

    const project = await projectModule.service.create({
      name: validatedData.name,
      type: 'wordpress',
      namespace: validatedData.namespace,
      workspaceId: validatedData.workspaceId,
      yamId: validatedData.yamId
    });

    console.log('WordPress project created:', project);
    
    return {
      success: true,
      data: project
    };

  } catch(error) {
    return handleActionError(error, 'deployWordpressProjectAction');
  }
}

export const deployN8nProjectAction = async (data: DeployProject): Promise<ActionResult> => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return {
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    };
  }
  
  try {
    // Validate input
    const validatedData = deployProjectSchema.parse(data);

    // Vérifier la limite pour n8n
    const limitCheck = await checkAppLimit(validatedData.yamId, 'n8n');
    if (!limitCheck.canDeploy) {
      return {
        success: false,
        error: limitCheck.error || 'Deployment limit exceeded',
        code: 'DEPLOYMENT_LIMIT_EXCEEDED'
      };
    }

    const project = await projectModule.service.create({
      name: validatedData.name,
      type: 'n8n',
      namespace: validatedData.namespace,
      workspaceId: validatedData.workspaceId,
      yamId: validatedData.yamId
    });

    console.log('n8n project created:', project)

    return {
      success: true,
      data: project
    };

  } catch(error) {
    return handleActionError(error, 'deployN8nProjectAction');
  }
}

interface RemoveProjectParams {
  id: string;
}

const removeProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
});

export const removeProjectAction = async (data: RemoveProjectParams): Promise<ActionResult> => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!user || !userId) {
    return {
      success: false,
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    };
  }

  try {
    // Validate input
    const validatedData = removeProjectSchema.parse(data);
    const { id } = validatedData;
    await projectModule.service.remove({ id });
    console.log('Project deleted:', id);
    
    return {
      success: true,
      data: { id }
    };
  } catch (error) {
    return handleActionError(error, 'removeProjectAction');
  }
};

