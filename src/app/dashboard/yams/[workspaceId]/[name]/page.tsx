"use client";

import "@/styles/Dashboard.css";
import { useEffect, useState } from "react";
import LeftPanel from "../../../_components/LeftPanel";
import CreateYamDialog from "../../../_components/CreateYamDialog";
import RightPanelYam from "./_components/RightPanelYam";
import { SelectWorkspace } from "@/types/server";
import fetchWorkspaceList from "@/libs/queries/fetch-workspace-list";
import AiChatModal from "@/app/dashboard/_components/AiChatModal";

export default function YamPage() {
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
      } catch (err) {
        console.error(err);
        setError("Could not load workspaces. Please try again later.");
        setLoading(false);
      }
    }
    getWorkspaces();
  }, []);

  const loadingTxts = [
    "Creating your cluster with optimized defaults…",
    "Auto-scaling and security being configured in the background.",
    "We’re applying AI-powered enhancements for smooth performance.",
    "You’ll be ready to build in just a moment.",
  ];

  console.log(error);

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
      <section>
        {!loading && (
          <LeftPanel
            workspaces={workspaces}
            setShowYamDialog={setShowYamDialog}
            expandRightPanel={expandRightPanel}
            setExpandRightPanel={setExpandRightPanel}
          />
        )}
        <RightPanelYam
          expandRightPanel={expandRightPanel}
          setShowAiModal={setShowAiModal}
        />
      </section>
    </div>
  );
}
