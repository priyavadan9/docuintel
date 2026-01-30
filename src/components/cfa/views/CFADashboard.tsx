import { useCFA } from "@/contexts/CFAContext";
import { 
  FileText, 
  AlertTriangle, 
  Search as SearchIcon, 
  Send,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileWarning,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";

export function CFADashboard() {
  const { 
    stats, 
    auditLog, 
    chemicalRecords, 
    documents,
    dataGaps,
    rfiTasks,
    chartData,
    setCurrentView,
    setDashboardFilter,
    setSelectedChemical,
    setInvestigationDrawerOpen
  } = useCFA();

  const handleStatClick = (type: "documents" | "pfas" | "gaps" | "rfis") => {
    setDashboardFilter({ type });
    
    switch (type) {
      case "documents":
        setCurrentView("archaeologist");
        break;
      case "pfas":
      case "gaps":
        setCurrentView("detective");
        break;
      case "rfis":
        setCurrentView("orchestrator");
        break;
    }
  };

  const handleChartClick = (data: any) => {
    if (data && data.activePayload) {
      const month = data.activePayload[0]?.payload?.month;
      if (month) {
        setDashboardFilter({ type: "month", month });
        setCurrentView("detective");
      }
    }
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
    } else if (entry.relatedType === "rfi") {
      setCurrentView("orchestrator");
    }
  };

  const handleHighRiskClick = (record: typeof chemicalRecords[0]) => {
    setSelectedChemical(record);
    setInvestigationDrawerOpen(true);
    setCurrentView("detective");
  };

  const statCards = [
    {
      title: "Documents Ingested",
      value: stats.documentsIngested.toString(),
      icon: FileText,
      trend: `+${documents.filter(d => d.status === "indexed").length} indexed`,
      trendUp: true,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      onClick: () => handleStatClick("documents"),
    },
    {
      title: "PFAS Candidates Found",
      value: stats.pfasCandidates.toString(),
      icon: AlertTriangle,
      trend: `${chemicalRecords.filter(r => r.riskScore >= 80).length} high risk`,
      trendUp: true,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      valueColor: "text-rose-600",
      onClick: () => handleStatClick("pfas"),
    },
    {
      title: "Data Gaps",
      value: stats.dataGaps.toString(),
      icon: SearchIcon,
      trend: `${dataGaps.filter(g => g.status === "pending-rfi").length} pending RFI`,
      trendUp: false,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
      onClick: () => handleStatClick("gaps"),
    },
    {
      title: "RFIs Sent",
      value: stats.rfisSent.toString(),
      icon: Send,
      trend: `${rfiTasks.filter(t => t.status === "responded").length} responded`,
      trendUp: true,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
      onClick: () => handleStatClick("rfis"),
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload": return FileText;
      case "extraction": return Activity;
      case "rfi": return Send;
      case "verification": return CheckCircle2;
      default: return AlertCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload": return "bg-blue-500";
      case "extraction": return "bg-violet-500";
      case "rfi": return "bg-emerald-500";
      case "verification": return "bg-teal-500";
      default: return "bg-slate-500";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const highRiskItems = chemicalRecords.filter(r => r.riskScore >= 80).slice(0, 5);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      {/* Demo Data Notice */}
      <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-violet-800">
          <Activity className="w-4 h-4" />
          <span><strong>Demo Mode:</strong> All data is simulated for demonstration. Click any metric to explore.</span>
        </div>
        <Badge className="bg-violet-100 text-violet-700 border border-violet-200">Interactive Demo</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="bg-white border border-slate-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-slate-300"
              onClick={stat.onClick}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className={cn("text-3xl font-bold mt-1", stat.valueColor || "text-slate-900")}>
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trendUp ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-amber-500" />
                      )}
                      <span className="text-xs text-slate-500">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-lg", stat.iconBg)}>
                    <Icon className={cn("w-5 h-5", stat.iconColor)} />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-teal-600 font-medium">View details</span>
                  <ChevronRight className="w-4 h-4 text-teal-600" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center justify-between">
              <span>Documents Processed vs. Risks Identified</span>
              <Badge variant="outline" className="text-xs font-normal text-slate-500 border-slate-300">
                Click bars to filter
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                    labelStyle={{ color: "#334155", fontWeight: 600 }}
                    formatter={(value: number, name: string) => [
                      value,
                      name === "processed" ? "Documents Processed" : "Risks Identified"
                    ]}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="processed" 
                    radius={[4, 4, 0, 0]}
                    name="processed"
                    cursor="pointer"
                    fill="#0d9488"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="risks" 
                    stroke="#e11d48" 
                    strokeWidth={2}
                    dot={{ fill: "#e11d48", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "#e11d48" }}
                    name="risks"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLog.slice(0, 5).map((entry) => {
                const Icon = getActivityIcon(entry.type);
                const isClickable = !!entry.relatedId;
                
                return (
                  <button 
                    key={entry.id} 
                    className={cn(
                      "w-full flex items-start gap-3 text-left p-2.5 -mx-2 rounded-lg transition-colors",
                      isClickable ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"
                    )}
                    onClick={() => isClickable && handleActivityClick(entry)}
                    disabled={!isClickable}
                  >
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", getActivityColor(entry.type))}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{entry.action}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{entry.details}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-slate-400">{entry.user}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{formatTime(entry.timestamp)}</span>
                        {isClickable && (
                          <ExternalLink className="w-3 h-3 text-teal-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-3 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              onClick={() => setCurrentView("orchestrator")}
            >
              View Full Audit Log
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Items */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-rose-500" />
              High-Priority Items Requiring Attention
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-slate-600 border-slate-300 hover:bg-slate-50"
              onClick={() => {
                setDashboardFilter({ type: "pfas" });
                setCurrentView("detective");
              }}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CAS Number</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Score</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {highRiskItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={cn(
                      "border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors",
                      index % 2 === 1 && "bg-slate-50/50"
                    )}
                    onClick={() => handleHighRiskClick(item)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-slate-800">{item.productName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-sm bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                        {item.casNumber}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600">{item.supplier}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        "font-medium",
                        item.riskScore >= 90 
                          ? "bg-rose-100 text-rose-700 border border-rose-200" 
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      )}>
                        {item.riskScore}/100
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        "font-medium",
                        item.status === "evidence-gap"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : item.status === "verified"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-violet-100 text-violet-700 border border-violet-200"
                      )}>
                        {item.status === "evidence-gap" ? "Evidence Gap" : 
                         item.status === "verified" ? "Verified" : "Pending Review"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
