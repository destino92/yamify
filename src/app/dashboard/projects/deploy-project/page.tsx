"use client";

import DeployProject from "./components/DeployProject";
import { useDashboard } from "../../context/DashboardContext";

export default function DeployProjectPage() {
  const { expandRightPanel } = useDashboard();

  return (
    <DeployProject
      expandRightPanel={expandRightPanel}
    />
  );
}
