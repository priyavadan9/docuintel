import { useState } from "react";
import { useDemo, Document } from "@/contexts/DemoContext";
import { 
  FileText, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Eye,
  Download,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Copy,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function DocumentsView() {
  const { documents, setActiveView } = useDemo();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Document Library</h1>
          <p className="text-muted-foreground">{documents.length} documents in your library</p>
        </div>
        <Button onClick={() => setActiveView("upload")}>
          Upload New
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="invoice">Invoices</SelectItem>
            <SelectItem value="contract">Contracts</SelectItem>
            <SelectItem value="policy">Policies</SelectItem>
            <SelectItem value="form">Forms</SelectItem>
            <SelectItem value="manual">Manuals</SelectItem>
            <SelectItem value="statement">Statements</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="exception">Exception</SelectItem>
            <SelectItem value="duplicate">Duplicate</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onClick={() => setSelectedDoc(doc)}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Document</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Source</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Uploaded</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <DocumentRow 
                    key={doc.id} 
                    document={doc}
                    onClick={() => setSelectedDoc(doc)}
                  />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Document Detail Panel */}
      {selectedDoc && (
        <DocumentDetailPanel 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}

function DocumentCard({ document, onClick }: { document: Document; onClick: () => void }) {
  return (
    <Card 
      className="bg-gradient-card border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <StatusBadge status={document.status} />
        </div>

        <h3 className="font-medium text-sm truncate mb-1">{document.name}</h3>
        <p className="text-xs text-muted-foreground capitalize mb-3">{document.type}</p>

        {document.confidence > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  document.confidence >= 90 ? "bg-success" : document.confidence >= 70 ? "bg-warning" : "bg-destructive"
                )}
                style={{ width: `${document.confidence}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{document.confidence.toFixed(1)}%</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground capitalize">{document.source}</span>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(document.uploadedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentRow({ document, onClick }: { document: Document; onClick: () => void }) {
  return (
    <tr 
      className="border-b border-border last:border-0 hover:bg-secondary/30 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{document.name}</span>
        </div>
      </td>
      <td className="p-4">
        <Badge variant="outline" className="capitalize">{document.type}</Badge>
      </td>
      <td className="p-4">
        <StatusBadge status={document.status} />
      </td>
      <td className="p-4">
        {document.confidence > 0 ? (
          <span className={cn(
            "text-sm",
            document.confidence >= 90 ? "text-success" : document.confidence >= 70 ? "text-warning" : "text-destructive"
          )}>
            {document.confidence.toFixed(1)}%
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
      <td className="p-4">
        <span className="text-sm capitalize">{document.source}</span>
      </td>
      <td className="p-4">
        <span className="text-sm text-muted-foreground">{formatTimeAgo(document.uploadedAt)}</span>
      </td>
      <td className="p-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> View</DropdownMenuItem>
            <DropdownMenuItem><Download className="h-4 w-4 mr-2" /> Download</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: Document["status"] }) {
  const config = {
    processed: { icon: CheckCircle2, label: "Processed", className: "bg-success/10 text-success border-success/30" },
    processing: { icon: Loader2, label: "Processing", className: "bg-warning/10 text-warning border-warning/30" },
    pending: { icon: Clock, label: "Pending", className: "bg-info/10 text-info border-info/30" },
    exception: { icon: AlertTriangle, label: "Exception", className: "bg-warning/10 text-warning border-warning/30" },
    duplicate: { icon: Copy, label: "Duplicate", className: "bg-destructive/10 text-destructive border-destructive/30" },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <Icon className={cn("h-3 w-3", status === "processing" && "animate-spin")} />
      {label}
    </Badge>
  );
}

function DocumentDetailPanel({ document, onClose }: { document: Document; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-elevated z-50 animate-slide-in-right overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Document Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="sr-only">Close</span>
            ×
          </Button>
        </div>

        <div className="space-y-6">
          {/* Preview */}
          <div className="aspect-[3/4] bg-secondary/50 rounded-lg flex items-center justify-center">
            <FileText className="h-16 w-16 text-muted-foreground" />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="font-medium">{document.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="outline" className="mt-1 capitalize">{document.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">
                  <StatusBadge status={document.status} />
                </div>
              </div>
            </div>
            {document.confidence > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Classification Confidence</p>
                <p className="font-medium">{document.confidence.toFixed(1)}%</p>
              </div>
            )}
          </div>

          {/* Extracted Data */}
          {document.extractedData && (
            <div>
              <h3 className="font-medium mb-3">Extracted Fields</h3>
              <div className="space-y-2">
                {Object.entries(document.extractedData).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 rounded bg-secondary/30">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View Full
            </Button>
          </div>
        </div>
      </div>
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
