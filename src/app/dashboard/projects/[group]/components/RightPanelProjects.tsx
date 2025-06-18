"use client";

import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import Button from "@/components/Button/Button";
import routes from "@/libs/routes";
import "@/styles/RightPanelDashboard.css";
import "@/styles/RightPanelDashboardProject.css";
import { groups } from "@/utils/data";
import { tag } from "@/utils/tags";
import Image from "next/image";
import Link from "next/link";
// import { useState } from "react";

type Props = {
  expandRightPanel: boolean;
  setShowAiModal: (Callback: boolean) => void;
};

const RightPanelProjects = ({ expandRightPanel, setShowAiModal }: Props) => {
  // const [projectExists, setProjectExists] = useState(true);

  return (
    <div
      className={`right-panel right-panel-yams ${
        expandRightPanel && "not-expand"
      }`}
    >
      <div className="dummy-panel"></div>
      <div className="main-panel">
        <DashboardHeader setShowAiModal={setShowAiModal} />

        {true ? (
          <div className="section-projects">
            <nav>
              <div className="wrap">
                {tag.icon({
                  color: groups[0].color,
                  width: 18,
                  height: 18,
                })}
                <h1>{groups[0].text}</h1>
              </div>

              {/* <button onClick={() => setShowYamDialog(true)}>
              <span>
                <Image alt="" src="/svgs/cluster.svg" width={15} height={15} />
                Create a Yam
              </span>
              <Image alt="" src="/svgs/plus.svg" width={15} height={15} />
            </button> */}
            </nav>

            <div className="deploy-container">
              <h2>No deployed project</h2>
              <p>
                Deploy your first application to get started with your
                Kubernetes environment. Once you deploy a project, you can
                access it here.
              </p>

              <Button
                href={routes.dashboard.projects.deployProject}
                linkBtn={true}
                yellow={true}
                text="Deploy a project"
              />
            </div>
          </div>
        ) : (
          <div className="section-projects">
            <nav>
              <div className="wrap">
                {tag.icon({
                  color: groups[0].color,
                  width: 18,
                  height: 18,
                })}
                <h1>{groups[0].text}</h1>
              </div>

              {/* <button onClick={() => setShowYamDialog(true)}>
              <span>
                <Image alt="" src="/svgs/cluster.svg" width={15} height={15} />
                Create a Yam
              </span>
              <Image alt="" src="/svgs/plus.svg" width={15} height={15} />
            </button> */}

              <Button
                href={routes.dashboard.projects.deployProject}
                linkBtn={true}
                yellow={true}
                text="Deploy a project"
              />
            </nav>

            {/* <div className="deploy-container">
              <h2>No deployed project</h2>
              <p>
                Deploy your first application to get started with your
                Kubernetes environment. Once you deploy a project, you can
                access it here.
              </p>

              <Button
                href={routes.dashboard.projects.deployProject}
                linkBtn={true}
                yellow={true}
                text="Deploy a project"
              />
            </div> */}

            <div className="deployed-application">
              <h2>Deployed Applications</h2>

              <div className="projects">
                <div className="project">
                  <div className="contain-head">
                    <div className="txt">
                      <Image
                        src="/svgs/wordpress.svg"
                        alt=""
                        width={15}
                        height={15}
                      />
                      <p>wpmarcus/yamifylandingpage</p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M8 8.125C8.34518 8.125 8.625 7.84518 8.625 7.5C8.625 7.15482 8.34518 6.875 8 6.875C7.65482 6.875 7.375 7.15482 7.375 7.5C7.375 7.84518 7.65482 8.125 8 8.125Z"
                        stroke="#E6E6E6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 3.75C8.34518 3.75 8.625 3.47018 8.625 3.125C8.625 2.77982 8.34518 2.5 8 2.5C7.65482 2.5 7.375 2.77982 7.375 3.125C7.375 3.47018 7.65482 3.75 8 3.75Z"
                        stroke="#E6E6E6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12.5C8.34518 12.5 8.625 12.2202 8.625 11.875C8.625 11.5298 8.34518 11.25 8 11.25C7.65482 11.25 7.375 11.5298 7.375 11.875C7.375 12.2202 7.65482 12.5 8 12.5Z"
                        stroke="#E6E6E6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="deploy-details">
                    <div className="wrap">
                      <div className="ctn">deployments</div>
                      <div className="ctn">5 mins ago on</div>
                      <div className="app">
                        <Image
                          src="/svgs/wordpress.svg"
                          alt=""
                          width={15}
                          height={15}
                        />
                        <p>wordpress</p>
                      </div>
                    </div>

                    <div className="status">running</div>
                  </div>

                  <div className="group-ctn">
                    {tag.icon({
                      color: groups[0].color,
                      width: 15,
                      height: 15,
                    })}
                    <p>{groups[0].text}</p>
                  </div>

                  <div className="project-links">
                    <h3>yamify landing page</h3>
                    <Link href="#" target="_blank">
                      www.yamify.co
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanelProjects;
