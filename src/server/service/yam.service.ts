import { yamRepository } from '../repository/yam.repository';
import { kube } from '../module/kube.module';

export const yamService = {
  list: (workspaceId: string) => yamRepository.listByWorkspace(workspaceId),

  getByName: (name: string) => yamRepository.getByName(name),

  createAndStoreVCluster: async (clusterName: string, namespace: string, workspaceId: string) => {
    const response = await kube.createVCluster(clusterName, namespace);
    const kubeconfig = await kube.retrieveKubeconfig(clusterName, namespace);

    console.log({response})
    console.log({kubeconfig})
    
    await yamRepository.create({
        name: clusterName,
        namespace,
        kubeConfig: kubeconfig,
        workspaceId,
    });
  },

  remove: async ({ id, name, workspaceId }: { id: string; name: string; workspaceId: string }) => {
    await kube.deleteVCluster(name, workspaceId);
    return yamRepository.delete(id);
  },
};