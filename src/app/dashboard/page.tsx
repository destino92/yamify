"use client";

import RightPanel from "./_components/RightPanel";
import { useDashboard } from "./context/DashboardContext";

export default function Dashboard() {
  const { workspaces, expandRightPanel } = useDashboard();

  return (
    <RightPanel
      workspaces={workspaces}
      expandRightPanel={expandRightPanel}
    />
  );
}
