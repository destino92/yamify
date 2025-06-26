import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { execa } from 'execa';
import * as k8s from '@kubernetes/client-node';
import type { CoreV1ApiCreateNamespaceRequest, CoreV1ApiReadNamespaceRequest } from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
// kc.loadFromFile(process.env.KUBECONFIG_PATH || '');
kc.loadFromDefault();
const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
const networkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);

export const kube = {
  checkNamespaceExists: async (name: string): Promise<boolean> => {
    try {
      const request: CoreV1ApiReadNamespaceRequest = {
          // name of the Namespace
        name,
          // If \'true\', then the output is pretty printed. Defaults to \'false\' unless the user-agent indicates a browser or command-line HTTP tool (curl and wget). (optional)
        pretty: "true",
      };
      const existingNamespace = await coreV1Api.readNamespace(request);
      console.log({existingNamespace});
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle 404 errors - namespace doesn't exist
      // Different Kubernetes clients might return errors in different formats
      if (error.response?.statusCode === 404 || error.code === 404) {
        console.log(`Namespace ${name} does not exist yet - this is expected`);
        return false;
      }
      
      // Log the error for debugging
      console.error('Error checking namespace existence:', error);
      
      // Re-throw other errors (network issues, auth problems, etc.)
      throw error;
    }
  },
  
  createNamespace: async (name: string) => {
    try {
      const request: CoreV1ApiCreateNamespaceRequest = {
        body: {
          metadata: {
            name: name,
            labels: {
              'yamify.co/workspace': name,
              'yamify.co/managed': 'true'
            }
          }
        }
      };

      const namespace = await coreV1Api.createNamespace(request);
      return namespace;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.statusCode === 409) {
        throw new Error(`Namespace "${name}" already exists`);
      }
      throw error;
    }
  },  

  createNamespaceIngress: async (name: string) => {
    try {
      const response = await networkingV1Api.createNamespacedIngress({
        namespace: name,
        body: {
          metadata: {
            name: `${name}-ingress`,
            labels: {
              'yamify.co/workspace': name,
              'yamify.co/managed': 'true'
            },
            annotations: {
              // 'kubernetes.io/ingress.class': 'nginx',
              'nginx.ingress.kubernetes.io/backend-protocol': 'HTTPS',
              'nginx.ingress.kubernetes.io/ssl-passthrough': 'true',
              'nginx.ingress.kubernetes.io/ssl-redirect': 'true',
              'external-dns.alpha.kubernetes.io/hostname': `${name}.aiscaler.ai`,
              'cert-manager.io/cluster-issuer': 'letsencrypt-staging',
            },
          },
          spec: {
            ingressClassName: 'nginx',
            tls: [
              {
                hosts: [`${name}.aiscaler.ai`],
                secretName: `${name}-tls-cert`,
              },
            ],
            rules: [
              {
                host: `${name}.aiscaler.ai`,  // team-a.aiscaler.ai
                http: {
                  paths: [
                    {
                      path: '/',
                      pathType: 'ImplementationSpecific',
                      backend: {
                        service: {
                          name: name,
                          port: {
                            number: 443,
                          },
                        },
                      },
                    },
                  ],
                }
              }
            ]
          }
        }
      });

      return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.statusCode === 409) {
        throw new Error(`Ingress for namespace "${name}" already exists`);
      }
      throw error;
    }
  },

  deleteNamespace: async (name: string) => {
    try {
      await coreV1Api.deleteNamespace({name});
      // Wait for namespace to be fully deleted (with timeout)
      await kube.waitForNamespaceDeletion(name, 60000); // 60 seconds timeout

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.statusCode === 404) {
        console.log(`Namespace "${name}" already deleted`);
        return;
      }
      throw error;
    }
  },

  waitForNamespaceDeletion: async (name: string, timeoutMs: number): Promise<void> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const exists = await kube.checkNamespaceExists(name);
        if (!exists) {
          return;
        }
        
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn('Error checking namespace deletion status:', error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error(`Timeout waiting for namespace "${name}" to be deleted`);
  },

  createVCluster: async (name: string, namespace: string) => {
    const values = 
    `
controlPlane:
  ingress:
    enabled: false
  proxy:
    extraSANs:
      - ${namespace}.aiscaler.ai
sync:
  toHost:
    ingresses:
      enabled: true
  fromHost:
    ingressClasses:
      enabled: true
`;

    const tmpValuesPath = join(tmpdir(), `vcluster-values-${name}.yaml`);

    await fs.writeFile(tmpValuesPath, values);

    try {
      // Create the vCluster
      await execa('vcluster', [
        'create',
        name,
        '-n',
        namespace,
        '--connect=false',
        '-f',
        tmpValuesPath,
      ]);
    } finally {
      await fs.unlink(tmpValuesPath);
    }


  },

  retrieveKubeconfig: async (clusterName: string, namespace: string): Promise<string> => {
    const { stdout } = await execa('vcluster', [
      'connect',
      clusterName,
      '-n',
      namespace,
      '--print',
      `--server=https://${namespace}.aiscaler.ai`,
    ]);

    return stdout;
  },

  deleteVCluster: async (name: string, namespace: string) => {
    await execa('vcluster', ['delete', name, '-n', namespace]);
  },

  waitForVCluster: async (kubeconfigPath: string, maxRetries = 10, delayMs = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await execa('kubectl', ['--kubeconfig', kubeconfigPath, 'get', 'ns']);
      console.log('✅ vCluster is ready');
      return;
    } catch (err) {
      if( err instanceof Error ) {
      console.error(`❌ vCluster not ready yet: ${err}`);
      }
      console.log(`⏳ Waiting for vCluster to be ready... (${attempt}/${maxRetries})`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  throw new Error('❌ Timed out waiting for vCluster to become ready.');
},

  createVclusterNamespace: async (vclusterKubeconfig: string, namespace: string) => {
    const kubeconfigPath = join(tmpdir(), `kubeconfig-vcluster.yaml`);
    try {
      await fs.writeFile(kubeconfigPath, vclusterKubeconfig);
      const namespaceResponse = await execa('kubectl', [
        '--kubeconfig', kubeconfigPath,
        'create', 'namespace', namespace,
      ]).catch((err) => {
        if (!err.stderr?.includes('AlreadyExists')) throw err;
      });

      console.log('vcluster namespace created', namespaceResponse)
    } catch(error) {
      console.error('Error creating vcluster namespace:', error);
    }
  },

  deployCodeServer: async (
  vclusterKubeconfig: string,
  yamNamespace: string,
  namespace: string
): Promise<string> => {
  const host = `${yamNamespace}-codeserver.aiscaler.ai`;

  const kubeconfigPath = join(tmpdir(), `kubeconfig-${yamNamespace}.yaml`);
  const valuesPath = join(tmpdir(), `values-${yamNamespace}.yaml`);
  await fs.writeFile(kubeconfigPath, vclusterKubeconfig);

  const values = `
image:
  repository: ghcr.io/linuxserver/code-server
  pullPolicy: IfNotPresent
  tag: "latest"

secret:
  PASSWORD: "changeme"

env:
  TZ: "UTC"
  PUID: "1000"
  PGID: "1000"

service:
  port:
    port: 8443

ingress:
  enabled: true
  ingressClassName: "nginx"
  annotations:
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTP"
    kubernetes.io/ingress.class: nginx
    external-dns.alpha.kubernetes.io/hostname: ${host}
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: "${host}"
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: ${yamNamespace}-codeserver-tls-cert
      hosts:
        - ${host}

persistence:
  config:
    enabled: true
    emptyDir: false
    mountPath: /config
    accessMode: ReadWriteOnce
    size: 10Gi
`;

  await fs.writeFile(valuesPath, values);

  try {
    // Wait until vCluster API is reachable
    await kube.waitForVCluster(kubeconfigPath);

    // Add and update Helm repo
    await execa('helm', ['repo', 'add', 'nicholaswilde', 'https://nicholaswilde.github.io/helm-charts/']);
    await execa('helm', ['repo', 'update']);

    // Create namespace if needed
    // await execa('kubectl', [
    //   '--kubeconfig', kubeconfigPath,
    //   'create', 'namespace', namespace,
    // ]).catch((err) => {
    //   if (!err.stderr?.includes('AlreadyExists')) throw err;
    // });

    // Install code-server chart
    await execa('helm', [
      'install',
      'codeserver',
      'nicholaswilde/code-server',
      '--namespace', namespace,
      '-f', valuesPath,
      '--kubeconfig', kubeconfigPath,
      '--debug',
    ]);

    // ✅ Wait for deployment rollout
    await execa('kubectl', [
      '--kubeconfig', kubeconfigPath,
      'rollout',
      'status',
      'deployment/codeserver-code-server',
      '--namespace', namespace,
      '--timeout=300s',
    ]);
  } catch (error) {
    // Optional uninstall on failure
    await execa('helm', [
      'uninstall',
      'codeserver',
      '--namespace', namespace,
      '--kubeconfig', kubeconfigPath,
    ]).catch(() => {});
    console.error('Error deploying code-server:', error);
    throw new Error(`code-server deployment failed: ${error}`);
  } finally {
    await fs.unlink(kubeconfigPath);
    await fs.unlink(valuesPath);
  }

  return `https://${host}`;
},

  // Modified to work with app deployments inside vClusters
  deployWordpress: async (
  vclusterKubeconfig: string,
  yamNamespace: string, // Unique across all apps
  namespace: string
): Promise<{ url: string; user: string; password: string }> => {
  const host = `${yamNamespace}-wordpress.aiscaler.ai`;

  const kubeconfigPath = join(tmpdir(), `kubeconfig-${yamNamespace}.yaml`);
  const valuesPath = join(tmpdir(), `values-${yamNamespace}.yaml`);
  await fs.writeFile(kubeconfigPath, vclusterKubeconfig);

  const values = `
wordpressUsername: user
wordpressPassword: "password"

service:
  type: ClusterIP

ingress:
  enabled: true
  pathType: ImplementationSpecific
  ingressClassName: nginx
  hostname: ${host}
  path: /
  annotations:
    external-dns.alpha.kubernetes.io/hostname: ${host}
    cert-manager.io/cluster-issuer: letsencrypt-prod
  tls: true
`;

  await fs.writeFile(valuesPath, values);

  try {
    // Wait until vCluster API is reachable
    await kube.waitForVCluster(kubeconfigPath);

    // Create namespace inside vCluster
    // await execa('kubectl', [
    //   '--kubeconfig', kubeconfigPath,
    //   'create', 'namespace', namespace,
    // ]).catch((err) => {
    //   if (!err.stderr?.includes('AlreadyExists')) throw err;
    // });

    // Install WordPress inside the vCluster
    await execa('helm', [
      'install',
      'wordpress',
      'oci://registry-1.docker.io/bitnamicharts/wordpress',
      '--namespace', namespace,
      '-f', valuesPath,
      '--kubeconfig', kubeconfigPath,
      '--debug',
    ]);

    // ✅ Wait for the WordPress Deployment to complete rollout
    await execa('kubectl', [
      '--kubeconfig', kubeconfigPath,
      'rollout',
      'status',
      'deployment/wordpress',
      '--namespace', namespace,
      '--timeout=300s',
    ]);
  } catch (error) {
    // Optional: uninstall chart on failure
    await execa('helm', [
      'uninstall',
      'wordpress',
      '--namespace', namespace,
      '--kubeconfig', kubeconfigPath,
    ]).catch(() => {});
    console.error('Error deploying WordPress:', error);
    throw new Error(`Deployment failed: ${error}`);
  } finally {
    await fs.unlink(kubeconfigPath);
    await fs.unlink(valuesPath);
  }

  return {
    url: `https://${host}/wp-admin`,
    user: 'user',
    password: 'password',
  };
},

  deployN8n: async (
  vclusterKubeconfig: string,
  yamNamespace: string,
  namespace: string
): Promise<{ url: string }> => {
  const host = `${yamNamespace}-n8n.aiscaler.ai`;

  const kubeconfigPath = join(tmpdir(), `kubeconfig-${yamNamespace}.yaml`);
  const valuesPath = join(tmpdir(), `values-${yamNamespace}.yaml`);
  await fs.writeFile(kubeconfigPath, vclusterKubeconfig);

  const values = `
main:
  count: 1
  pdb:
    enabled: true
    minAvailable: 1

  resources: 
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 2000m
      memory: 1Gi

ingress:
  enabled: true
  className: nginx
  annotations: 
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    external-dns.alpha.kubernetes.io/hostname: ${host}
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: ${host}
      paths:
        - path: /
          pathType: Prefix
  tls: 
    - secretName: ${yamNamespace}-n8n-test-tls
      hosts:
        - ${host}
`;

  await fs.writeFile(valuesPath, values);

  try {
    // Wait until vCluster API is reachable
    await kube.waitForVCluster(kubeconfigPath);

    // Add and update Helm repository
    await execa('helm', ['repo', 'add', 'community-charts', 'https://community-charts.github.io/helm-charts']);
    await execa('helm', ['repo', 'update']);

    // Install n8n via Helm
    await execa('helm', [
      'install',
      'n8n',
      'community-charts/n8n',
      '--namespace', namespace,
      '-f', valuesPath,
      '--kubeconfig', kubeconfigPath,
      '--debug',
    ]);

    // ✅ Wait for the Deployment rollout
    await execa('kubectl', [
      '--kubeconfig', kubeconfigPath,
      'rollout',
      'status',
      'deployment/n8n',
      '--namespace', namespace,
      '--timeout=300s',
    ]);
  } catch (error) {
    // Optional cleanup on failure
    await execa('helm', [
      'uninstall',
      'n8n',
      '--namespace', namespace,
      '--kubeconfig', kubeconfigPath,
    ]).catch(() => {});
    console.error('Error deploying n8n:', error);
    throw new Error(`n8n deployment failed: ${error}`);
  } finally {
    await fs.unlink(kubeconfigPath);
    await fs.unlink(valuesPath);
  }

  return {
    url: `https://${host}`,
  };
},
};