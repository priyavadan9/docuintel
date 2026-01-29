import { useDemo } from "@/contexts/DemoContext";
import { 
  AlertTriangle, 
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCw,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ExceptionsView() {
  const { documents, setActiveView } = useDemo();
  const exceptions = documents.filter((d) => d.status === "exception");

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
            Exceptions Queue
          </h1>
          <p className="text-muted-foreground">{exceptions.length} documents require manual review</p>
        </div>
      </div>

      {exceptions.length === 0 ? (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Exceptions</h3>
            <p className="text-muted-foreground">All documents have been processed successfully.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {exceptions.map((doc) => (
            <Card key={doc.id} className="bg-gradient-card border-border/50 hover:border-warning/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Document Preview */}
                  <div className="h-24 w-20 bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {/* Document Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">{doc.type}</Badge>
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                            {doc.confidence.toFixed(1)}% Confidence
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">{doc.source}</span>
                    </div>

                    {/* Reason */}
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 mt-3">
                      <p className="text-sm text-warning font-medium mb-1">Exception Reason</p>
                      <p className="text-sm text-muted-foreground">
                        Low confidence classification. The document structure doesn't match expected patterns for "{doc.type}" type. Manual verification recommended.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Review Document
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <RotateCw className="h-4 w-4" />
                        Reprocess
                      </Button>
                      <Button size="sm" className="gap-2 bg-success hover:bg-success/90">
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Validation Rules */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Validation Rules Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              { rule: "Invoice total = sum(line items) + tax", status: "active" },
              { rule: "Invoice date cannot be in future", status: "active" },
              { rule: "Contract expiry > effective date", status: "active" },
              { rule: "Mandatory fields cannot be empty", status: "active" },
              { rule: "Same invoice# from same vendor → flag", status: "active" },
              { rule: "Minimum confidence threshold: 70%", status: "active" },
            ].map((rule, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <span className="text-sm">{rule.rule}</span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
