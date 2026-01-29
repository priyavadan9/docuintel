import { useState, useCallback } from "react";
import { useDemo, Document } from "@/contexts/DemoContext";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  X, 
  Cloud,
  Mail,
  FolderOpen,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
}

export function UploadView() {
  const { addDocument, setActiveView } = useDemo();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const simulateUpload = useCallback((files: { name: string; size: number }[]) => {
    files.forEach((file, index) => {
      const fileId = Date.now().toString() + index;
      
      setUploadingFiles((prev) => [
        ...prev,
        { id: fileId, name: file.name, size: file.size, progress: 0, status: "uploading" },
      ]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: "processing" } : f))
          );

          // Simulate processing
          setTimeout(() => {
            setUploadingFiles((prev) =>
              prev.map((f) => (f.id === fileId ? { ...f, status: "complete" } : f))
            );

            // Add to documents
            const docType = getDocTypeFromName(file.name);
            addDocument({
              name: file.name,
              type: docType,
              status: "processing",
              confidence: 0,
              uploadedAt: new Date(),
              size: file.size,
              source: "upload",
            });

            // Simulate processing complete
            setTimeout(() => {
              // Document will be updated in context
            }, 2000);
          }, 1500);
        } else {
          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
          );
        }
      }, 200);
    });
  }, [addDocument]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).map((f) => ({
      name: f.name,
      size: f.size,
    }));
    
    if (files.length > 0) {
      simulateUpload(files);
    }
  };

  const handleFileSelect = () => {
    // Simulate file selection
    simulateUpload([
      { name: "Invoice_March_2024.pdf", size: 245000 },
      { name: "Contract_Renewal.docx", size: 890000 },
    ]);
  };

  const handleBulkUpload = () => {
    simulateUpload([
      { name: "Batch_Invoices.zip", size: 4500000 },
    ]);
  };

  const cloudSources = [
    { name: "Google Drive", icon: Cloud, connected: true },
    { name: "OneDrive", icon: Cloud, connected: true },
    { name: "SharePoint", icon: FolderOpen, connected: true },
    { name: "Dropbox", icon: Cloud, connected: false },
    { name: "Email Inbox", icon: Mail, connected: true },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Upload Documents</h1>
        <p className="text-muted-foreground">Drag and drop or connect cloud storage for automatic sync</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Drop Zone */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Manual Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
                isDragging 
                  ? "border-primary bg-primary/10" 
                  : "border-border hover:border-primary/50 hover:bg-secondary/30"
              )}
              onClick={handleFileSelect}
            >
              <Upload className={cn(
                "h-12 w-12 mx-auto mb-4",
                isDragging ? "text-primary animate-bounce" : "text-muted-foreground"
              )} />
              <p className="text-lg font-medium mb-2">
                {isDragging ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: PDF, DOCX, XLSX, JPG, PNG, TIFF, EML
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleFileSelect}>
                Browse Files
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleBulkUpload}>
                Bulk ZIP Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cloud Sources */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Cloud Connectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cloudSources.map((source) => (
                <div 
                  key={source.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <source.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {source.connected ? "Auto-sync enabled" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant={source.connected ? "outline" : "default"}
                    size="sm"
                  >
                    {source.connected ? "Configure" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadingFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                  <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <Progress value={file.progress} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {file.status === "uploading" && `Uploading... ${Math.round(file.progress)}%`}
                      {file.status === "processing" && "Processing with AI..."}
                      {file.status === "complete" && "Complete"}
                    </p>
                  </div>
                  {file.status === "complete" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : file.status === "processing" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground" />
                  )}
                </div>
              ))}
            </div>
            
            {uploadingFiles.some((f) => f.status === "complete") && (
              <Button 
                className="mt-4 w-full" 
                onClick={() => {
                  setUploadingFiles([]);
                  setActiveView("documents");
                }}
              >
                View in Document Library
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getDocTypeFromName(name: string): Document["type"] {
  const lower = name.toLowerCase();
  if (lower.includes("invoice") || lower.includes("inv")) return "invoice";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("policy")) return "policy";
  if (lower.includes("form")) return "form";
  if (lower.includes("manual")) return "manual";
  return "statement";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
