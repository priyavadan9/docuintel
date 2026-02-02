import { CFAProvider, useCFA } from "@/contexts/CFAContext";
import { CFASidebar } from "./CFASidebar";
import { CFAHeader } from "./CFAHeader";
import { CFADashboard } from "./views/CFADashboard";
import { ArchaeologistView } from "./views/ArchaeologistView";
import { DetectiveView } from "./views/DetectiveView";
import { OrchestratorView } from "./views/OrchestratorView";
import { SyncConfigurationView } from "./views/SyncConfigurationView";

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

export function CFAPlatform() {
  return (
    <CFAProvider>
      <div className="fixed inset-0 z-50 bg-slate-50 flex animate-fade-in">
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
