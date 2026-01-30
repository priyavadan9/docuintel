import { useState, useCallback } from "react";
import { useCFA, UploadedFile, ProcessingStatus, Document } from "@/contexts/CFAContext";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  Loader2,
  Eye,
  Sparkles,
  FileSearch,
  Filter,
  Clock,
  FileSpreadsheet,
  Mail,
  Cloud,
  Archive,
  ChevronRight,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ArchaeologistView() {
  const { 
    uploadedFiles, 
    setUploadedFiles, 
    selectedFile, 
    setSelectedFile, 
    addAuditEntry,
    documents,
    setDocuments,
    chemicalRecords,
    setChemicalRecords
  } = useCFA();
  
  const [isDragging, setIsDragging] = useState(false);
  const [documentFilter, setDocumentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const simulateProcessing = useCallback((file: UploadedFile) => {
    const stages: ProcessingStatus[] = ["uploading", "ocr", "extracting", "complete"];
    let currentStage = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      if (progress >= 100) {
        progress = 100;
        currentStage++;
        
        if (currentStage >= stages.length) {
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { 
                  ...f, 
                  status: "complete", 
                  progress: 100,
                  extractedData: {
                    date: "2012-04-12",
                    supplier: "ChemCorp",
                    chemical: "Polytetrafluoroethylene",
                    casNumber: "9002-84-0"
                  }
                } 
              : f
          ));
          addAuditEntry({
            action: "Document Processed",
            user: "System",
            details: `${file.name} successfully processed via OCR`,
            type: "extraction"
          });
          return;
        }
        progress = 0;
      }

      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: stages[currentStage], progress } 
          : f
      ));
    }, 200);
  }, [setUploadedFiles, addAuditEntry]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        status: "uploading",
        progress: 0
      };
      setUploadedFiles(prev => [...prev, newFile]);
      simulateProcessing(newFile);
    });
  }, [setUploadedFiles, simulateProcessing]);

  const handleMockUpload = () => {
    const mockFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: "2011-2015_Purchase_Orders.pdf",
      size: 2458624,
      status: "uploading",
      progress: 0
    };
    setUploadedFiles(prev => [...prev, mockFile]);
    simulateProcessing(mockFile);
  };

  const handleApproveAndIndex = (file: UploadedFile) => {
    if (!file.extractedData) return;
    
    // Add to documents list
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: "pdf",
      size: file.size,
      uploadedAt: new Date(),
      processedAt: new Date(),
      status: "indexed",
      source: "upload",
      extractedChemicals: 1,
      extractedData: file.extractedData
    };
    
    setDocuments(prev => [newDocument, ...prev]);
    
    // Add chemical record
    const newChemical = {
      id: `chem-${Date.now()}`,
      productName: file.extractedData.chemical,
      casNumber: file.extractedData.casNumber || "Unknown",
      yearDetected: parseInt(file.extractedData.date.split("-")[0]),
      sourceDocument: file.name,
      sourceDocumentId: newDocument.id,
      riskScore: 75,
      status: "pending-review" as const,
      supplier: file.extractedData.supplier,
    };
    
    setChemicalRecords(prev => [newChemical, ...prev]);
    
    // Remove from upload queue
    setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
    setSelectedFile(null);
    
    addAuditEntry({
      action: "Document Indexed",
      user: "John Smith",
      details: `${file.name} approved and indexed with 1 chemical extracted`,
      type: "verification",
      relatedId: newDocument.id,
      relatedType: "document"
    });
    
    toast.success("Document indexed successfully", {
      description: `${file.extractedData.chemical} added to chemical registry`
    });
  };

  const getStatusLabel = (status: ProcessingStatus) => {
    switch (status) {
      case "uploading": return "Uploading...";
      case "ocr": return "OCR Scanning...";
      case "extracting": return "Extracting Entities...";
      case "complete": return "Complete";
      case "error": return "Error";
    }
  };

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case "uploading": return "text-blue-600";
      case "ocr": return "text-violet-600";
      case "extracting": return "text-amber-600";
      case "complete": return "text-emerald-600";
      case "error": return "text-rose-600";
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case "indexed": return { bg: "bg-blue-100", text: "text-blue-700", label: "Indexed" };
      case "verified": return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Verified" };
      case "pending": return { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" };
      case "processing": return { bg: "bg-violet-100", text: "text-violet-700", label: "Processing" };
      default: return { bg: "bg-slate-100", text: "text-slate-700", label: status };
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email": return Mail;
      case "drive": return Cloud;
      case "legacy": return Archive;
      default: return Upload;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = documentFilter === "all" || doc.status === documentFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cfa-accent" />
              The Archaeologist
            </h2>
            <p className="text-slate-500 mt-1">Unearth hidden PFAS data from legacy documents</p>
          </div>
          <Button onClick={handleMockUpload} className="bg-cfa-accent hover:bg-cfa-accent/90">
            <Upload className="w-4 h-4 mr-2" />
            Demo Upload
          </Button>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload & Process
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              Document Library ({documents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Zone */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-12 text-center transition-all",
                      isDragging 
                        ? "border-cfa-accent bg-teal-50" 
                        : "border-slate-300 hover:border-slate-400 bg-slate-50"
                    )}
                  >
                    <Upload className={cn("w-12 h-12 mx-auto mb-4", isDragging ? "text-cfa-accent" : "text-slate-400")} />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Drag & Drop Legacy Data
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                      PDFs, CSVs, PST Archives, Excel files
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["PDF", "DOCX", "XLSX", "CSV", "PST", "TIFF"].map(format => (
                        <Badge key={format} variant="secondary" className="bg-slate-200 text-slate-600">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Queue */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-cfa-accent" />
                    Processing Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No files in queue</p>
                      <p className="text-sm">Upload files to begin processing</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {uploadedFiles.map(file => (
                        <div 
                          key={file.id}
                          className={cn(
                            "p-4 rounded-lg border transition-all cursor-pointer",
                            selectedFile?.id === file.id 
                              ? "border-cfa-accent bg-teal-50" 
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          )}
                          onClick={() => file.status === "complete" && setSelectedFile(file)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-slate-400" />
                              <div>
                                <p className="font-medium text-slate-900 text-sm">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            {file.status === "complete" ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Loader2 className="w-5 h-5 text-cfa-accent animate-spin" />
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className={cn("font-medium", getStatusColor(file.status))}>
                                {getStatusLabel(file.status)}
                              </span>
                              {file.status !== "complete" && (
                                <span className="text-slate-500">{Math.round(file.progress)}%</span>
                              )}
                            </div>
                            {file.status !== "complete" && (
                              <Progress 
                                value={file.progress} 
                                className="h-1.5" 
                              />
                            )}
                          </div>

                          {file.status === "complete" && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="mt-2 text-cfa-accent hover:text-cfa-accent/80"
                              onClick={(e) => { e.stopPropagation(); setSelectedFile(file); }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Extracted Data
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Verification View */}
            {selectedFile && selectedFile.extractedData && (
              <Card className="shadow-sm animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Document Verification</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PDF Preview (Mock) */}
                    <div className="bg-slate-100 rounded-lg p-4 min-h-96">
                      <div className="bg-white rounded border border-slate-200 p-6 h-full">
                        <div className="space-y-4 text-sm text-slate-600">
                          <div className="text-center border-b pb-4 mb-4">
                            <h4 className="font-bold text-lg text-slate-900">PURCHASE ORDER</h4>
                            <p className="text-slate-500">ChemCorp Industrial Supplies</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold">Date:</p>
                              <p>April 12, 2012</p>
                            </div>
                            <div>
                              <p className="font-semibold">PO Number:</p>
                              <p>PO-2012-0412</p>
                            </div>
                          </div>
                          <div className="border-t pt-4 mt-4">
                            <p className="font-semibold mb-2">Item Description:</p>
                            <p>Industrial Coating Agent</p>
                            <p className="mt-2">
                              <span className="font-semibold">Chemical: </span>
                              <span className="bg-yellow-200 px-1 rounded font-medium text-slate-900">
                                Polytetrafluoroethylene
                              </span>
                            </p>
                            <p className="mt-1">
                              <span className="font-semibold">CAS: </span>9002-84-0
                            </p>
                          </div>
                          <div className="border-t pt-4 mt-4">
                            <p className="font-semibold">Quantity: </p>
                            <p>500 kg @ $45.00/kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Intelligence */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                        <h4 className="font-semibold text-slate-900">Extracted Intelligence</h4>
                        <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">AI Inferred</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { label: "Date", value: selectedFile.extractedData.date, confidence: 98 },
                          { label: "Supplier", value: selectedFile.extractedData.supplier, confidence: 95 },
                          { label: "Chemical", value: selectedFile.extractedData.chemical, highlight: true, confidence: 92 },
                          { label: "CAS Number", value: selectedFile.extractedData.casNumber || "9002-84-0", confidence: 89 }
                        ].map((field, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wide">{field.label}</p>
                              <p className={cn(
                                "font-medium",
                                field.highlight ? "text-amber-700 bg-yellow-200 px-1 rounded inline" : "text-slate-900"
                              )}>
                                {field.value}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                              {field.confidence}%
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button 
                          className="flex-1 bg-cfa-accent hover:bg-cfa-accent/90"
                          onClick={() => handleApproveAndIndex(selectedFile)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve & Index
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Edit Fields
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Documents Library Tab */}
          <TabsContent value="documents">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Document Library</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={documentFilter} onValueChange={setDocumentFilter}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="indexed">Indexed</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No documents found</p>
                    <p className="text-sm">Upload documents to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Document</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Source</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Uploaded</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Chemicals</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                          <th className="py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc, index) => {
                          const SourceIcon = getSourceIcon(doc.source);
                          const status = getDocStatusBadge(doc.status);
                          
                          return (
                            <tr 
                              key={doc.id}
                              className={cn(
                                "border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors",
                                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                              )}
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-slate-400" />
                                  <div>
                                    <p className="font-medium text-slate-900 text-sm">{doc.name}</p>
                                    <p className="text-xs text-slate-500">{formatFileSize(doc.size)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <SourceIcon className="w-4 h-4" />
                                  <span className="capitalize">{doc.source}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-slate-600">
                                {formatDate(doc.uploadedAt)}
                              </td>
                              <td className="py-4 px-4">
                                <Badge variant="secondary">
                                  {doc.extractedChemicals} found
                                </Badge>
                              </td>
                              <td className="py-4 px-4">
                                <Badge className={cn(status.bg, status.text, `hover:${status.bg}`)}>
                                  {status.label}
                                </Badge>
                              </td>
                              <td className="py-4 px-4">
                                <Button variant="ghost" size="sm">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
