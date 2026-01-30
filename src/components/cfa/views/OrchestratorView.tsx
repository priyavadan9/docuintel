import { useState } from "react";
import { useCFA, RFITask } from "@/contexts/CFAContext";
import { 
  Workflow,
  Send,
  Clock,
  CheckCircle2,
  Mail,
  Edit,
  AlertCircle,
  History,
  ChevronRight,
  Loader2,
  FileText,
  User,
  MessageSquare,
  ExternalLink,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OrchestratorView() {
  const { 
    rfiTasks, 
    setRfiTasks, 
    auditLog, 
    addAuditEntry,
    rfiModalOpen,
    setRfiModalOpen,
    currentRfiTask,
    setCurrentRfiTask,
    chemicalRecords,
    setSelectedChemical,
    setInvestigationDrawerOpen,
    setCurrentView
  } = useCFA();
  
  const [sending, setSending] = useState(false);
  const [activityFilter, setActivityFilter] = useState("all");
  const [emailDraft, setEmailDraft] = useState({
    to: "",
    subject: "",
    body: ""
  });

  const openRfiModal = (task: RFITask) => {
    setCurrentRfiTask(task);
    
    const successorDomain = task.supplier.toLowerCase().replace(/\s+/g, "-") + "-successor.com";
    setEmailDraft({
      to: `compliance@${successorDomain}`,
      subject: `URGENT: EPA TSCA Data Request regarding 2014 Purchase`,
      body: `Dear Compliance Team,

Our records indicate a purchase of ${task.productName} (CAS: ${task.casNumber}) from your organization in 2014.

Under EPA TSCA Section 8(a)(7) reporting requirements for PFAS substances, we are required to obtain complete documentation including:

• Concentration percentages for all PFAS-containing materials
• Current Safety Data Sheets (SDS)
• Any successor product information if applicable

We kindly request your assistance in providing this information at your earliest convenience. The EPA submission deadline is October 13, 2026.

Please respond to this email or contact our compliance team directly.

Best regards,
John Smith
Compliance Officer
Chemical Manufacturing Corp.`
    });
    
    setRfiModalOpen(true);
  };

  const handleSendRfi = async () => {
    if (!currentRfiTask) return;
    
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setRfiTasks(prev => prev.map(t => 
      t.id === currentRfiTask.id 
        ? { ...t, status: "sent", sentAt: new Date() } 
        : t
    ));
    
    addAuditEntry({
      action: "RFI Sent",
      user: "John Smith",
      details: `RFI sent to ${currentRfiTask.supplier} regarding ${currentRfiTask.productName}. Drafted by AI Agent.`,
      type: "rfi",
      relatedId: currentRfiTask.id,
      relatedType: "rfi"
    });
    
    toast.success("RFI sent successfully", {
      description: `Email sent to ${emailDraft.to}`
    });
    
    setSending(false);
    setRfiModalOpen(false);
  };

  const handleActivityClick = (entry: typeof auditLog[0]) => {
    if (entry.relatedType === "chemical" && entry.relatedId) {
      const chemical = chemicalRecords.find(c => c.id === entry.relatedId);
      if (chemical) {
        setSelectedChemical(chemical);
        setInvestigationDrawerOpen(true);
        setCurrentView("detective");
      }
    } else if (entry.relatedType === "document") {
      setCurrentView("archaeologist");
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return { className: "bg-amber-100 text-amber-700 border-amber-200", label: "Pending", icon: Clock };
      case "drafted": return { className: "bg-blue-100 text-blue-700 border-blue-200", label: "Drafted", icon: Edit };
      case "sent": return { className: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Sent", icon: Send };
      case "responded": return { className: "bg-violet-100 text-violet-700 border-violet-200", label: "Response Received", icon: MessageSquare };
      default: return { className: "bg-slate-100 text-slate-700 border-slate-200", label: status, icon: AlertCircle };
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
  };

  const pendingTasks = rfiTasks.filter(t => t.status === "pending" || t.status === "drafted");
  const completedTasks = rfiTasks.filter(t => t.status === "sent" || t.status === "responded");
  
  const filteredAuditLog = auditLog.filter(entry => {
    if (activityFilter === "all") return true;
    return entry.type === activityFilter;
  });

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Workflow className="w-6 h-6 text-teal-600" />
            The Orchestrator
          </h2>
          <p className="text-slate-500 mt-1">Manage supplier outreach, RFI generation, and compliance actions</p>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="tasks" className="gap-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              <Send className="w-4 h-4" />
              Task Queue ({rfiTasks.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              <Mail className="w-4 h-4" />
              RFI History ({completedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
              <History className="w-4 h-4" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* Task Queue */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Actions */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Pending Actions ({pendingTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="font-medium text-slate-700">No pending actions</p>
                      <p className="text-sm text-slate-500 mt-1">Use The Detective to identify gaps</p>
                      <Button 
                        variant="link" 
                        className="mt-2 text-teal-600"
                        onClick={() => setCurrentView("detective")}
                      >
                        Go to Detective <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingTasks.map(task => {
                        const status = getTaskStatusBadge(task.status);
                        const StatusIcon = status.icon;
                        
                        return (
                          <div 
                            key={task.id}
                            className="p-4 border border-slate-200 rounded-lg bg-white hover:border-teal-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-slate-800">{task.productName}</h4>
                                <p className="text-sm text-slate-500">CAS: {task.casNumber}</p>
                              </div>
                              <Badge className={cn("border", status.className)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-slate-500">
                                <span>Supplier: </span>
                                <span className="text-slate-700 font-medium">{task.supplier}</span>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                                onClick={() => openRfiModal(task)}
                              >
                                Execute Action
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-teal-600" />
                    RFI Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-2xl font-bold text-amber-700">{pendingTasks.length}</p>
                      <p className="text-sm text-amber-600 font-medium">Pending</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-2xl font-bold text-emerald-700">
                        {rfiTasks.filter(t => t.status === "sent").length}
                      </p>
                      <p className="text-sm text-emerald-600 font-medium">Sent</p>
                    </div>
                    <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                      <p className="text-2xl font-bold text-violet-700">
                        {rfiTasks.filter(t => t.status === "responded").length}
                      </p>
                      <p className="text-sm text-violet-600 font-medium">Responses</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <p className="text-2xl font-bold text-slate-700">{rfiTasks.length}</p>
                      <p className="text-sm text-slate-600 font-medium">Total RFIs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* RFI History */}
          <TabsContent value="history">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  RFI History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Send className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-slate-700">No RFIs sent yet</p>
                    <p className="text-sm text-slate-500 mt-1">Execute pending actions to send RFIs</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Product</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">CAS Number</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Supplier</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Sent Date</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                          <th className="py-3 px-4 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedTasks.map((task, index) => {
                          const status = getTaskStatusBadge(task.status);
                          const StatusIcon = status.icon;
                          
                          return (
                            <tr 
                              key={task.id}
                              className={cn(
                                "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                                index % 2 === 1 && "bg-slate-50/50"
                              )}
                            >
                              <td className="py-3 px-4 font-medium text-slate-800">{task.productName}</td>
                              <td className="py-3 px-4">
                                <code className="text-sm bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{task.casNumber}</code>
                              </td>
                              <td className="py-3 px-4 text-slate-600">{task.supplier}</td>
                              <td className="py-3 px-4 text-slate-600">
                                {task.sentAt ? formatDate(task.sentAt) : "-"}
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={cn("border", status.className)}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                  <ExternalLink className="w-4 h-4" />
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

          {/* Audit Log */}
          <TabsContent value="audit">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-600" />
                  Compliance Audit Trail
                </CardTitle>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-44 bg-white border-slate-200 text-slate-700">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="upload">Documents</SelectItem>
                    <SelectItem value="extraction">Extractions</SelectItem>
                    <SelectItem value="rfi">RFIs</SelectItem>
                    <SelectItem value="verification">Verifications</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                  
                  <div className="space-y-4">
                    {filteredAuditLog.map((entry) => {
                      const getTypeIcon = () => {
                        switch (entry.type) {
                          case "upload": return FileText;
                          case "extraction": return Workflow;
                          case "rfi": return Send;
                          case "verification": return CheckCircle2;
                          default: return AlertCircle;
                        }
                      };
                      
                      const getTypeColor = () => {
                        switch (entry.type) {
                          case "upload": return "bg-blue-500";
                          case "extraction": return "bg-violet-500";
                          case "rfi": return "bg-emerald-500";
                          case "verification": return "bg-teal-500";
                          default: return "bg-slate-500";
                        }
                      };
                      
                      const Icon = getTypeIcon();
                      const isClickable = !!entry.relatedId;
                      
                      return (
                        <button 
                          key={entry.id} 
                          className={cn(
                            "relative pl-10 w-full text-left",
                            isClickable && "cursor-pointer"
                          )}
                          onClick={() => isClickable && handleActivityClick(entry)}
                          disabled={!isClickable}
                        >
                          <div className={cn("absolute left-2 w-5 h-5 rounded-full flex items-center justify-center", getTypeColor())}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          
                          <div className={cn(
                            "bg-white border border-slate-200 rounded-lg p-4 transition-colors",
                            isClickable && "hover:border-teal-300 hover:bg-slate-50"
                          )}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-slate-800">{entry.action}</h4>
                                <p className="text-sm text-slate-600 mt-1">{entry.details}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="shrink-0 border-slate-200 text-slate-600">
                                  {entry.type}
                                </Badge>
                                {isClickable && (
                                  <ExternalLink className="w-4 h-4 text-teal-500" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {entry.user}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(entry.timestamp)} - {formatDate(entry.timestamp)}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* RFI Modal */}
        <Dialog open={rfiModalOpen} onOpenChange={setRfiModalOpen}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-slate-900">
                <Mail className="w-5 h-5 text-teal-600" />
                Drafting Supplier RFI
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 text-sm text-violet-700 bg-violet-50 border border-violet-200 px-3 py-2 rounded-lg">
                <Workflow className="w-4 h-4" />
                <span>Agent has autonomously identified the successor domain for this supplier</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">To:</label>
                  <Input 
                    value={emailDraft.to}
                    onChange={(e) => setEmailDraft(prev => ({ ...prev, to: e.target.value }))}
                    className="bg-white border-slate-200 text-slate-900"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Subject:</label>
                  <Input 
                    value={emailDraft.subject}
                    onChange={(e) => setEmailDraft(prev => ({ ...prev, subject: e.target.value }))}
                    className="bg-white border-slate-200 text-slate-900"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Message:</label>
                  <Textarea 
                    value={emailDraft.body}
                    onChange={(e) => setEmailDraft(prev => ({ ...prev, body: e.target.value }))}
                    rows={12}
                    className="font-mono text-sm bg-white border-slate-200 text-slate-900"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setRfiModalOpen(false)} className="border-slate-200 text-slate-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Draft
              </Button>
              <Button 
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleSendRfi}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Approve & Send
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
