"use client";

import "@/styles/Dashboard.css";
import { useEffect, useState } from "react";
import LeftPanel from "../../_components/LeftPanel";
import CreateYamDialog from "../../_components/CreateYamDialog";
import DeployProject from "./components/DeployProject";
import { SelectWorkspace } from "@/types/server";
import fetchWorkspaceList from "@/libs/queries/fetch-workspace-list";
import AiChatModal from "../../_components/AiChatModal";

export default function YamsPage() {
  const [expandRightPanel, setExpandRightPanel] = useState(false);
  const [showYamDialog, setShowYamDialog] = useState(false);
  const [workspaces, setWorkspaces] = useState<SelectWorkspace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    async function getWorkspaces() {
      setLoading(true);
      try {
        const data = await fetchWorkspaceList();
        setWorkspaces(data);
        setLoading(false);
        console.log(data);
      } catch (err) {
        console.error(err);
        setError("Could not load workspaces. Please try again later.");
        setLoading(false);
      }
    }
    getWorkspaces();
  }, []);

  // If there is an error, log it to the console and display it to the user using a toast
  console.log(error);

  const loadingTxts = [
    "Creating your cluster with optimized defaults…",
    "Auto-scaling and security being configured in the background.",
    "We’re applying AI-powered enhancements for smooth performance.",
    "You’ll be ready to build in just a moment.",
  ];

  return (
    <div className="dashboard">
      {showYamDialog && (
        <CreateYamDialog
          workspaces={workspaces}
          loadingTxts={loadingTxts}
          setShowYamDialog={setShowYamDialog}
        />
      )}
      {showAiModal && <AiChatModal setShowAiModal={setShowAiModal} />}

      {!loading && (
        <section>
          <LeftPanel
            setShowYamDialog={setShowYamDialog}
            expandRightPanel={expandRightPanel}
            setExpandRightPanel={setExpandRightPanel}
            workspaces={workspaces}
          />
          <DeployProject
            expandRightPanel={expandRightPanel}
            setShowYamDialog={setShowYamDialog}
            setShowAiModal={setShowAiModal}
          />
        </section>
      )}
    </div>
  );
}
