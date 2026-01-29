import { 
  LayoutDashboard, 
  Upload, 
  FileStack, 
  Brain, 
  AlertTriangle,
  Copy,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  Users,
  Plug,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useDemo, UserRole } from "@/contexts/DemoContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: number;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "user", "auditor"] },
  { id: "upload", label: "Upload Documents", icon: Upload, roles: ["admin", "user"] },
  { id: "documents", label: "Document Library", icon: FileStack, roles: ["admin", "user", "auditor"] },
  { id: "classification", label: "AI Classification", icon: Brain, roles: ["admin", "user", "auditor"] },
  { id: "exceptions", label: "Exceptions", icon: AlertTriangle, roles: ["admin", "user"] },
  { id: "duplicates", label: "Duplicates", icon: Copy, roles: ["admin", "user"] },
  { id: "chat", label: "Document Chat", icon: MessageSquare, roles: ["admin", "user", "auditor"] },
  { id: "analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "auditor"] },
  { id: "users", label: "User Management", icon: Users, roles: ["admin"] },
  { id: "integrations", label: "Integrations", icon: Plug, roles: ["admin"] },
  { id: "audit", label: "Audit Logs", icon: Shield, roles: ["admin", "auditor"] },
  { id: "settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

export function DemoSidebar() {
  const { role, setRole, activeView, setActiveView, stats } = useDemo();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  const getBadge = (id: string): number | undefined => {
    switch (id) {
      case "exceptions":
        return stats.exceptions > 0 ? stats.exceptions : undefined;
      case "duplicates":
        return stats.duplicates > 0 ? stats.duplicates : undefined;
      default:
        return undefined;
    }
  };

  return (
    <aside
      className={cn(
        "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-1.5 rounded-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">DocuSense</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Role Selector */}
      {!collapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <label className="text-xs text-muted-foreground mb-2 block">
            Demo Role
          </label>
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">Operations User</SelectItem>
              <SelectItem value="auditor">Auditor (Read-only)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const badge = getBadge(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                "hover:bg-sidebar-accent text-sidebar-foreground",
                activeView === item.id && "bg-sidebar-accent text-sidebar-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", activeView === item.id && "text-primary")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {badge && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
