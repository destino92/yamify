'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { yamModule } from '@/server/module/yam.module';
import { workspaceModule } from '@/server/module/workspace.module';
import { kube } from '@/server/module/kube.module';
import { projectModule } from '@/server/module/project.module';
import prisma from '@/libs/prisma';

interface CreateYamData {
  workspace: string;
  workspaceId: string;
  yam: string;
}

export const createYamAction = async ({workspace, workspaceId, yam}: CreateYamData) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return { message: 'No Logged In User' }
  }

  try {
    const createYam = await yamModule.service.createAndStoreVCluster(yam, 
      workspace,
      workspaceId
    )
    console.log('Yam created for workspace', createYam)

  } catch(e) {
    console.log(e)
    if(e instanceof Error){
      console.log(e.message)
    }
    return new Response('Error creating yam', { status: 500 })
  }
}

interface CreateWorkspaceData {
  namespace: string;
  createYam: boolean;
}

export const createWorkspaceAction = async ({namespace, createYam}: CreateWorkspaceData) => {
  const { userId } = await auth()
  const user = await currentUser()
  let workspaceId

  if (!user || !userId) {
    return { message: 'No Logged In User' }
  }

  try{
    const result = await workspaceModule.service.create({
      name: namespace,
      userId,
    })
    
    if (!result.workspace) {
      return { error: result.error || 'Error creating workspace' }
    }
    
    console.log('Workspace created for user', result.workspace)
    if(result.workspace && result.workspace.id) {
      workspaceId = result.workspace.id
    } else {
      return { error: 'Workspace created but no id found' }
    }
  } catch(e) {
    console.log(e)
    if(e instanceof Error){
      console.log(e.message)
    }
    return new Response('Error creating workspace', { status: 500 })
    
  }

  // create ingress for the user
  try {
    const response = await kube.createNamespaceIngress(namespace)
    console.log('Ingress created for workspace', response)
  } catch(e) {
    console.error(e)
    if(e instanceof Error){
      console.error(e.message)
    }
    return new Response('Error creating ingress', { status: 500 })
  }

  if(createYam){
    try {
      const yam = await yamModule.service.createAndStoreVCluster(namespace, 
        namespace,
        workspaceId
      )
      console.log('Yam created for workspace', yam)
    } catch(e) {
      console.error(e)
      if(e instanceof Error){
        console.error(e.message)
      }
      return new Response('Error creating yam', { status: 500 })
    }
  }
}

interface DeployProject {
  name: string;
  namespace: string;
  yamId: string;
  workspaceId: string;
}

export const deployCodeServerProjectAction = async ({name, namespace, yamId, workspaceId}: DeployProject) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return { error: 'No Logged In User' }
  }
  
  // Vérifier la limite pour code-server
  const limitCheck = await checkAppLimit(yamId, 'code-server');
  if (!limitCheck.canDeploy) {
    return { error: limitCheck.error };
  }

  try {
    const project = await projectModule.service.create({
      name,
      type: 'code-server',
      namespace,
      workspaceId,
      yamId
    });

    console.log('Code Server project created:', project)
    return { success: true, project }

  } catch(e) {
    console.log(e)
    if(e instanceof Error){
      console.log(e.message)
      return { error: e.message }
    }
    return { error: 'Error deploying Code Server' }
  }
}


const checkAppLimit = async (yamId: string, appType: string): Promise<{ canDeploy: boolean; error?: string }> => {
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
      error: `You have reached the maximum number of deployments for this application (${appType}). Limit: 1`
    };
  }
  return { canDeploy: true };
};

export const deployWordpressProjectAction = async ({name, namespace, yamId, workspaceId}: DeployProject) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return { error: 'No Logged In User' }
  }
  
  // Vérifier la limite pour WordPress
  const limitCheck = await checkAppLimit(yamId, 'wordpress');
  if (!limitCheck.canDeploy) {
    return { error: limitCheck.error };
  }

  try {
    const project = await projectModule.service.create({
      name,
      type: 'wordpress',
      namespace,
      workspaceId,
      yamId
    });

    console.log('WordPress project created:', project)
    return { success: true, project }

  } catch(e) {
    console.log(e)
    if(e instanceof Error){
      console.log(e.message)
      return { error: e.message }
    }
    return { error: 'Error deploying WordPress' }
  }
}

export const deployN8nProjectAction = async ({name, namespace, yamId, workspaceId}: DeployProject) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return { error: 'No Logged In User' }
  }
  
  // Vérifier la limite pour n8n
  const limitCheck = await checkAppLimit(yamId, 'n8n');
  if (!limitCheck.canDeploy) {
    return { error: limitCheck.error };
  }

  try {
    const project = await projectModule.service.create({
      name,
      type: 'n8n',
      namespace,
      workspaceId,
      yamId
    });

    console.log('n8n project created:', project)
    return { success: true, project }

  } catch(e) {
    console.log(e)
    if(e instanceof Error){
      console.log(e.message)
      return { error: e.message }
    }
    return { error: 'Error deploying n8n' }
  }
}

interface RemoveProjectParams {
  id: string;
}

export const removeProjectAction = async ({ id }: RemoveProjectParams) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!user || !userId) {
    return { error: 'No Logged In User' };
  }

  try {
    await projectModule.service.remove({ id });
    console.log('Project deleted:', id);
    return { success: true };
  } catch (e) {
    console.error('Error deleting project:', e);
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'Failed to delete project' };
  }
};
