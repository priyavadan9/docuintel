import { useDemo } from "@/contexts/DemoContext";
import { 
  Copy, 
  FileText,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Merge
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DuplicatesView() {
  const { documents } = useDemo();
  const duplicates = documents.filter((d) => d.status === "duplicate");

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Copy className="h-6 w-6 text-destructive" />
            Duplicate Detection
          </h1>
          <p className="text-muted-foreground">{duplicates.length} duplicate documents detected</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-destructive">{duplicates.length}</p>
            <p className="text-sm text-muted-foreground">Duplicates Found</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">99.1%</p>
            <p className="text-sm text-muted-foreground">Avg Similarity</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">245 KB</p>
            <p className="text-sm text-muted-foreground">Storage Saved</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">Sources Scanned</p>
          </CardContent>
        </Card>
      </div>

      {duplicates.length === 0 ? (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Duplicates</h3>
            <p className="text-muted-foreground">Your document library is clean with no detected duplicates.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {duplicates.map((doc) => (
            <Card key={doc.id} className="bg-gradient-card border-border/50 hover:border-destructive/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Original Document */}
                  <div className="flex-1 p-4 rounded-lg bg-secondary/30 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Original</p>
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">INV-2024-001.pdf</p>
                        <p className="text-xs text-muted-foreground">Email • 30m ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Similarity Indicator */}
                  <div className="flex flex-col items-center justify-center">
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                      99.1% Match
                    </Badge>
                    <div className="h-8 w-px bg-border my-2" />
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* Duplicate Document */}
                  <div className="flex-1 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <p className="text-xs text-destructive mb-2">Duplicate</p>
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-destructive" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{doc.source} • 15m ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detection Info */}
                <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Detection Method:</span>
                      <Badge variant="outline">Content Hash</Badge>
                      <Badge variant="outline">AI Similarity</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Compare
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Merge className="h-4 w-4" />
                        Merge
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Keep Both
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Duplicate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Duplicate Handling Rules */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Duplicate Handling Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rule: "Auto-flag exact hash matches", action: "Flag for Review", enabled: true },
              { rule: "Content similarity > 95%", action: "Flag for Review", enabled: true },
              { rule: "Same filename from different sources", action: "Auto-suppress", enabled: false },
              { rule: "Cross-source scanning", action: "Enabled", enabled: true },
            ].map((rule, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${rule.enabled ? "bg-success" : "bg-muted"}`} />
                  <span className="text-sm">{rule.rule}</span>
                </div>
                <Badge variant="outline">{rule.action}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
