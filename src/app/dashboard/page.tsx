"use client";

import LeftPanel from "./_components/LeftPanel";
import "@/styles/Dashboard.css";
import RightPanel from "./_components/RightPanel";
import { useEffect, useState } from "react";
import CreateYamDialog from "./_components/CreateYamDialog";
import CreateWorkspaceDialog from "./_components/CreateWorkspaceDialog";
import fetchWorkspaceList from "@/libs/queries/fetch-workspace-list";
import { SelectWorkspace } from "@/types/server";
import AiChatModal from "./_components/AiChatModal";

export default function Dashboard() {
  const [expandRightPanel, setExpandRightPanel] = useState(false);
  const [showYamDialog, setShowYamDialog] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showWorkspaceDialog, setShowWorkspaceDialog] = useState(false);
  const [workspaces, setWorkspaces] = useState<SelectWorkspace[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWorkspaces() {
      setLoading(true);
      try {
        const data = await fetchWorkspaceList();
        setWorkspaces(data);
        setLoading(false);
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

  const loadingYamTxts = [
    "Creating your cluster with optimized defaults…",
    "Auto-scaling and security being configured in the background.",
    "We’re applying AI-powered enhancements for smooth performance.",
    "You’ll be ready to build in just a moment.",
  ];

  const loadingWorkspaceTxts = [
    "Welcome to Yamify—your reliable, affordable cloud.",
    "We’re setting up your workspace, tools, and credits.",
    "AI is tailoring your experience now and adding your yam...",
    "Your virtual datacenter is getting ready.",
    "In a second now...your workspace and yam will be set.",
  ];

  return (
    <div className="dashboard">
      {showYamDialog && (
        <CreateYamDialog
          workspaces={workspaces}
          loadingTxts={loadingYamTxts}
          setShowYamDialog={setShowYamDialog}
        />
      )}
      {showWorkspaceDialog && (
        <CreateWorkspaceDialog
          loadingTxts={loadingWorkspaceTxts}
          setShowYamDialog={setShowWorkspaceDialog}
        />
      )}
      {showAiModal && <AiChatModal setShowAiModal={setShowAiModal} />}

      {!loading && (
        <section>
          <LeftPanel
            expandRightPanel={expandRightPanel}
            setExpandRightPanel={setExpandRightPanel}
            setShowYamDialog={setShowYamDialog}
            setShowWorkspaceDialog={setShowWorkspaceDialog}
            workspaces={workspaces}
          />
          <RightPanel
            workspaces={workspaces}
            expandRightPanel={expandRightPanel}
            setShowAiModal={setShowAiModal}
          />
        </section>
      )}
    </div>
  );
}
