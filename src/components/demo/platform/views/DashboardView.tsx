import { useDemo } from "@/contexts/DemoContext";
import { 
  FileStack, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Copy,
  TrendingUp,
  Clock,
  Zap,
  Cloud,
  Mail,
  HardDrive
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const { stats, documents } = useDemo();

  const statCards = [
    { 
      label: "Documents Received", 
      value: stats.received, 
      icon: FileStack, 
      color: "text-info",
      bgColor: "bg-info/10"
    },
    { 
      label: "In Processing", 
      value: stats.processing, 
      icon: Loader2, 
      color: "text-warning",
      bgColor: "bg-warning/10",
      animate: true
    },
    { 
      label: "Successfully Processed", 
      value: stats.processed, 
      icon: CheckCircle2, 
      color: "text-success",
      bgColor: "bg-success/10"
    },
    { 
      label: "Exceptions", 
      value: stats.exceptions, 
      icon: AlertTriangle, 
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    { 
      label: "Duplicates Detected", 
      value: stats.duplicates, 
      icon: Copy, 
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
  ];

  const integrations = [
    { name: "Google Drive", status: "connected", icon: Cloud, docs: 142 },
    { name: "Email Inbox", status: "connected", icon: Mail, docs: 89 },
    { name: "OneDrive", status: "connected", icon: HardDrive, docs: 67 },
    { name: "SharePoint", status: "syncing", icon: Cloud, docs: 0 },
  ];

  const recentActivity = documents.slice(0, 5).map((doc) => ({
    id: doc.id,
    action: doc.status === "processed" ? "Processed" : doc.status === "processing" ? "Processing" : doc.status === "duplicate" ? "Duplicate detected" : doc.status === "exception" ? "Exception" : "Received",
    document: doc.name,
    time: formatTimeAgo(doc.uploadedAt),
    type: doc.type,
  }));

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your document processing</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color, stat.animate && "animate-spin")} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Processing Pipeline */}
        <Card className="col-span-2 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Processing Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Ingestion</span>
                <span className="text-muted-foreground">24 docs/hour</span>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Classification</span>
                <span className="text-muted-foreground">99.2% accuracy</span>
              </div>
              <Progress value={99} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Extraction</span>
                <span className="text-muted-foreground">96.8% accuracy</span>
              </div>
              <Progress value={97} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Validation</span>
                <span className="text-muted-foreground">94.5% pass rate</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrations.map((int) => (
                <div key={int.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <int.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{int.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {int.status === "syncing" ? (
                      <Loader2 className="h-3 w-3 animate-spin text-warning" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-success" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {int.status === "syncing" ? "Syncing..." : `${int.docs} docs`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    activity.action === "Processed" && "bg-success/10 text-success",
                    activity.action === "Processing" && "bg-warning/10 text-warning",
                    activity.action === "Exception" && "bg-warning/10 text-warning",
                    activity.action === "Duplicate detected" && "bg-destructive/10 text-destructive",
                    activity.action === "Received" && "bg-info/10 text-info",
                  )}>
                    {activity.action}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.document}</p>
                    <p className="text-xs text-muted-foreground capitalize">{activity.type}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
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
