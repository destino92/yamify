"use client";

import "@/styles/Dashboard.css";
import { useState } from "react";
import LeftPanel from "../../_components/LeftPanel";
import CreateYamDialog from "../../_components/CreateYamDialog";
import InstallWordpress from "./components/InstallWordpress";

export default function YamsPage() {
  const [expandRightPanel, setExpandRightPanel] = useState(false);
  const [showYamDialog, setShowYamDialog] = useState(false);

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
          loadingTxts={loadingTxts}
          setShowYamDialog={setShowYamDialog}
          workspaces={[]}
        />
      )}

      <section>
        <LeftPanel
          setShowYamDialog={setShowYamDialog}
          expandRightPanel={expandRightPanel}
          setExpandRightPanel={setExpandRightPanel}
        />
        <InstallWordpress
          expandRightPanel={expandRightPanel}
        />
      </section>
    </div>
  );
}
