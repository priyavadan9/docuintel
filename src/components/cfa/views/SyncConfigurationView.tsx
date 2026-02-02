import { useState, useEffect, useCallback, useRef } from "react";
import { useCFA, CloudProvider, SyncFrequency, Document } from "@/contexts/CFAContext";
import { 
  Cloud, 
  Check, 
  X, 
  Link2, 
  Unlink,
  RefreshCw,
  HardDrive,
  Building2,
  ExternalLink,
  Timer,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sync frequency options
const syncFrequencyOptions: { value: SyncFrequency; label: string }[] = [
  { value: "15min", label: "Every 15 minutes" },
  { value: "30min", label: "Every 30 minutes" },
  { value: "1hour", label: "Every 1 hour" },
  { value: "6hours", label: "Every 6 hours" },
  { value: "daily", label: "Daily" },
];

// Mock file names for auto-sync simulation
const mockSyncedFiles = [
  { name: "Q4_2023_PFAS_Inventory.pdf", size: 234567 },
  { name: "Supplier_Compliance_Report.pdf", size: 456789 },
  { name: "Chemical_Safety_Data_Sheet.xlsx", size: 123456 },
  { name: "Manufacturing_Process_Docs.pdf", size: 345678 },
  { name: "Environmental_Audit_2024.pdf", size: 567890 },
  { name: "Vendor_PFAS_Declaration.pdf", size: 198765 },
  { name: "Product_Testing_Results.csv", size: 87654 },
  { name: "Regulatory_Compliance_Matrix.xlsx", size: 234567 },
];

// Provider logos and colors
const providerConfig = {
  "google-drive": {
    name: "Google Drive",
    icon: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg",
    color: "bg-[#4285f4]",
    bgLight: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
  },
  dropbox: {
    name: "Dropbox",
    icon: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg",
    color: "bg-[#0061ff]",
    bgLight: "bg-sky-50 hover:bg-sky-100",
    borderColor: "border-sky-200",
  },
  onedrive: {
    name: "OneDrive",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg",
    color: "bg-[#0078d4]",
    bgLight: "bg-indigo-50 hover:bg-indigo-100",
    borderColor: "border-indigo-200",
  },
  box: {
    name: "Box",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/57/Box%2C_Inc._logo.svg",
    color: "bg-[#0061d5]",
    bgLight: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
  },
  sharepoint: {
    name: "SharePoint",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Microsoft_Office_SharePoint_%282019%E2%80%93present%29.svg",
    color: "bg-[#038387]",
    bgLight: "bg-teal-50 hover:bg-teal-100",
    borderColor: "border-teal-200",
  },
  "aws-s3": {
    name: "AWS S3",
    icon: "",
    color: "bg-[#ff9900]",
    bgLight: "bg-orange-50 hover:bg-orange-100",
    borderColor: "border-orange-200",
  },
};

export function SyncConfigurationView() {
  const { cloudProviders, setCloudProviders, addAuditEntry, setDocuments } = useCFA();
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const syncTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Simulate auto-sync for connected providers
  const simulateAutoSync = useCallback((provider: CloudProvider) => {
    if (!provider.connected || !provider.syncFrequency) return;

    // Pick a random file to "sync"
    const mockFile = mockSyncedFiles[Math.floor(Math.random() * mockSyncedFiles.length)];
    const providerName = providerConfig[provider.id as keyof typeof providerConfig]?.name || provider.name;
    
    // Check for duplicates (same name + provider = single record)
    setDocuments(prev => {
      const existingDoc = prev.find(d => d.name === mockFile.name && d.syncedFrom === providerName);
      if (existingDoc) {
        // Update existing doc's uploadedAt
        return prev.map(d => d.id === existingDoc.id ? { ...d, uploadedAt: new Date() } : d);
      }
      
      // Create new document from synced file
      const newDoc: Document = {
        id: `doc-sync-${Date.now()}-${Math.random()}`,
        name: mockFile.name,
        type: mockFile.name.endsWith(".pdf") ? "pdf" : mockFile.name.endsWith(".xlsx") ? "xlsx" : "csv",
        size: mockFile.size,
        uploadedAt: new Date(),
        processedAt: new Date(),
        status: "indexed",
        source: "cloud-storage",
        syncedFrom: providerName,
        extractedChemicals: Math.floor(Math.random() * 5) + 1,
      };
      
      return [newDoc, ...prev];
    });
    
    // Update provider last synced and file count
    setCloudProviders(prev => prev.map(p => 
      p.id === provider.id 
        ? { ...p, lastSynced: new Date(), filesCount: (p.filesCount || 0) + 1 }
        : p
    ));

    addAuditEntry({
      action: "Auto-Sync Complete",
      user: "System",
      details: `${mockFile.name} synced from ${providerName}`,
      type: "system",
    });

    toast.success(`File synced from ${providerName}`, {
      description: mockFile.name,
    });
  }, [setDocuments, setCloudProviders, addAuditEntry]);

  // Set up auto-sync timers for connected providers
  useEffect(() => {
    const connectedProviders = cloudProviders.filter(p => p.connected && p.syncFrequency);
    
    // Clear old timers
    syncTimersRef.current.forEach((timer, id) => {
      if (!connectedProviders.find(p => p.id === id)) {
        clearInterval(timer);
        syncTimersRef.current.delete(id);
      }
    });

    // Set up new timers (using shorter intervals for demo purposes)
    connectedProviders.forEach(provider => {
      if (!syncTimersRef.current.has(provider.id)) {
        // For demo: use 30 seconds for "15min", 45s for "30min", etc.
        const demoIntervals: Record<SyncFrequency, number> = {
          "15min": 30000,
          "30min": 45000,
          "1hour": 60000,
          "6hours": 90000,
          "daily": 120000,
        };
        
        const interval = demoIntervals[provider.syncFrequency!] || 45000;
        const timer = setInterval(() => simulateAutoSync(provider), interval);
        syncTimersRef.current.set(provider.id, timer);
      }
    });

    return () => {
      syncTimersRef.current.forEach(timer => clearInterval(timer));
      syncTimersRef.current.clear();
    };
  }, [cloudProviders, simulateAutoSync]);

  const handleConnect = (providerId: string) => {
    setConnectingProvider(providerId);
    setOauthModalOpen(true);
  };

  const handleOAuthSuccess = () => {
    if (!connectingProvider) return;
    
    const config = providerConfig[connectingProvider as keyof typeof providerConfig];
    const mockEmails: Record<string, string> = {
      "google-drive": "compliance@acmecorp.com",
      dropbox: "team@acmecorp.com",
      onedrive: "admin@acmecorp.onmicrosoft.com",
      box: "documents@acmecorp.com",
      sharepoint: "legal@acmecorp.onmicrosoft.com",
      "aws-s3": "aws-admin@acmecorp.com",
    };

    const newProvider: CloudProvider = {
      id: connectingProvider,
      name: config.name,
      connected: true,
      accountEmail: mockEmails[connectingProvider] || "user@company.com",
      lastSynced: new Date(),
      filesCount: Math.floor(Math.random() * 500) + 100,
      syncFrequency: "30min",
      autoSyncEnabled: true,
    };

    setCloudProviders(prev => {
      const existing = prev.findIndex(p => p.id === connectingProvider);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newProvider;
        return updated;
      }
      return [...prev, newProvider];
    });

    addAuditEntry({
      action: "Cloud Storage Connected",
      user: "John Smith",
      details: `Connected ${config.name} (${mockEmails[connectingProvider]})`,
      type: "system",
    });

    setOauthModalOpen(false);
    setConnectingProvider(null);

    toast.success(`${config.name} connected successfully`, {
      description: "You can now select files from this drive",
    });
  };

  const handleDisconnect = (provider: CloudProvider) => {
    setSelectedProvider(provider);
    setDisconnectModalOpen(true);
  };

  const confirmDisconnect = () => {
    if (!selectedProvider) return;

    setCloudProviders(prev => prev.filter(p => p.id !== selectedProvider.id));

    addAuditEntry({
      action: "Cloud Storage Disconnected",
      user: "John Smith",
      details: `Disconnected ${selectedProvider.name}`,
      type: "system",
    });

    setDisconnectModalOpen(false);
    setSelectedProvider(null);

    toast.success(`${selectedProvider.name} disconnected`);
  };

  const handleSync = (provider: CloudProvider) => {
    simulateAutoSync(provider);
  };

  const handleFrequencyChange = (providerId: string, frequency: SyncFrequency) => {
    setCloudProviders(prev => prev.map(p => 
      p.id === providerId ? { ...p, syncFrequency: frequency } : p
    ));

    const providerName = providerConfig[providerId as keyof typeof providerConfig]?.name || providerId;
    toast.success(`Sync frequency updated`, {
      description: `${providerName} will sync ${syncFrequencyOptions.find(o => o.value === frequency)?.label.toLowerCase()}`,
    });
  };

  const formatLastSynced = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const connectedCount = cloudProviders.filter(p => p.connected).length;

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cloud className="w-6 h-6 text-teal-600" />
            Sync Configuration
          </h2>
          <p className="text-slate-500 mt-1">
            Connect external drives to ingest documents directly
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-50">
                  <Link2 className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{connectedCount}</p>
                  <p className="text-sm text-slate-500">Connected Providers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {cloudProviders.reduce((sum, p) => sum + (p.filesCount || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">Files Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-50">
                  <Building2 className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">6</p>
                  <p className="text-sm text-slate-500">Supported Providers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Provider Cards */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800">
              Cloud Storage Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(providerConfig).map(([id, config]) => {
                const provider = cloudProviders.find(p => p.id === id);
                const isConnected = provider?.connected;

                return (
                  <div
                    key={id}
                    className={cn(
                      "p-5 rounded-xl border-2 transition-all",
                      isConnected 
                        ? "border-emerald-300 bg-emerald-50/50" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.color)}>
                          {config.icon ? (
                            <img 
                              src={config.icon} 
                              alt={config.name} 
                              className="w-6 h-6"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Cloud className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{config.name}</h3>
                          {isConnected && provider?.accountEmail && (
                            <p className="text-xs text-slate-500 truncate max-w-[150px]">
                              {provider.accountEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        className={cn(
                          "border",
                          isConnected 
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        )}
                      >
                        {isConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>

                    {isConnected && provider ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Last synced</span>
                          <span className="text-slate-700 font-medium">
                            {formatLastSynced(provider.lastSynced!)}
                          </span>
                        </div>
                        
                        {/* Sync Frequency Dropdown */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Timer className="w-3.5 h-3.5" />
                            Sync Frequency
                          </span>
                          <Select 
                            value={provider.syncFrequency || "30min"} 
                            onValueChange={(value) => handleFrequencyChange(provider.id, value as SyncFrequency)}
                          >
                            <SelectTrigger className="w-36 h-7 text-xs border-slate-200 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {syncFrequencyOptions.map(option => (
                                <SelectItem key={option.value} value={option.value} className="text-xs">
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Files indexed</span>
                          <span className="text-slate-700 font-medium">
                            {provider.filesCount?.toLocaleString()}
                          </span>
                        </div>

                        {/* Auto-sync indicator */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 rounded-md px-2 py-1 border border-emerald-200">
                                <Zap className="w-3 h-3" />
                                <span className="font-medium">Auto-sync enabled</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Files will be automatically synced based on your schedule</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                            onClick={() => handleSync(provider)}
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1" />
                            Sync Now
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                            onClick={() => handleDisconnect(provider)}
                          >
                            <Unlink className="w-3.5 h-3.5 mr-1" />
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2"
                        onClick={() => handleConnect(id)}
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* OAuth Modal */}
        <Dialog open={oauthModalOpen} onOpenChange={setOauthModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900">
                Connect {connectingProvider && providerConfig[connectingProvider as keyof typeof providerConfig]?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Authorize access to ingest documents for PFAS compliance analysis
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center",
                  connectingProvider && providerConfig[connectingProvider as keyof typeof providerConfig]?.color
                )}>
                  {connectingProvider && providerConfig[connectingProvider as keyof typeof providerConfig]?.icon ? (
                    <img 
                      src={providerConfig[connectingProvider as keyof typeof providerConfig].icon} 
                      alt="" 
                      className="w-10 h-10"
                    />
                  ) : (
                    <Cloud className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">
                    PFAS Intelligence Platform is requesting permission to:
                  </p>
                  <ul className="text-sm text-left space-y-2 text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      View and download files
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Access folder structure
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Read file metadata
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setOauthModalOpen(false)}
                className="border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleOAuthSuccess}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Authorize Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Disconnect Confirmation Modal */}
        <Dialog open={disconnectModalOpen} onOpenChange={setDisconnectModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-900">
                Disconnect {selectedProvider?.name}?
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                This will remove access to files from this storage provider. 
                Previously indexed documents will remain in the system.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setDisconnectModalOpen(false)}
                className="border-slate-200 text-slate-700"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDisconnect}
                className="bg-rose-600 hover:bg-rose-700"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
