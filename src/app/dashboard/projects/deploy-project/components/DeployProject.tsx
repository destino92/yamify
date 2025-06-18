import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import "@/styles/RightPanelDashboard.css";
import "@/styles/DeployProject.css";
import Image from "next/image";
import Link from "next/link";
import routes from "@/libs/routes";
import { useRouter } from "next/navigation";

type Props = {
  expandRightPanel: boolean;
  setShowYamDialog: (Callback: boolean) => void;
  setShowAiModal: (Callback: boolean) => void;
};

const DeployProject = ({ expandRightPanel, setShowAiModal }: Props) => {
  const router = useRouter();

  return (
    <div
      className={`right-panel right-panel-yams ${
        expandRightPanel && "not-expand"
      }`}
    >
      <div className="dummy-panel"></div>
      <div className="main-panel">
        <DashboardHeader setShowAiModal={setShowAiModal} />

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

              <p>Go back to Testing</p>
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
                  <div className="apps">
                    <Link
                      href={routes.dashboard.projects.installWordPress}
                      className="app"
                    >
                      <Image
                        src="/svgs/wordpress.svg"
                        alt=""
                        width={24}
                        height={24}
                      />

                      <div className="content">
                        <h4>Wordpress</h4>

                        <div className="txt">Install from Marketplace</div>
                      </div>
                    </Link>
                    <div className="app">
                      <Image src="/svgs/ai.svg" alt="" width={24} height={24} />

                      <div className="content">
                        <h4>AI Chatbot</h4>

                        <div className="txt">Install from Marketplace</div>
                      </div>
                    </div>
                  </div>
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
      </div>
    </div>
  );
};

export default DeployProject;
