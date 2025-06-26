'use server'

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import prisma from '@/libs/prisma'
import { workspaceModule } from '@/server/module/workspace.module';
import { kube } from '@/server/module/kube.module';
import { yamModule } from '@/server/module/yam.module';

interface OnboardingData {
  workspaceName: string;
  createYam: boolean;
}

export const completeOnboarding = async ({ workspaceName, createYam }: OnboardingData) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!user || !userId) {
    return { error: 'No logged in user.' };
  }

  const { id, emailAddresses, firstName, lastName } = user;
  const namespace = workspaceName;
  let workspaceId: string;

  try {
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        id: id,
        clerkId: id,
        email: emailAddresses[0].emailAddress,
        name: `${firstName} ${lastName}`,
      },
    });
  } catch (e) {
    console.error('❌ Error creating user:', e);
    return { error: 'Error creating user.' };
  }

  try {
    const workspace = await workspaceModule.service.create({
      name: namespace,
      userId: id,
    });
    if (!workspace.workspace) {
      throw new Error(workspace.error || 'Failed to create workspace');
    }
    workspaceId = workspace.workspace.id;
    console.log('Workspace created for user:', workspace);
  } catch (e) {
    console.error('❌ Error creating workspace:', e);
    return { error: 'Error creating workspace.' };
  }

  try {
    const ingress = await kube.createNamespaceIngress(namespace);
    console.log('Ingress created for workspace:', ingress);
  } catch (e) {
    console.error('❌ Error creating ingress:', e);
    return { error: 'Error creating ingress.' };
  }

  let codeServerUrl: string | null = null;

  if (createYam) {
    try {
      const yam = await yamModule.service.createAndStoreVCluster(
        namespace,
        namespace,
        workspaceId
      );

      console.log('Yam created for workspace:', yam);

      const kubeconfig = await kube.retrieveKubeconfig(namespace, namespace);
      codeServerUrl = await kube.deployCodeServer(
        kubeconfig,
        'codeserver-1',
        'codeserver-1'
      );

      console.log('Code server URL:', codeServerUrl);
    } catch (e) {
      console.error('❌ Error creating yam:', e);
      return { error: 'Error creating yam.' };
    }
  }

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    return {
      success: true,
      message: 'Onboarding complete.',
      workspaceId,
      codeServerUrl,
    };
  } catch (e) {
    console.error('❌ Error updating Clerk metadata:', e);
    return { error: 'There was an error updating onboarding status.' };
  }
};
