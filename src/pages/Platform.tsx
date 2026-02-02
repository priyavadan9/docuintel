import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CFAProvider, useCFA } from "@/contexts/CFAContext";
import { CFASidebar } from "@/components/cfa/CFASidebar";
import { CFAHeader } from "@/components/cfa/CFAHeader";
import { CFADashboard } from "@/components/cfa/views/CFADashboard";
import { ArchaeologistView } from "@/components/cfa/views/ArchaeologistView";
import { DetectiveView } from "@/components/cfa/views/DetectiveView";
import { OrchestratorView } from "@/components/cfa/views/OrchestratorView";
import { SyncConfigurationView } from "@/components/cfa/views/SyncConfigurationView";

function CFAContent() {
  const { currentView } = useCFA();

  const views: Record<string, React.ReactNode> = {
    dashboard: <CFADashboard />,
    archaeologist: <ArchaeologistView />,
    detective: <DetectiveView />,
    orchestrator: <OrchestratorView />,
    "sync-configuration": <SyncConfigurationView />
  };

  return <>{views[currentView] || <CFADashboard />}</>;
}

export default function Platform() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <CFAProvider>
      <div className="fixed inset-0 z-50 bg-slate-50 flex">
        <CFASidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <CFAHeader />
          <main className="flex-1 overflow-auto">
            <CFAContent />
          </main>
        </div>
      </div>
    </CFAProvider>
  );
}
