"use client";

import RightPanelYam from "./_components/RightPanelYam";
import { useDashboard } from "../../../context/DashboardContext";

export default function YamPage() {
  const { expandRightPanel } = useDashboard();

  return (
    <RightPanelYam
      expandRightPanel={expandRightPanel}
    />
  );
}
