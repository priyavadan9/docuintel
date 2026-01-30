import { useCFA, CFAView } from "@/contexts/CFAContext";
import { 
  LayoutDashboard, 
  Pickaxe, 
  Search, 
  Workflow,
  Shield,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: CFAView;
  label: string;
  icon: React.ElementType;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Compliance overview"
  },
  {
    id: "archaeologist",
    label: "The Archaeologist",
    icon: Pickaxe,
    description: "Data ingestion & OCR"
  },
  {
    id: "detective",
    label: "The Detective",
    icon: Search,
    description: "Analysis & gap detection"
  },
  {
    id: "orchestrator",
    label: "The Orchestrator",
    icon: Workflow,
    description: "Actions & outreach"
  }
];

interface CFASidebarProps {
  onClose?: () => void;
}

export function CFASidebar({ onClose }: CFASidebarProps) {
  const { currentView, setCurrentView } = useCFA();

  return (
    <aside className="w-64 bg-cfa-sidebar border-r border-cfa-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-cfa-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cfa-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Compliance</h1>
              <p className="text-xs text-cfa-muted">Forensic Agent</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-cfa-hover text-cfa-muted hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-xs font-medium text-cfa-muted uppercase tracking-wider px-3 mb-3">
          Agent Modes
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                isActive 
                  ? "bg-cfa-accent text-white shadow-md" 
                  : "text-cfa-muted hover:bg-cfa-hover hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-white")} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  isActive ? "text-white" : "text-cfa-text"
                )}>
                  {item.label}
                </p>
                <p className={cn(
                  "text-xs truncate",
                  isActive ? "text-white/70" : "text-cfa-muted"
                )}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cfa-border">
        <div className="bg-cfa-hover rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-cfa-text">System Status</span>
          </div>
          <p className="text-xs text-cfa-muted">All agents operational</p>
          <p className="text-xs text-cfa-muted">Last sync: 2 min ago</p>
        </div>
      </div>
    </aside>
  );
}
