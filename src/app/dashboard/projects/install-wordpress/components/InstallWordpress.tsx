import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import "@/styles/RightPanelDashboard.css";
import "@/styles/DeployProject.css";
// import Image from "next/image";

type Props = {
  expandRightPanel: boolean;
  setShowYamDialog: (Callback: boolean) => void;
  setShowAiModal: (Callback: boolean) => void;
};

const InstallWordpress = ({ expandRightPanel, setShowAiModal }: Props) => {
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
          <div className="back-btn">
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

          <div className="deployment-container install-container">
            <div className="desc">
              <h1>Start building something new.</h1>
              <p>
                Deploy your apps installed from marketplace or create a new
                pipeline.
              </p>
            </div>

            <div className="install-wordpress">
              <div className="heading">
                <h2>Install Wordpress</h2>
                <p>Configure your Wordpress installation settings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallWordpress;
