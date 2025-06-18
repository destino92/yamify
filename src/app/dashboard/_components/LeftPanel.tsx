"use client";

import React, { useState } from "react";
import "@/styles/LeftPanelDashboard.css";
import Image from "next/image";
import Link from "next/link";
import routes from "@/libs/routes";
// import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SelectWorkspace } from "@/types/server";
// import { tag } from "@/utils/tags";
// import { groups } from "@/utils/data";

type Props = {
  setExpandRightPanel: (Callback: boolean) => void;
  setShowYamDialog?: (Callback: boolean) => void;
  setShowWorkspaceDialog?: (Callback: boolean) => void;
  expandRightPanel: boolean;
  workspaces?: SelectWorkspace[]; // Make workspaces optional
};

const LeftPanel = ({
  expandRightPanel,
  setExpandRightPanel,
  setShowWorkspaceDialog,
  workspaces = [], // Default to empty array
}: Props) => {
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<SelectWorkspace | null>(
      workspaces.length > 0 ? workspaces[0] : null
    );
  // const [collapseYam, setCollapseYam] = useState(true);
  const [dropDownWorkspace, setDropDownWorkspace] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <div className={`left-panel ${expandRightPanel && "not-expand"}`}>
      <div className="contain">
        <div className="head">
          <div className="logo">
            {!expandRightPanel ? (
              <Image
                src="/svgs/panel_logo.svg"
                alt="Yamify Logo"
                className="logo-img"
                width={12}
                height={15.2}
              />
            ) : (
              <div className="wrap-head">
                <Image
                  src="/svgs/panel_logo.svg"
                  alt="Yamify Logo"
                  className="logo-img"
                  width={12}
                  onClick={() => setExpandRightPanel(!expandRightPanel)}
                  style={{ cursor: "pointer" }}
                  height={15.2}
                />
              </div>
            )}
            <h1>Yamify</h1>
          </div>

          <Image
            src="/svgs/sidebar.svg"
            alt=""
            className="side-bar"
            height={15}
            width={15}
            onClick={() => setExpandRightPanel(!expandRightPanel)}
          />
        </div>

        <div className="links-container">
          <Link
            href={routes.dashboard.overview}
            className={`link ${
              pathname === routes.dashboard.overview && "active"
            }`}
          >
            <Image src="/svgs/grid.svg" alt="" width={15} height={15} />
            <p>Dashboard</p>
          </Link>

          <div className="workspace-container">
            <div className="workspace-link">
              <div className="wrap">
                <Image
                  src={user?.imageUrl ?? "/svgs/user_green.svg"}
                  alt=""
                  width={18}
                  height={18}
                />
                <p>{selectedWorkspace?.name ?? "No Workspace Selected"}</p>
              </div>

              <Image
                src="/svgs/more_horizontal.svg"
                className="more-icon"
                alt=""
                width={15}
                height={15}
                onClick={() => setDropDownWorkspace(!dropDownWorkspace)}
              />

              {dropDownWorkspace && (
                <div className="drop-down">
                  {selectedWorkspace && (
                    <div className="workspace-row">
                      <div className="wr">
                        <Image
                          src={user?.imageUrl ?? "/svgs/user_green.svg"}
                          alt=""
                          width={18}
                          height={18}
                        />
                        <p>{selectedWorkspace.name}</p>
                      </div>

                      <Image
                        src="/svgs/checkmark.svg"
                        className="checkmark"
                        alt=""
                        width={15}
                        height={15}
                        onClick={() => setDropDownWorkspace(!dropDownWorkspace)}
                      />
                    </div>
                  )}

                  {workspaces
                    .filter(
                      (workspace) => workspace.id !== selectedWorkspace?.id
                    )
                    .map((workspace) => (
                      <div
                        className="workspace-row"
                        key={workspace.id}
                        onClick={() => setSelectedWorkspace(workspace)}
                      >
                        <div className="wr">
                          <Image
                            src={user?.imageUrl ?? "/svgs/user_green.svg"}
                            alt=""
                            width={18}
                            height={18}
                          />
                          <p>{workspace.name}</p>
                        </div>
                      </div>
                    ))}

                  <div className="workspace-end">
                    <div
                      className="wr"
                      onClick={() => {
                        if (setShowWorkspaceDialog) {
                          setShowWorkspaceDialog(true);
                        }
                      }}
                    >
                      <Image
                        src="/svgs/plus.svg"
                        alt=""
                        width={15}
                        height={15}
                      />
                      <p>Create new workspace</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {selectedWorkspace && (
              <Link
                href={routes.dashboard.yams.single(selectedWorkspace.name, selectedWorkspace.id)}
                className={`link ${
                  pathname ===
                    routes.dashboard.yams.single(selectedWorkspace.name, selectedWorkspace.id) && "active"
                }`}
              >
                <Image src="/svgs/cluster.svg" alt="" width={15} height={15} />
                <p>Yam</p>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* <div className="group-container">
        <div className="wrap" onClick={() => setCollapseYam(!collapseYam)}>
          <h2>Group</h2>
          <Image
            src={collapseYam ? "/svgs/caret_up.svg" : "/svgs/caret_down.svg"}
            alt=""
            width={15}
            height={15}
          />
        </div>

        <AnimatePresence initial={false}>
          {collapseYam && (
            <motion.div
              key="tag-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="groups"
              style={{ overflow: "hidden" }}
            >
              <Link
                href={routes.dashboard.projects.group(groups[0].text)}
                className={`group text-[${groups[0].color}]`}
              >
                {tag.icon({
                  color: groups[0].color,
                })}
                <h2>{groups[0].text}</h2>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}
    </div>
  );
};

export default LeftPanel;
