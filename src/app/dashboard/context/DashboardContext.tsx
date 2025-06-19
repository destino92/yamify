"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { SelectWorkspace } from "@/types/server";
import fetchWorkspaceList from "@/libs/queries/fetch-workspace-list";

type DashboardContextType = {
  expandRightPanel: boolean;
  setExpandRightPanel: (value: boolean) => void;
  showYamDialog: boolean;
  setShowYamDialog: (value: boolean) => void;
  showWorkspaceDialog: boolean;
  setShowWorkspaceDialog: (value: boolean) => void;
  workspaces: SelectWorkspace[];
  loading: boolean;
  error: string | null;
  showAiModal: boolean;
  setShowAiModal: (value: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [expandRightPanel, setExpandRightPanel] = useState(false);
  const [showYamDialog, setShowYamDialog] = useState(false);
  const [showWorkspaceDialog, setShowWorkspaceDialog] = useState(false);
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

  return (
    <DashboardContext.Provider 
      value={{ 
        expandRightPanel, 
        setExpandRightPanel, 
        showYamDialog, 
        setShowYamDialog,
        showWorkspaceDialog,
        setShowWorkspaceDialog, 
        workspaces,
        loading,
        error,
        showAiModal,
        setShowAiModal
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
