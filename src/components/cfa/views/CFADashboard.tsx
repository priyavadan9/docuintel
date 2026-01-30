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
  FileWarning
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  ComposedChart
} from "recharts";

const chartData = [
  { month: "Jan", processed: 1200, risks: 15 },
  { month: "Feb", processed: 1800, risks: 23 },
  { month: "Mar", processed: 2100, risks: 31 },
  { month: "Apr", processed: 2400, risks: 28 },
  { month: "May", processed: 2800, risks: 35 },
  { month: "Jun", processed: 3100, risks: 42 },
];

export function CFADashboard() {
  const { stats, auditLog, chemicalRecords } = useCFA();

  const statCards = [
    {
      title: "Documents Ingested",
      value: stats.documentsIngested.toLocaleString(),
      icon: FileText,
      trend: "+12.3%",
      trendUp: true,
      bgColor: "bg-slate-50",
      iconColor: "text-slate-600",
      borderColor: "border-slate-200"
    },
    {
      title: "PFAS Candidates Found",
      value: stats.pfasCandidates.toString(),
      icon: AlertTriangle,
      trend: "+8 this week",
      trendUp: true,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200",
      valueColor: "text-rose-600"
    },
    {
      title: "Data Gaps",
      value: stats.dataGaps.toString(),
      icon: SearchIcon,
      trend: "-3 resolved",
      trendUp: false,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      valueColor: "text-amber-600"
    },
    {
      title: "RFIs Sent",
      value: stats.rfisSent.toString(),
      icon: Send,
      trend: "+2 this week",
      trendUp: true,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      valueColor: "text-emerald-600"
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`border ${stat.borderColor} shadow-sm`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className={`text-3xl font-bold mt-1 ${stat.valueColor || "text-slate-900"}`}>
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trendUp ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-emerald-500" />
                      )}
                      <span className="text-xs text-slate-500">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
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
            <CardTitle className="text-lg font-semibold text-slate-900">
              Documents Processed vs. Risks Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
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
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="processed" 
                    fill="#0d9488" 
                    radius={[4, 4, 0, 0]}
                    name="Documents Processed"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="risks" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    dot={{ fill: "#f43f5e" }}
                    name="Risks Identified"
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
                return (
                  <div key={entry.id} className="flex items-start gap-3">
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Items */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-rose-500" />
            High-Priority Items Requiring Attention
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
                </tr>
              </thead>
              <tbody>
                {highRiskItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-slate-900">{item.productName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-sm bg-slate-100 px-2 py-0.5 rounded">{item.casNumber}</code>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{item.supplier}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${
                        item.riskScore >= 90 
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-100" 
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      }`}>
                        {item.riskScore}/100
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${
                        item.status === "evidence-gap"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          : item.status === "verified"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-violet-100 text-violet-700 hover:bg-violet-100"
                      }`}>
                        {item.status === "evidence-gap" ? "Evidence Gap" : 
                         item.status === "verified" ? "Verified" : "Pending Review"}
                      </Badge>
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
