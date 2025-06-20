import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import "@/styles/RightPanelDashboard.css";
import "@/styles/DeployProject.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SelectYam } from "@/types/server";
import { useParams } from "next/navigation";
import fetchYam from "@/libs/queries/fetch-yam";
import {
  deployCodeServerProjectAction,
  deployWordpressProjectAction,
  deployN8nProjectAction,
} from "@/app/dashboard/_actions";
import { useRouter } from "next/navigation";
import CreateAnimation from "@/components/Home/CreateAnimation";
import Notification from "@/components/Notification/Notification";

type Props = {
  expandRightPanel: boolean;
  setShowYamDialog: (Callback: boolean) => void;
  setShowAiModal: (Callback: boolean) => void;
};

const DeployProject = ({ expandRightPanel, setShowAiModal }: Props) => {
  const [yam, setYam] = useState<SelectYam>();
  const [showAnimation, setShowAnimation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
        setError("Could not load yam. Please try again later.");
        toast.custom(() => <Notification title="Error !!!" description={"Could not load yam. Please try again later."} variant="error" />)
        setLoading(false);
      }
    }
    getWorkspaces();
  }, [slug]); // errorNotification retiré des dépendances

  console.log(error);

  if (!yam) {
    return null;
  }

  const handleDeployWordPress = async () => {
    if (!yam) return;

    setShowAnimation(true);

    try {
      const result = await deployWordpressProjectAction({
        name: `wordpress-${Date.now()}`,
        namespace: "default",
        yamId: yam.id,
        workspaceId: yam.workspaceId,
      });

      if (result.success) {
        toast.custom(() => <Notification title="Success !!!" description="WordPress deployment created successfully!" variant="success" />)
        setShowAnimation(false);
        setTimeout(() => {
          router.back();
        }, 5000);
      } else if (result.error) {
        // Gérer les erreurs spécifiques comme les limites de déploiement atteintes
        setShowAnimation(false);
        console.error("WordPress deployment error:", result.error);
        toast.custom(() => <Notification title="Error !!!" description={result.error} variant="error" />)
      }
    } catch (error) {
      setShowAnimation(false);
      console.error("Failed to deploy WordPress:", error);
      toast.custom(() => <Notification title="Error !!!" description={"Failed to deploy WordPress. Please try again."} variant="error" />)
    }
  };

  const handleDeployCodeServer = async () => {
    if (!yam) return;

    setShowAnimation(true);

    try {
      const result = await deployCodeServerProjectAction({
        name: `codeserver-${Date.now()}`,
        namespace: "default",
        yamId: yam.id,
        workspaceId: yam.workspaceId,
      });

      if (result.success) {
        toast.custom(() => <Notification title="Success !!!" description="CodeServer deployment created successfully!" variant="success" />)
        setShowAnimation(false);
        setTimeout(() => {
          router.back();
        }, 5000);
      } else if (result.error) {
        // Gérer les erreurs spécifiques comme les limites de déploiement atteintes
        setShowAnimation(false);
        console.error("CodeServer deployment error:", result.error);
        toast.custom(() => <Notification title="Error !!!" description={result.error} variant="error" />)
      }
    } catch (error) {
      setShowAnimation(false);
      console.error("Failed to deploy CodeServer:", error);
      toast.custom(() => <Notification title="Error !!!" description="Failed to deploy CodeServer. Please try again." variant="error" />)
    }
  };

  const handleDeployN8n = async () => {
    if (!yam) return;

    setShowAnimation(true);

    try {
      const result = await deployN8nProjectAction({
        name: `n8n-${Date.now()}`,
        namespace: "default",
        yamId: yam.id,
        workspaceId: yam.workspaceId,
      });

      if (result.success) {
        toast.custom(() => <Notification title="Success !!!" description="n8n deployment created successfully!" variant="success" />)
        setShowAnimation(false);
        setTimeout(() => {
          router.back();
        }, 5000);
      } else if (result.error) {
        // Gérer les erreurs spécifiques comme les limites de déploiement atteintes
        setShowAnimation(false);
        console.error("n8n deployment error:", result.error);
        toast.custom(() => <Notification title="Error !!!" description={result.error} variant="error" />)
      }
    } catch (error) {
      setShowAnimation(false);
      console.error("Failed to deploy n8n:", error);
      toast.custom(() => <Notification title="Error !!!" description="Failed to deploy n8n. Please try again." variant="error" />)
    }
  };

  const loadingTxts = [
    "Provisioning resources...",
    "Deploying your app...",
    "Finalizing setup...",
    "Almost done!",
  ];

  const animationTitle = "We’re preparing your deployment—hang tight!";

  return (
    <div
      className={`right-panel right-panel-yams ${
        expandRightPanel && "not-expand"
      }`}
    >
      <div className="dummy-panel"></div>
      <div className="main-panel">
        <DashboardHeader setShowAiModal={setShowAiModal} />

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
