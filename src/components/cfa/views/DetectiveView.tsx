import { useState } from "react";
import { useCFA, ChemicalRecord } from "@/contexts/CFAContext";
import { 
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  ExternalLink,
  Send,
  X
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

export function DetectiveView() {
  const { 
    chemicalRecords, 
    selectedChemical, 
    setSelectedChemical,
    investigationDrawerOpen,
    setInvestigationDrawerOpen,
    setCurrentView,
    setRfiTasks,
    addAuditEntry
  } = useCFA();

  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRecords = chemicalRecords.filter(record => {
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

  const handleOpenInvestigation = (record: ChemicalRecord) => {
    setSelectedChemical(record);
    setInvestigationDrawerOpen(true);
  };

  const handleAssignToOrchestrator = () => {
    if (!selectedChemical) return;
    
    const newTask = {
      id: `rfi-${Date.now()}`,
      chemicalId: selectedChemical.id,
      productName: selectedChemical.productName,
      casNumber: selectedChemical.casNumber,
      supplier: selectedChemical.supplier,
      status: "pending" as const,
      createdAt: new Date()
    };
    
    setRfiTasks(prev => [...prev, newTask]);
    addAuditEntry({
      action: "Task Created",
      user: "John Smith",
      details: `RFI task created for ${selectedChemical.productName} (CAS: ${selectedChemical.casNumber})`,
      type: "rfi"
    });
    
    setInvestigationDrawerOpen(false);
    setCurrentView("orchestrator");
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { bg: "bg-rose-100", text: "text-rose-700", label: "High" };
    if (score >= 50) return { bg: "bg-amber-100", text: "text-amber-700", label: "Medium" };
    return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Low" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "evidence-gap": return { bg: "bg-amber-100", text: "text-amber-700", label: "Evidence Gap" };
      case "verified": return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Verified" };
      default: return { bg: "bg-violet-100", text: "text-violet-700", label: "Pending Review" };
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-6 h-6 text-cfa-accent" />
            The Detective
          </h2>
          <p className="text-slate-500 mt-1">Analyze extracted data, identify gaps, and assess PFAS risks</p>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search by product, CAS #, or supplier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Year Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2011-2015">2011-2015</SelectItem>
                  <SelectItem value="2016-2020">2016-2020</SelectItem>
                  <SelectItem value="2021-2025">2021-2025</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="evidence-gap">Evidence Gap</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Identified Substances ({filteredRecords.length})</span>
              <Badge variant="secondary">{chemicalRecords.filter(r => r.status === "evidence-gap").length} Gaps</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CAS Number</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Score</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => {
                    const risk = getRiskBadge(record.riskScore);
                    const status = getStatusBadge(record.status);
                    
                    return (
                      <tr 
                        key={record.id} 
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-slate-900">{record.productName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <code className="text-sm bg-slate-100 px-2 py-0.5 rounded font-mono">{record.casNumber}</code>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{record.yearDetected}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FileText className="w-4 h-4" />
                            <span className="truncate max-w-32">{record.sourceDocument}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${risk.bg} ${risk.text} hover:${risk.bg}`}>
                            {record.riskScore}/100 ({risk.label})
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => handleOpenInvestigation(record)}
                            className="inline-flex"
                          >
                            <Badge 
                              className={`${status.bg} ${status.text} hover:${status.bg} cursor-pointer transition-transform hover:scale-105`}
                            >
                              {status.label}
                              {record.status === "evidence-gap" && <AlertTriangle className="w-3 h-3 ml-1" />}
                            </Badge>
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenInvestigation(record)}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Investigation Drawer */}
        <Sheet open={investigationDrawerOpen} onOpenChange={setInvestigationDrawerOpen}>
          <SheetContent className="w-[500px] sm:max-w-[500px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-cfa-accent" />
                Investigation Detail
              </SheetTitle>
            </SheetHeader>
            
            {selectedChemical && (
              <div className="mt-6 space-y-6">
                {/* Chemical Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">{selectedChemical.productName}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 uppercase">CAS Number</p>
                      <code className="font-mono text-slate-900">{selectedChemical.casNumber}</code>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 uppercase">Year Detected</p>
                      <p className="font-medium text-slate-900">{selectedChemical.yearDetected}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {(() => {
                      const risk = getRiskBadge(selectedChemical.riskScore);
                      return (
                        <Badge className={`${risk.bg} ${risk.text}`}>
                          Risk: {selectedChemical.riskScore}/100
                        </Badge>
                      );
                    })()}
                    {(() => {
                      const status = getStatusBadge(selectedChemical.status);
                      return (
                        <Badge className={`${status.bg} ${status.text}`}>
                          {status.label}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>

                {/* Source Document */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Source Document</span>
                  </div>
                  <p className="text-sm text-slate-900">{selectedChemical.sourceDocument}</p>
                  <Button variant="link" className="p-0 h-auto mt-2 text-cfa-accent">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Original
                  </Button>
                </div>

                {/* Problem Analysis */}
                {selectedChemical.status === "evidence-gap" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
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
                    <Send className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-teal-800">Recommended Action</h5>
                      <p className="text-sm text-teal-700 mt-1">
                        Contact supplier ({selectedChemical.supplier}) to obtain missing concentration data and updated SDS documentation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-3">
                  <Button 
                    className="w-full bg-cfa-accent hover:bg-cfa-accent/90"
                    onClick={handleAssignToOrchestrator}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Assign to Orchestrator
                  </Button>
                  <Button variant="outline" className="w-full">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Resolved
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
