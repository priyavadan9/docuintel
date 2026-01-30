import { useState, useMemo } from "react";
import { useCFA, ChemicalRecord } from "@/contexts/CFAContext";
import { 
  Search,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
  ExternalLink,
  Send,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortField = "productName" | "casNumber" | "yearDetected" | "riskScore";
type SortDirection = "asc" | "desc";

export function DetectiveView() {
  const { 
    chemicalRecords, 
    setChemicalRecords,
    selectedChemical, 
    setSelectedChemical,
    investigationDrawerOpen,
    setInvestigationDrawerOpen,
    setCurrentView,
    setRfiTasks,
    addAuditEntry,
    dashboardFilter,
    setDashboardFilter,
    dataGaps,
    setDataGaps
  } = useCFA();

  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState(dashboardFilter?.type === "pfas" ? "high" : "all");
  const [statusFilter, setStatusFilter] = useState(dashboardFilter?.type === "gaps" ? "evidence-gap" : "all");
  const [sortField, setSortField] = useState<SortField>("riskScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleClearFilters = () => {
    setSearchQuery("");
    setYearFilter("all");
    setRiskFilter("all");
    setStatusFilter("all");
    setDashboardFilter({ type: null });
  };

  const filteredRecords = useMemo(() => {
    let records = chemicalRecords.filter(record => {
      const matchesSearch = 
        record.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.casNumber.includes(searchQuery) ||
        record.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesYear = yearFilter === "all" || 
        (yearFilter === "2011-2015" && record.yearDetected >= 2011 && record.yearDetected <= 2015) ||
        (yearFilter === "2016-2020" && record.yearDetected >= 2016 && record.yearDetected <= 2020) ||
        (yearFilter === "2021-2025" && record.yearDetected >= 2021);
      
      const matchesRisk = riskFilter === "all" ||
        (riskFilter === "high" && record.riskScore >= 80) ||
        (riskFilter === "medium" && record.riskScore >= 50 && record.riskScore < 80) ||
        (riskFilter === "low" && record.riskScore < 50);
      
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;

      return matchesSearch && matchesYear && matchesRisk && matchesStatus;
    });

    records.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "productName":
          comparison = a.productName.localeCompare(b.productName);
          break;
        case "casNumber":
          comparison = a.casNumber.localeCompare(b.casNumber);
          break;
        case "yearDetected":
          comparison = a.yearDetected - b.yearDetected;
          break;
        case "riskScore":
          comparison = a.riskScore - b.riskScore;
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return records;
  }, [chemicalRecords, searchQuery, yearFilter, riskFilter, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="w-3 h-3 ml-1 text-teal-600" />
      : <ArrowDown className="w-3 h-3 ml-1 text-teal-600" />;
  };

  const handleOpenInvestigation = (record: ChemicalRecord) => {
    setSelectedChemical(record);
    setInvestigationDrawerOpen(true);
  };

  const handleMarkAsResolved = () => {
    if (!selectedChemical) return;
    
    setChemicalRecords(prev => prev.map(c => 
      c.id === selectedChemical.id 
        ? { ...c, status: "verified" as const }
        : c
    ));
    
    setDataGaps(prev => prev.map(g =>
      g.chemicalId === selectedChemical.id
        ? { ...g, status: "resolved" as const }
        : g
    ));
    
    addAuditEntry({
      action: "Evidence Gap Resolved",
      user: "John Smith",
      details: `${selectedChemical.productName} (CAS: ${selectedChemical.casNumber}) marked as verified`,
      type: "verification",
      relatedId: selectedChemical.id,
      relatedType: "chemical"
    });
    
    toast.success("Chemical verified", {
      description: `${selectedChemical.productName} has been marked as resolved`
    });
    
    setInvestigationDrawerOpen(false);
  };

  const handleAssignToOrchestrator = () => {
    if (!selectedChemical) return;
    
    const newTask = {
      id: `rfi-${Date.now()}`,
      chemicalId: selectedChemical.id,
      productName: selectedChemical.productName,
      casNumber: selectedChemical.casNumber,
      supplier: selectedChemical.supplier,
      supplierId: selectedChemical.supplierId,
      status: "pending" as const,
      createdAt: new Date()
    };
    
    setRfiTasks(prev => [...prev, newTask]);
    
    setDataGaps(prev => prev.map(g =>
      g.chemicalId === selectedChemical.id
        ? { ...g, status: "pending-rfi" as const }
        : g
    ));
    
    addAuditEntry({
      action: "RFI Task Created",
      user: "John Smith",
      details: `RFI task created for ${selectedChemical.productName} (CAS: ${selectedChemical.casNumber})`,
      type: "rfi",
      relatedId: selectedChemical.id,
      relatedType: "chemical"
    });
    
    toast.success("Task assigned to Orchestrator", {
      description: `RFI will be drafted for ${selectedChemical.supplier}`
    });
    
    setInvestigationDrawerOpen(false);
    setCurrentView("orchestrator");
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { className: "bg-rose-100 text-rose-700 border-rose-200", label: "High" };
    if (score >= 50) return { className: "bg-amber-100 text-amber-700 border-amber-200", label: "Medium" };
    return { className: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Low" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "evidence-gap": return { className: "bg-amber-100 text-amber-700 border-amber-200", label: "Evidence Gap" };
      case "verified": return { className: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Verified" };
      default: return { className: "bg-violet-100 text-violet-700 border-violet-200", label: "Pending Review" };
    }
  };

  const gapCount = chemicalRecords.filter(r => r.status === "evidence-gap").length;
  const hasActiveFilters = searchQuery || yearFilter !== "all" || riskFilter !== "all" || statusFilter !== "all";

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-teal-600" />
            The Detective
          </h2>
          <p className="text-slate-500 mt-1">Analyze extracted data, identify gaps, and assess PFAS risks</p>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search by product, CAS #, or supplier..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-700">
                  <SelectValue placeholder="Year Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2011-2015">2011-2015</SelectItem>
                  <SelectItem value="2016-2020">2016-2020</SelectItem>
                  <SelectItem value="2021-2025">2021-2025</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-700">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="evidence-gap">Evidence Gap</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-slate-600 hover:text-slate-900">
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center justify-between">
              <span>Identified Substances ({filteredRecords.length})</span>
              <Badge className={cn("border", gapCount > 0 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200")}>
                {gapCount} Gaps
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="font-medium text-slate-700">No substances found</p>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={handleClearFilters} className="mt-2 text-teal-600">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left py-3 px-4">
                          <button 
                            onClick={() => handleSort("productName")}
                            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700"
                          >
                            Product Name {getSortIcon("productName")}
                          </button>
                        </th>
                        <th className="text-left py-3 px-4">
                          <button 
                            onClick={() => handleSort("casNumber")}
                            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700"
                          >
                            CAS Number {getSortIcon("casNumber")}
                          </button>
                        </th>
                        <th className="text-left py-3 px-4">
                          <button 
                            onClick={() => handleSort("yearDetected")}
                            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700"
                          >
                            Year {getSortIcon("yearDetected")}
                          </button>
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                        <th className="text-left py-3 px-4">
                          <button 
                            onClick={() => handleSort("riskScore")}
                            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700"
                          >
                            Risk Score {getSortIcon("riskScore")}
                          </button>
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRecords.map((record, index) => {
                        const risk = getRiskBadge(record.riskScore);
                        const status = getStatusBadge(record.status);
                        
                        return (
                          <tr 
                            key={record.id} 
                            className={cn(
                              "border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
                              index % 2 === 1 && "bg-slate-50/50"
                            )}
                            onClick={() => handleOpenInvestigation(record)}
                          >
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-slate-800">{record.productName}</span>
                            </td>
                            <td className="py-3 px-4">
                              <code className="text-sm bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">{record.casNumber}</code>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600">{record.yearDetected}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="truncate max-w-32">{record.sourceDocument}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={cn("border font-medium", risk.className)}>
                                {record.riskScore}/100 ({risk.label})
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={cn("border font-medium", status.className)}>
                                {status.label}
                                {record.status === "evidence-gap" && <AlertTriangle className="w-3 h-3 ml-1" />}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="border-slate-200 text-slate-600"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-slate-200 text-slate-600"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-slate-600 px-3">
                        {currentPage} / {totalPages}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-slate-200 text-slate-600"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="border-slate-200 text-slate-600"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Investigation Drawer */}
        <Sheet open={investigationDrawerOpen} onOpenChange={setInvestigationDrawerOpen}>
          <SheetContent className="w-[480px] sm:max-w-[480px] bg-white">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-slate-900">
                <Search className="w-5 h-5 text-teal-600" />
                Investigation Detail
              </SheetTitle>
            </SheetHeader>
            
            {selectedChemical && (
              <div className="mt-6 space-y-5">
                {/* Chemical Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-slate-900">{selectedChemical.productName}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">CAS Number</p>
                      <code className="font-mono text-slate-800">{selectedChemical.casNumber}</code>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Year Detected</p>
                      <p className="font-medium text-slate-800">{selectedChemical.yearDetected}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {(() => {
                      const risk = getRiskBadge(selectedChemical.riskScore);
                      return (
                        <Badge className={cn("border", risk.className)}>
                          Risk: {selectedChemical.riskScore}/100
                        </Badge>
                      );
                    })()}
                    {(() => {
                      const status = getStatusBadge(selectedChemical.status);
                      return (
                        <Badge className={cn("border", status.className)}>
                          {status.label}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>

                {/* Supplier Info */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Supplier</span>
                  </div>
                  <p className="text-sm text-slate-800 font-medium">{selectedChemical.supplier}</p>
                  {selectedChemical.concentration && (
                    <p className="text-sm text-slate-600 mt-1">Concentration: {selectedChemical.concentration}</p>
                  )}
                </div>

                {/* Source Document */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">Source Document</span>
                  </div>
                  <p className="text-sm text-slate-800">{selectedChemical.sourceDocument}</p>
                  <Button variant="link" className="p-0 h-auto mt-2 text-teal-600">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Original
                  </Button>
                </div>

                {/* Problem Analysis */}
                {selectedChemical.status === "evidence-gap" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-semibold text-amber-800">Evidence Gap Identified</h5>
                        <p className="text-sm text-amber-700 mt-1">
                          {selectedChemical.notes || "Critical data is missing from available documentation."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Send className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-semibold text-teal-800">Recommended Action</h5>
                      <p className="text-sm text-teal-700 mt-1">
                        {selectedChemical.status === "evidence-gap" 
                          ? `Contact supplier (${selectedChemical.supplier}) to obtain missing concentration data and updated SDS documentation.`
                          : selectedChemical.status === "pending-review"
                          ? "Review extracted data and verify accuracy before final approval."
                          : "No action required. This record has been verified."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-3">
                  {selectedChemical.status !== "verified" && (
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={handleAssignToOrchestrator}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Assign to Orchestrator
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                    onClick={handleMarkAsResolved}
                    disabled={selectedChemical.status === "verified"}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {selectedChemical.status === "verified" ? "Already Verified" : "Mark as Resolved"}
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
