import { useCFA } from "@/contexts/CFAContext";
import { 
  FileText, 
  AlertTriangle, 
  Search as SearchIcon, 
  Send,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
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
      bgColor: "bg-slate-50",
      iconColor: "text-slate-600",
      borderColor: "border-slate-200",
      onClick: () => handleStatClick("documents"),
      hasData: documents.length > 0
    },
    {
      title: "PFAS Candidates Found",
      value: stats.pfasCandidates.toString(),
      icon: AlertTriangle,
      trend: `${chemicalRecords.filter(r => r.riskScore >= 80).length} high risk`,
      trendUp: true,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200",
      valueColor: "text-rose-600",
      onClick: () => handleStatClick("pfas"),
      hasData: chemicalRecords.length > 0
    },
    {
      title: "Data Gaps",
      value: stats.dataGaps.toString(),
      icon: SearchIcon,
      trend: `${dataGaps.filter(g => g.status === "pending-rfi").length} pending RFI`,
      trendUp: false,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      valueColor: "text-amber-600",
      onClick: () => handleStatClick("gaps"),
      hasData: dataGaps.length > 0
    },
    {
      title: "RFIs Sent",
      value: stats.rfisSent.toString(),
      icon: Send,
      trend: `${rfiTasks.filter(t => t.status === "responded").length} responded`,
      trendUp: true,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      valueColor: "text-emerald-600",
      onClick: () => handleStatClick("rfis"),
      hasData: rfiTasks.length > 0
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
      case "upload": return "text-blue-500";
      case "extraction": return "text-violet-500";
      case "rfi": return "text-emerald-500";
      case "verification": return "text-teal-500";
      default: return "text-slate-500";
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
      <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-violet-700">
          <Activity className="w-4 h-4" />
          <span><strong>Demo Mode:</strong> All data shown is simulated for demonstration purposes. Click any metric to explore.</span>
        </div>
        <Badge className="bg-violet-100 text-violet-700">Interactive Demo</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={cn(
                "border shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
                stat.borderColor
              )}
              onClick={stat.onClick}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
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
                  <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                    <Icon className={cn("w-6 h-6", stat.iconColor)} />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-cfa-accent font-medium">View details</span>
                  <ChevronRight className="w-4 h-4 text-cfa-accent" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center justify-between">
              <span>Documents Processed vs. Risks Identified</span>
              <Badge variant="secondary" className="text-xs">Click bars to filter</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px"
                    }}
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
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#0d9488" />
                    ))}
                  </Bar>
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="risks" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    dot={{ fill: "#f43f5e", cursor: "pointer" }}
                    name="risks"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cfa-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditLog.slice(0, 5).map((entry) => {
                const Icon = getActivityIcon(entry.type);
                const isClickable = !!entry.relatedId;
                
                return (
                  <button 
                    key={entry.id} 
                    className={cn(
                      "w-full flex items-start gap-3 text-left p-2 -mx-2 rounded-lg transition-colors",
                      isClickable && "hover:bg-slate-50 cursor-pointer"
                    )}
                    onClick={() => isClickable && handleActivityClick(entry)}
                    disabled={!isClickable}
                  >
                    <div className={`mt-0.5 ${getActivityColor(entry.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                      <p className="text-xs text-slate-500 truncate">{entry.details}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{entry.user}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{formatTime(entry.timestamp)}</span>
                        {isClickable && (
                          <ExternalLink className="w-3 h-3 text-cfa-accent ml-auto" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-cfa-accent"
              onClick={() => setCurrentView("orchestrator")}
            >
              View Full Audit Log
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Items */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-rose-500" />
              High-Priority Items Requiring Attention
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setDashboardFilter({ type: "pfas" });
                setCurrentView("detective");
              }}
            >
              View All Chemicals
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CAS Number</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Score</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {highRiskItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => handleHighRiskClick(item)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-slate-900 hover:text-cfa-accent">
                        {item.productName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-sm bg-slate-100 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200">
                        {item.casNumber}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-slate-600 hover:text-cfa-accent cursor-pointer">
                        {item.supplier}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        item.riskScore >= 90 
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-100" 
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      )}>
                        {item.riskScore}/100
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={cn(
                        item.status === "evidence-gap"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          : item.status === "verified"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-violet-100 text-violet-700 hover:bg-violet-100"
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
