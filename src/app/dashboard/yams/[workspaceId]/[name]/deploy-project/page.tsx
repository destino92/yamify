"use client";

import DeployProject from "./components/DeployProject";
import { useDashboard } from "@/app/dashboard/context/DashboardContext";

export default function YamDeployProjectPage() {
  const { expandRightPanel } = useDashboard();

  return (
    <DeployProject
      expandRightPanel={expandRightPanel}
    />
  );
}
