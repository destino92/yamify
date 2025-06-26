'use server'

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import prisma from '@/libs/prisma'
import { workspaceModule } from '@/server/module/workspace.module';
import { yamModule } from '@/server/module/yam.module';

interface OnbordindData {
    workspaceName: string;
    createYam: boolean;
}

export const completeOnboarding = async ({workspaceName, createYam}: OnbordindData) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!user || !userId) {
    return { error: 'No Logged In User', code: 'UNAUTHORIZED' }
  }

  const client = await clerkClient()

  const { id, emailAddresses, firstName, lastName } = user
  const namespace = workspaceName
  let workspaceId

  // Step 1: Create/update user
  try {
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        id: id,
        clerkId: id,
        email: emailAddresses[0].emailAddress,
        name: `${firstName ?? ''} ${lastName ?? ''}`,
      },
    })
  } catch(e) {
    console.error('Error creating user:', e)
    return { 
      error: 'Failed to create user account', 
      code: 'USER_CREATION_FAILED' 
    }
  }

  // Step 2: Create workspace (includes namespace and ingress)
  try {
    const result = await workspaceModule.service.create({
      name: namespace,
      userId: id,
    })
    
    if (result.error) {
      return {
        error: result.error,
        code: result.code
      }
    }

    console.log('Workspace created for user', result.workspace)
    workspaceId = result?.workspace?.id
  } catch(e) {
    console.error('Unexpected error creating workspace:', e)
    return { 
      error: 'An unexpected error occurred while creating workspace', 
      code: 'WORKSPACE_CREATION_FAILED' 
    }
  }

  if(createYam && workspaceId){
    try {
      const yam = await yamModule.service.createAndStoreVCluster(namespace, 
        namespace,
        workspaceId
      )
      console.log('Yam created for workspace', yam)
    } catch(e) {
      console.error('Error creating yam:', e)
      // Don't fail the entire onboarding if yam creation fails
      // The user can create it later from the dashboard
      console.warn('Yam creation failed, but continuing with onboarding')
    }
  }

  
  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })
    return { 
      success: true, 
      message: 'Onboarding completed successfully',
      data: res.publicMetadata 
    }
  } catch (err) {
    console.error('Error updating user metadata:', err)
    return { 
      error: 'Workspace created but failed to complete onboarding. Please contact support.',
      code: 'METADATA_UPDATE_FAILED'
    }
  }
}