import { 
  BarChart3,
  TrendingUp,
  FileStack,
  Brain,
  Clock,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

const processingData = [
  { name: "Mon", documents: 42, automated: 38 },
  { name: "Tue", documents: 65, automated: 60 },
  { name: "Wed", documents: 48, automated: 45 },
  { name: "Thu", documents: 78, automated: 74 },
  { name: "Fri", documents: 95, automated: 89 },
  { name: "Sat", documents: 23, automated: 22 },
  { name: "Sun", documents: 15, automated: 14 },
];

const typeDistribution = [
  { name: "Invoices", value: 45, color: "hsl(199, 89%, 48%)" },
  { name: "Contracts", value: 25, color: "hsl(173, 80%, 50%)" },
  { name: "Forms", value: 15, color: "hsl(142, 76%, 46%)" },
  { name: "Policies", value: 10, color: "hsl(38, 92%, 50%)" },
  { name: "Other", value: 5, color: "hsl(217, 33%, 50%)" },
];

const accuracyTrend = [
  { month: "Aug", accuracy: 94.2 },
  { month: "Sep", accuracy: 95.8 },
  { month: "Oct", accuracy: 96.5 },
  { month: "Nov", accuracy: 97.2 },
  { month: "Dec", accuracy: 98.1 },
  { month: "Jan", accuracy: 99.2 },
];

export function AnalyticsView() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics & Reports
        </h1>
        <p className="text-muted-foreground">Processing metrics and performance insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents This Week</p>
                <p className="text-3xl font-bold">366</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +12% from last week
                </p>
              </div>
              <FileStack className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Automation Rate</p>
                <p className="text-3xl font-bold">93.4%</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +2.1% improvement
                </p>
              </div>
              <Brain className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                <p className="text-3xl font-bold">4.2s</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> -0.8s faster
                </p>
              </div>
              <Clock className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">24</p>
                <p className="text-xs text-muted-foreground mt-1">
                  8 admins, 16 users
                </p>
              </div>
              <Users className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Processing Volume Chart */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Processing Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
                  <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(222 47% 8%)", 
                      border: "1px solid hsl(217 33% 17%)",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="documents" 
                    stroke="hsl(173 80% 50%)" 
                    fill="hsl(173 80% 50% / 0.2)" 
                    name="Total Documents"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="automated" 
                    stroke="hsl(142 76% 46%)" 
                    fill="hsl(142 76% 46% / 0.2)" 
                    name="Automated"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Document Type Distribution */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Document Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(222 47% 8%)", 
                        border: "1px solid hsl(217 33% 17%)",
                        borderRadius: "8px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2">
                {typeDistribution.map((type) => (
                  <div key={type.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-sm">{type.name}</span>
                    </div>
                    <span className="text-sm font-medium">{type.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy Trend */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Extraction Accuracy Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
                <XAxis dataKey="month" stroke="hsl(215 20% 55%)" fontSize={12} />
                <YAxis stroke="hsl(215 20% 55%)" fontSize={12} domain={[90, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(222 47% 8%)", 
                    border: "1px solid hsl(217 33% 17%)",
                    borderRadius: "8px"
                  }} 
                  formatter={(value) => [`${value}%`, "Accuracy"]}
                />
                <Bar dataKey="accuracy" fill="hsl(173 80% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
