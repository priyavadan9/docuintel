import { 
  Shield,
  Clock,
  User,
  FileText,
  Eye,
  Edit,
  Download,
  LogIn,
  LogOut,
  Settings,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const auditLogs = [
  { id: 1, user: "John Doe", action: "Viewed", target: "INV-2024-001.pdf", timestamp: new Date(Date.now() - 1000 * 60 * 5), type: "view" },
  { id: 2, user: "Jane Smith", action: "Edited", target: "Contract_TechCorp.pdf", timestamp: new Date(Date.now() - 1000 * 60 * 15), type: "edit", details: "Updated extracted vendor field" },
  { id: 3, user: "John Doe", action: "Downloaded", target: "Q4_Statement.pdf", timestamp: new Date(Date.now() - 1000 * 60 * 30), type: "download" },
  { id: 4, user: "Admin", action: "Login", target: "System", timestamp: new Date(Date.now() - 1000 * 60 * 45), type: "login" },
  { id: 5, user: "Jane Smith", action: "Approved", target: "Privacy_Policy.pdf", timestamp: new Date(Date.now() - 1000 * 60 * 60), type: "approve" },
  { id: 6, user: "John Doe", action: "Uploaded", target: "Batch_Invoices.zip", timestamp: new Date(Date.now() - 1000 * 60 * 90), type: "upload" },
  { id: 7, user: "Admin", action: "Settings Changed", target: "Duplicate Detection", timestamp: new Date(Date.now() - 1000 * 60 * 120), type: "settings" },
  { id: 8, user: "Jane Smith", action: "Logout", target: "System", timestamp: new Date(Date.now() - 1000 * 60 * 180), type: "logout" },
];

const getActionIcon = (type: string) => {
  switch (type) {
    case "view": return Eye;
    case "edit": return Edit;
    case "download": return Download;
    case "login": return LogIn;
    case "logout": return LogOut;
    case "settings": return Settings;
    case "upload": return FileText;
    default: return FileText;
  }
};

const getActionColor = (type: string) => {
  switch (type) {
    case "view": return "text-info bg-info/10";
    case "edit": return "text-warning bg-warning/10";
    case "download": return "text-primary bg-primary/10";
    case "login": return "text-success bg-success/10";
    case "logout": return "text-muted-foreground bg-muted";
    case "settings": return "text-warning bg-warning/10";
    case "upload": return "text-success bg-success/10";
    case "approve": return "text-success bg-success/10";
    default: return "text-muted-foreground bg-muted";
  }
};

export function AuditView() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Audit Logs
        </h1>
        <p className="text-muted-foreground">Complete activity trail for compliance and security</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="view">Views</SelectItem>
            <SelectItem value="edit">Edits</SelectItem>
            <SelectItem value="download">Downloads</SelectItem>
            <SelectItem value="login">Logins</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="today">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Total Events Today</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">Document Views</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Edits Made</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {auditLogs.map((log) => {
              const Icon = getActionIcon(log.type);
              const colorClass = getActionColor(log.type);
              
              return (
                <div 
                  key={log.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className={cn("p-2 rounded-lg", colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.user}</span>
                      <span className="text-muted-foreground">{log.action.toLowerCase()}</span>
                      <span className="font-medium">{log.target}</span>
                    </div>
                    {log.details && (
                      <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatTimeAgo(log.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
