"use client";

import RightPanelProjects from "./components/RightPanelProjects";
import { useDashboard } from "../../context/DashboardContext";

export default function ProjectsPage() {
  const { expandRightPanel } = useDashboard();

  return (
    <RightPanelProjects
      expandRightPanel={expandRightPanel}
    />
  );
}
