import { useDemo } from "@/contexts/DemoContext";
import { 
  Brain, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const documentTypes = [
  { type: "invoice", label: "Invoice", count: 0, color: "bg-info" },
  { type: "contract", label: "Contract", count: 0, color: "bg-primary" },
  { type: "policy", label: "Policy", count: 0, color: "bg-warning" },
  { type: "form", label: "Form", count: 0, color: "bg-success" },
  { type: "manual", label: "Manual", count: 0, color: "bg-accent" },
  { type: "statement", label: "Statement", count: 0, color: "bg-destructive" },
];

export function ClassificationView() {
  const { documents } = useDemo();

  const typeStats = documentTypes.map((dt) => ({
    ...dt,
    count: documents.filter((d) => d.type === dt.type).length,
  }));

  const totalDocs = documents.length;
  const highConfidence = documents.filter((d) => d.confidence >= 90).length;
  const mediumConfidence = documents.filter((d) => d.confidence >= 70 && d.confidence < 90).length;
  const lowConfidence = documents.filter((d) => d.confidence > 0 && d.confidence < 70).length;

  const recentClassifications = documents
    .filter((d) => d.confidence > 0)
    .slice(0, 6);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Classification
          </h1>
          <p className="text-muted-foreground">Automatic document type detection with confidence scoring</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retrain Model
        </Button>
      </div>

      {/* Confidence Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDocs}</p>
                <p className="text-xs text-muted-foreground">Total Classified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highConfidence}</p>
                <p className="text-xs text-muted-foreground">High Confidence (90%+)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mediumConfidence}</p>
                <p className="text-xs text-muted-foreground">Medium (70-90%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lowConfidence}</p>
                <p className="text-xs text-muted-foreground">Low (&lt;70%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Document Type Distribution */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Document Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typeStats.map((type) => (
                <div key={type.type} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium">{type.label}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all", type.color)}
                        style={{ width: `${totalDocs > 0 ? (type.count / totalDocs) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">
                    {type.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Classification Pipeline */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Classification Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Document Ingestion</p>
                  <p className="text-xs text-muted-foreground">OCR & Text Extraction</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-info/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">AI Classification</p>
                  <p className="text-xs text-muted-foreground">Multi-label document typing</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Confidence Check</p>
                  <p className="text-xs text-muted-foreground">Low scores route to review</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Data Extraction</p>
                  <p className="text-xs text-muted-foreground">Type-specific field mapping</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Classifications */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Classifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {recentClassifications.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <Badge variant="outline" className="capitalize">{doc.type}</Badge>
                </div>
                <p className="text-sm font-medium truncate mb-2">{doc.name}</p>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={doc.confidence} 
                    className={cn(
                      "h-2 flex-1",
                      doc.confidence >= 90 ? "[&>div]:bg-success" : doc.confidence >= 70 ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"
                    )} 
                  />
                  <span className="text-xs text-muted-foreground">{doc.confidence.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
