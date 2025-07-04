import "@/styles/RightPanelDashboard.css";
import "@/styles/DeployProject.css";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { SelectYam } from "@/types/server";
import { useParams, useRouter } from "next/navigation";
import fetchYam from "@/libs/queries/fetch-yam";
import {
  deployCodeServerProjectAction,
  deployWordpressProjectAction,
  deployN8nProjectAction,
  type ActionResult
} from "@/app/dashboard/_actions";
import CreateAnimation from "@/components/Home/CreateAnimation";
import { toast } from "sonner";
import Notification from "@/components/Notification/Notification";

type Props = {
  expandRightPanel: boolean;
};

// Error types for better error handling
type ErrorType = 'NETWORK' | 'VALIDATION' | 'DEPLOYMENT' | 'LIMIT_EXCEEDED' | 'UNAUTHORIZED' | 'UNKNOWN';

interface DeploymentError {
  type: ErrorType;
  message: string;
  code?: string;
  userMessage: string;
  actionable: boolean;
}

// Deployment state management
type DeploymentState = 'idle' | 'deploying' | 'success' | 'error';

const DeployProject = ({ expandRightPanel }: Props) => {
  const [yam, setYam] = useState<SelectYam>();
  const [showAnimation, setShowAnimation] = useState(false);
  const [error, setError] = useState<DeploymentError | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploymentType, setDeploymentType] = useState<string>("");
  const [deploymentState, setDeploymentState] = useState<DeploymentState>('idle');

  const router = useRouter();

  const params = useParams();
  const yamName = params.name as string;

  const slug = decodeURIComponent(yamName);

  useEffect(() => {
    async function getWorkspaces() {
      setLoading(true);
      try {
        console.log("DeployProject: useEffect - Fetching YAM with slug:", slug);
        const data = await fetchYam({
          name: slug,
        });
        setYam(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.custom(() => <Notification title="Error !!!" description={"Could not load yam. Please try again later."} variant="error" />)
        setLoading(false);
      }
    }
    getWorkspaces();
  }, [slug]);

  // Error classification helper
  // Error classification helper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classifyError = useCallback((error: any, actionResult?: ActionResult): DeploymentError => {
    // Handle ActionResult errors
    if (actionResult && !actionResult.success) {
      const code = actionResult.code;
      const message = actionResult.error || 'Unknown error occurred';

      switch (code) {
        case 'UNAUTHORIZED':
          return {
            type: 'UNAUTHORIZED',
            message,
            code,
            userMessage: 'Your session has expired. Please sign in again.',
            actionable: true
          };
        case 'VALIDATION_ERROR':
          return {
            type: 'VALIDATION',
            message,
            code,
            userMessage: 'There was an issue with the deployment configuration. Please try again.',
            actionable: true
          };
        case 'DEPLOYMENT_LIMIT_EXCEEDED':
          return {
            type: 'LIMIT_EXCEEDED',
            message,
            code,
            userMessage: message, // Use the specific limit message from backend
            actionable: false
          };
        case 'DEPLOYMENT_FAILED':
          return {
            type: 'DEPLOYMENT',
            message,
            code,
            userMessage: 'The deployment failed due to a technical issue. Our team has been notified.',
            actionable: true
          };
        default:
          return {
            type: 'UNKNOWN',
            message,
            code,
            userMessage: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
            actionable: true
          };
      }
    }

    // Handle network and other errors
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      return {
        type: 'NETWORK',
        message: error.message,
        userMessage: 'Unable to connect to our servers. Please check your internet connection and try again.',
        actionable: true
      };
    }

    if (error?.message?.includes('timeout')) {
      return {
        type: 'NETWORK',
        message: error.message,
        userMessage: 'The request took too long to complete. Please try again.',
        actionable: true
      };
    }

    // Default error
    return {
      type: 'UNKNOWN',
      message: error?.message || 'Unknown error',
      userMessage: 'Something went wrong. Please try again or contact support if the issue continues.',
      actionable: true
    };
  }, []);

  // Enhanced error handling with user-friendly messages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = useCallback((error: any, context: string, actionResult?: ActionResult) => {
    console.error(`${context} error:`, error);
    
    const deploymentError = classifyError(error, actionResult);
    setError(deploymentError);
    setDeploymentState('error');
    setShowAnimation(false);

    // Show appropriate toast notification
    const toastTitle = getErrorTitle(deploymentError.type);

    toast.custom(() => (
      <Notification 
        title={toastTitle} 
        description={deploymentError.userMessage} 
        variant="error" 
      />
    ));

    // Handle specific error types
    if (deploymentError.type === 'UNAUTHORIZED') {
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 2000);
    }
  }, [classifyError, router]);

  // Get user-friendly error titles
  const getErrorTitle = (errorType: ErrorType): string => {
    switch (errorType) {
      case 'NETWORK':
        return 'Connection Error';
      case 'VALIDATION':
        return 'Configuration Error';
      case 'DEPLOYMENT':
        return 'Deployment Failed';
      case 'LIMIT_EXCEEDED':
        return 'Deployment Limit Reached';
      case 'UNAUTHORIZED':
        return 'Session Expired';
      default:
        return 'Error';
    }
  };

  // Fetch YAM data with error handling
  const fetchYamData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("DeployProject: Fetching YAM with slug:", slug);
      const data = await fetchYam({ name: slug });
      
      if (!data) {
        throw new Error('YAM not found');
      }
      
      setYam(data);
    } catch (err) {
      handleError(err, 'Fetch YAM');
    } finally {
      setLoading(false);
    }
  }, [slug, handleError]);

  useEffect(() => {
    fetchYamData();
  }, [fetchYamData]);

  // Redirect if no YAM found
  useEffect(() => {
    if (!loading && !yam && !error) {
      router.push("/dashboard");
    }
  }, [loading, yam, error, router]);

  // Generic deployment handler
  const handleDeployment = useCallback(async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deploymentAction: (params: any) => Promise<ActionResult>,
    appType: string,
    displayName: string
  ) => {
    if (!yam) {
      handleError(new Error('YAM configuration not available'), 'Deployment validation');
      return;
    }

    if (deploymentState === 'deploying') {
      console.warn('Deployment already in progress');
      return;
    }

    setDeploymentState('deploying');
    setShowAnimation(true);
    setError(null);
    setDeploymentType(displayName);

    const deploymentParams = {
      name: `${appType}-${Date.now()}`,
      namespace: "default",
      yamId: yam.id,
      workspaceId: yam.workspaceId,
    };

    try {
      console.log(`Starting ${displayName} deployment:`, deploymentParams);
      
      const result = await deploymentAction(deploymentParams);

      if (result.success) {
        setDeploymentState('success');
        toast.custom(() => (
          <Notification 
            title="Deployment Started!" 
            description={`${displayName} is being deployed. You'll be redirected shortly.`} 
            variant="success" 
          />
        ));
        
        // Auto-redirect after success
        setTimeout(() => {
          router.back();
        }, 3000);
      } else {
        handleError(new Error(result.error), `${displayName} deployment`, result);
      }
    } catch (error) {
      handleError(error, `${displayName} deployment`);
    }
  }, [yam, deploymentState, handleError, router]);

  // Specific deployment handlers
  const handleDeployWordPress = useCallback(() => {
    handleDeployment(deployWordpressProjectAction, 'wordpress', 'WordPress');
  }, [handleDeployment]);

  const handleDeployCodeServer = useCallback(() => {
    handleDeployment(deployCodeServerProjectAction, 'codeserver', 'VSCode Server');
  }, [handleDeployment]);

  const handleDeployN8n = useCallback(() => {
    handleDeployment(deployN8nProjectAction, 'n8n', 'n8n');
  }, [handleDeployment]);

  const loadingTxts = [
    "Provisioning resources...",
    "Deploying your app...",
    "Finalizing setup...",
    "Almost done!",
  ];

  const animationTitle = `We’re preparing your ${deploymentType} deployment tight!`;

  return (
    <div
      className={`right-panel right-panel-yams ${
        expandRightPanel && "not-expand"
      }`}
    >
      <div className="dummy-panel"></div>
      <div className="main-panel">

        {!loading && (
          <div className="section-deploy">
            <div onClick={() => router.back()} className="back-btn">
              <div className="wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M11.875 7.5H3.125M3.125 7.5L7.5 11.875M3.125 7.5L7.5 3.125"
                    stroke="#B8B8B8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p>Go back to Yam</p>
              </div>
            </div>

            <div className="deployment-container">
              <div className="desc">
                <h1>Start building something new.</h1>
                <p>
                  Deploy your apps installed from marketplace or create a new
                  pipeline.
                </p>
              </div>

              <div className="building">
                <div className="build marketplace">
                  <h2>Deploy from Marketplace</h2>

                  <p>Choose from a growing library of production-ready apps</p>

                  <div className="container">
                    {showAnimation ? (
                      <CreateAnimation
                        successBool={showAnimation}
                        loadingTxts={loadingTxts}
                        barColor="#BDFFFB"
                        title={animationTitle}
                      />
                    ) : (
                      <div className="apps">
                        <div className="app" onClick={handleDeployWordPress}>
                          <Image
                            src="/svgs/wordpress.svg"
                            alt=""
                            width={24}
                            height={24}
                          />

                          <div className="content">
                            <h4>Wordpress</h4>

                            <div className="txt">
                              Everything you need to build and grow any
                              website—all in one place.
                            </div>
                          </div>
                        </div>
                        <div className="app" onClick={handleDeployN8n}>
                          <Image
                            src="/svgs/n8n.svg"
                            alt=""
                            width={24}
                            height={24}
                          />

                          <div className="content">
                            <h4>n8n</h4>

                            <div className="txt">
                              Flexible AI workflow automation for technical
                              teams.
                            </div>
                          </div>
                        </div>
                        <div className="app" onClick={handleDeployCodeServer}>
                          <Image
                            src="/svgs/code-server.svg"
                            alt=""
                            width={24}
                            height={24}
                          />

                          <div className="content">
                            <h4>VS Code</h4>

                            <div className="txt">
                              Run VS Code and access it in the browser.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="build pipeline">
                <h2>Deploy from Pipeline</h2>

                <div className="static">
                  <div className="wrap">
                    <Image
                      src="/svgs/display.svg"
                      alt=""
                      height={15}
                      width={15}
                    />
                    <h3>Connect Your Code. We&apos;ll Handle the Rest.</h3>
                  </div>

                  <div className="content">
                    <p>
                      Push from GitHub, GitLab, or any Git provider. Yamify
                      automatically detects your language and framework,
                      recommends the best build method, and deploys your app
                      into an isolated Kubernetes environment (Yam).{" "}
                    </p>

                    <div className="btn">Connect your code</div>
                  </div>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployProject;
