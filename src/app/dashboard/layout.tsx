"use client";

import "@/styles/Dashboard.css";
import LeftPanel from "./_components/LeftPanel";
import CreateYamDialog from "./_components/CreateYamDialog";
import CreateWorkspaceDialog from "./_components/CreateWorkspaceDialog";
import AiChatModal from "./_components/AiChatModal";
import { DashboardProvider, useDashboard } from "./context/DashboardContext";
import DashboardHeader from "./_components/DashboardHeader";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </DashboardProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { 
    expandRightPanel, 
    setExpandRightPanel,
    showYamDialog,
    setShowYamDialog,
    showWorkspaceDialog,
    setShowWorkspaceDialog,
    workspaces,
    loading,
    showAiModal,
    setShowAiModal
  } = useDashboard();
  
  // Textes de chargement pour les composants de dialogue
  const loadingYamTxts = [
    "Creating your cluster with optimized defaults…",
    "Auto-scaling and security being configured in the background.",
    "We're applying AI-powered enhancements for smooth performance.",
    "You'll be ready to build in just a moment.",
  ];

  const loadingWorkspaceTxts = [
    "Welcome to Yamify—your reliable, affordable cloud.",
    "We're setting up your workspace, tools, and credits.",
    "AI is tailoring your experience now and adding your yam...",
    "Your virtual datacenter is getting ready.",
    "In a second now...your workspace and yam will be set.",
  ];

  return (
    <div className="">
      <DashboardHeader setShowAiModal={setShowAiModal} />
      {showYamDialog && (
        <CreateYamDialog
          setShowYamDialog={setShowYamDialog}
          loadingTxts={loadingYamTxts}
          workspaces={workspaces}
        />
      )}
      {showWorkspaceDialog && (
        <CreateWorkspaceDialog
          setShowWorkspaceDialog={setShowWorkspaceDialog}
          loadingTxts={loadingWorkspaceTxts}
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
          <div className={``}>
            {children}
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardLayout;
