import { useState } from "react";
import { useCFA, CloudProvider } from "@/contexts/CFAContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Folder,
  FileText,
  ChevronRight,
  ChevronDown,
  Cloud,
  ArrowLeft,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudFile {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: number;
  children?: CloudFile[];
}

interface CloudFilePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesSelected: (files: { name: string; size: number; source: string }[]) => void;
}

// Mock folder structure for each provider
const mockFolderStructure: Record<string, CloudFile[]> = {
  "google-drive": [
    {
      id: "gd-1",
      name: "Compliance Documents",
      type: "folder",
      children: [
        { id: "gd-1-1", name: "SDS_Archive_2010-2015.pdf", type: "file", size: 4521000 },
        { id: "gd-1-2", name: "Purchase_Records_Q1_2012.xlsx", type: "file", size: 892000 },
        { id: "gd-1-3", name: "Vendor_Contracts_2013.pdf", type: "file", size: 2341000 },
      ],
    },
    {
      id: "gd-2",
      name: "Legacy Archives",
      type: "folder",
      children: [
        { id: "gd-2-1", name: "Warehouse_Inventory_2011.csv", type: "file", size: 156000 },
        { id: "gd-2-2", name: "Chemical_Manifest_2014.pdf", type: "file", size: 1823000 },
        {
          id: "gd-2-3",
          name: "Lab Reports",
          type: "folder",
          children: [
            { id: "gd-2-3-1", name: "Analysis_Report_A1.pdf", type: "file", size: 543000 },
            { id: "gd-2-3-2", name: "Analysis_Report_A2.pdf", type: "file", size: 612000 },
          ],
        },
      ],
    },
    { id: "gd-3", name: "EPA_Correspondence_2015.pdf", type: "file", size: 234000 },
  ],
  dropbox: [
    {
      id: "db-1",
      name: "Shared Compliance",
      type: "folder",
      children: [
        { id: "db-1-1", name: "Supplier_SDS_Collection.pdf", type: "file", size: 8912000 },
        { id: "db-1-2", name: "Material_Safety_2012.pdf", type: "file", size: 1234000 },
      ],
    },
    { id: "db-2", name: "Audit_Documentation_2016.pdf", type: "file", size: 567000 },
  ],
  onedrive: [
    {
      id: "od-1",
      name: "Legal & Compliance",
      type: "folder",
      children: [
        { id: "od-1-1", name: "TSCA_Compliance_Checklist.xlsx", type: "file", size: 234000 },
        { id: "od-1-2", name: "Chemical_Registry_Export.csv", type: "file", size: 456000 },
      ],
    },
  ],
  box: [
    {
      id: "box-1",
      name: "Document Vault",
      type: "folder",
      children: [
        { id: "box-1-1", name: "Historical_Records_2010.pdf", type: "file", size: 3421000 },
        { id: "box-1-2", name: "Batch_Records_Archive.pdf", type: "file", size: 5678000 },
      ],
    },
  ],
  sharepoint: [
    {
      id: "sp-1",
      name: "Compliance Library",
      type: "folder",
      children: [
        { id: "sp-1-1", name: "Regulatory_Framework.pdf", type: "file", size: 1234000 },
        { id: "sp-1-2", name: "Internal_Audit_2015.docx", type: "file", size: 892000 },
      ],
    },
  ],
  "aws-s3": [
    {
      id: "s3-1",
      name: "compliance-bucket",
      type: "folder",
      children: [
        { id: "s3-1-1", name: "archived_invoices.zip", type: "file", size: 15234000 },
        { id: "s3-1-2", name: "email_exports.pst", type: "file", size: 89120000 },
      ],
    },
  ],
};

const providerNames: Record<string, string> = {
  "google-drive": "Google Drive",
  dropbox: "Dropbox",
  onedrive: "OneDrive",
  box: "Box",
  sharepoint: "SharePoint",
  "aws-s3": "AWS S3",
};

const providerColors: Record<string, string> = {
  "google-drive": "bg-[#4285f4]",
  dropbox: "bg-[#0061ff]",
  onedrive: "bg-[#0078d4]",
  box: "bg-[#0061d5]",
  sharepoint: "bg-[#038387]",
  "aws-s3": "bg-[#ff9900]",
};

export function CloudFilePicker({ open, onOpenChange, onFilesSelected }: CloudFilePickerProps) {
  const { cloudProviders } = useCFA();
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const connectedProviders = cloudProviders.filter(p => p.connected);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getAllFiles = (items: CloudFile[]): CloudFile[] => {
    let files: CloudFile[] = [];
    items.forEach(item => {
      if (item.type === "file") {
        files.push(item);
      } else if (item.children) {
        files = files.concat(getAllFiles(item.children));
      }
    });
    return files;
  };

  const handleAddToQueue = () => {
    if (!selectedProvider) return;
    
    const files = mockFolderStructure[selectedProvider.id] || [];
    const allFiles = getAllFiles(files);
    const selected = allFiles.filter(f => selectedFiles.has(f.id));
    
    onFilesSelected(selected.map(f => ({
      name: f.name,
      size: f.size || 0,
      source: selectedProvider.id,
    })));

    // Reset state
    setSelectedFiles(new Set());
    setSelectedProvider(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    setSelectedProvider(null);
    setSelectedFiles(new Set());
    setExpandedFolders(new Set());
  };

  const renderFileTree = (items: CloudFile[], depth = 0) => {
    return items.map(item => {
      const isExpanded = expandedFolders.has(item.id);
      const isSelected = selectedFiles.has(item.id);

      if (item.type === "folder") {
        return (
          <div key={item.id}>
            <div
              className={cn(
                "flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors",
                "text-slate-700"
              )}
              style={{ paddingLeft: `${depth * 16 + 12}px` }}
              onClick={() => toggleFolder(item.id)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
              <Folder className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="animate-fade-in">
                {renderFileTree(item.children, depth + 1)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className={cn(
            "flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors",
            isSelected ? "bg-teal-50 text-teal-700" : "hover:bg-slate-100 text-slate-700"
          )}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => toggleFileSelection(item.id)}
        >
          <Checkbox 
            checked={isSelected} 
            className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
          />
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="text-sm flex-1 truncate">{item.name}</span>
          {item.size && (
            <span className="text-xs text-slate-400">{formatFileSize(item.size)}</span>
          )}
        </div>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-900 flex items-center gap-2">
            {selectedProvider && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-600"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Cloud className="w-5 h-5 text-teal-600" />
            {selectedProvider ? `Browse ${providerNames[selectedProvider.id]}` : "Select from Connected Drives"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {selectedProvider 
              ? "Select files to add to the processing queue"
              : "Choose a connected cloud storage provider"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          {!selectedProvider ? (
            // Provider selection
            <div className="grid grid-cols-2 gap-3 py-4">
              {connectedProviders.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <Cloud className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="font-medium text-slate-700">No connected drives</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Go to Sync Configuration to connect a cloud storage provider
                  </p>
                </div>
              ) : (
                connectedProviders.map(provider => (
                  <div
                    key={provider.id}
                    className="p-4 rounded-xl border-2 border-slate-200 hover:border-teal-400 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", providerColors[provider.id])}>
                        <Cloud className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">{providerNames[provider.id]}</p>
                        <p className="text-xs text-slate-500 truncate">{provider.accountEmail}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-slate-200 text-slate-500">
                        {provider.filesCount?.toLocaleString()} files
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // File browser
            <ScrollArea className="h-[400px] py-2">
              <div className="space-y-1">
                {mockFolderStructure[selectedProvider.id] ? (
                  renderFileTree(mockFolderStructure[selectedProvider.id])
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-slate-700">No files found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {selectedProvider && (
          <DialogFooter className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-slate-500">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToQueue}
                  disabled={selectedFiles.size === 0}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add to Processing Queue
                </Button>
              </div>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
