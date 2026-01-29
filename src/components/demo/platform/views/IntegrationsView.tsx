import { 
  Plug,
  Cloud,
  Mail,
  HardDrive,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Settings,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const integrations = [
  { 
    id: "gdrive", 
    name: "Google Drive", 
    icon: Cloud, 
    status: "connected", 
    lastSync: "2 minutes ago",
    docsIngested: 142,
    autoSync: true 
  },
  { 
    id: "onedrive", 
    name: "Microsoft OneDrive", 
    icon: HardDrive, 
    status: "connected", 
    lastSync: "15 minutes ago",
    docsIngested: 67,
    autoSync: true 
  },
  { 
    id: "sharepoint", 
    name: "SharePoint", 
    icon: Cloud, 
    status: "syncing", 
    lastSync: "Syncing...",
    docsIngested: 0,
    autoSync: true 
  },
  { 
    id: "dropbox", 
    name: "Dropbox", 
    icon: Cloud, 
    status: "disconnected", 
    lastSync: "Never",
    docsIngested: 0,
    autoSync: false 
  },
  { 
    id: "email", 
    name: "Email Inbox", 
    icon: Mail, 
    status: "connected", 
    lastSync: "5 minutes ago",
    docsIngested: 89,
    autoSync: true 
  },
];

const erpIntegrations = [
  { id: "sap", name: "SAP", status: "connected", description: "Push validated data to SAP ERP" },
  { id: "salesforce", name: "Salesforce", status: "connected", description: "Sync contracts to CRM" },
  { id: "quickbooks", name: "QuickBooks", status: "disconnected", description: "Export invoices to accounting" },
  { id: "servicenow", name: "ServiceNow", status: "disconnected", description: "Trigger workflow automations" },
];

export function IntegrationsView() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Plug className="h-6 w-6 text-primary" />
          Integrations
        </h1>
        <p className="text-muted-foreground">Connect cloud storage, email, and enterprise systems</p>
      </div>

      {/* Cloud Storage */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Cloud Storage Connectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((int) => (
              <div 
                key={int.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <int.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{int.name}</p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          int.status === "connected" && "bg-success/10 text-success border-success/30",
                          int.status === "syncing" && "bg-warning/10 text-warning border-warning/30",
                          int.status === "disconnected" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {int.status === "connected" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {int.status === "syncing" && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                        {int.status === "disconnected" && <XCircle className="h-3 w-3 mr-1" />}
                        {int.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {int.status !== "disconnected" 
                        ? `${int.docsIngested} documents • Last sync: ${int.lastSync}`
                        : "Not connected"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {int.status !== "disconnected" && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Auto-sync</span>
                      <Switch checked={int.autoSync} />
                    </div>
                  )}
                  <Button 
                    variant={int.status === "disconnected" ? "default" : "outline"}
                    size="sm"
                  >
                    {int.status === "disconnected" ? "Connect" : "Configure"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ERP & CRM */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Enterprise Systems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {erpIntegrations.map((erp) => (
              <div 
                key={erp.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{erp.name}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        erp.status === "connected" 
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {erp.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{erp.description}</p>
                </div>
                <Button 
                  variant={erp.status === "disconnected" ? "default" : "outline"}
                  size="sm"
                >
                  {erp.status === "disconnected" ? "Connect" : "Settings"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">API Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">REST API</p>
                <p className="text-sm text-muted-foreground">Access documents and extracted data via API</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">Active</Badge>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Docs
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">Webhooks</p>
                <p className="text-sm text-muted-foreground">Receive real-time notifications for document events</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3 active hooks</Badge>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
