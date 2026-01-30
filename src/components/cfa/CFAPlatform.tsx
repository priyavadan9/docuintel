import { CFAProvider, useCFA } from "@/contexts/CFAContext";
import { CFASidebar } from "./CFASidebar";
import { CFAHeader } from "./CFAHeader";
import { CFADashboard } from "./views/CFADashboard";
import { ArchaeologistView } from "./views/ArchaeologistView";
import { DetectiveView } from "./views/DetectiveView";
import { OrchestratorView } from "./views/OrchestratorView";

function CFAContent() {
  const { currentView } = useCFA();

  const views = {
    dashboard: <CFADashboard />,
    archaeologist: <ArchaeologistView />,
    detective: <DetectiveView />,
    orchestrator: <OrchestratorView />
  };

  return views[currentView] || <CFADashboard />;
}

interface CFAPlatformProps {
  onClose: () => void;
}

export function CFAPlatform({ onClose }: CFAPlatformProps) {
  return (
    <CFAProvider>
      <div className="fixed inset-0 z-50 bg-slate-50 flex animate-fade-in">
        <CFASidebar onClose={onClose} />
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
