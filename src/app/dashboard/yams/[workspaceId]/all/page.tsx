"use client";

import RightPanelYams from "./_components/RightPanelYams";
import { useDashboard } from "@/app/dashboard/context/DashboardContext";

export default function AllYamsPage() {
  const { expandRightPanel, setShowYamDialog } = useDashboard();

  return (
    <RightPanelYams
      expandRightPanel={expandRightPanel}
      setShowYamDialog={setShowYamDialog}
    />
  );
}
