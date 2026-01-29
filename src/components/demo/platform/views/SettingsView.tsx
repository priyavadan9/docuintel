import { 
  Settings,
  FileText,
  Brain,
  Shield,
  Bell,
  Database,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsView() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">Configure document types, rules, and system preferences</p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="extraction">Extraction</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6 space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Document Types
              </CardTitle>
              <CardDescription>Configure document classification categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Invoice", "Contract", "Policy", "Form", "Manual", "Statement"].map((type) => (
                <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Switch defaultChecked />
                    <span className="font-medium">{type}</span>
                  </div>
                  <Button variant="outline" size="sm">Configure Fields</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">+ Add Custom Document Type</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">File Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max File Size (MB)</Label>
                  <Input type="number" defaultValue="50" className="mt-2" />
                </div>
                <div>
                  <Label>Supported Formats</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Formats</SelectItem>
                      <SelectItem value="pdf">PDF Only</SelectItem>
                      <SelectItem value="docs">Documents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extraction" className="mt-6 space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Extraction Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Confidence Threshold</Label>
                  <span className="text-sm text-muted-foreground">70%</span>
                </div>
                <Slider defaultValue={[70]} max={100} step={5} />
                <p className="text-xs text-muted-foreground mt-2">
                  Documents below this threshold will be routed to manual review
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">OCR Enhancement</p>
                  <p className="text-sm text-muted-foreground">Apply image preprocessing for better extraction</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Table Detection</p>
                  <p className="text-sm text-muted-foreground">Extract structured data from tables</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Handwriting Recognition</p>
                  <p className="text-sm text-muted-foreground">Enable handwritten text extraction (slower)</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="mt-6 space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Validation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { rule: "Invoice total = sum(line items) + tax", enabled: true },
                { rule: "Invoice date cannot be future", enabled: true },
                { rule: "Contract expiry > effective date", enabled: true },
                { rule: "Mandatory fields cannot be empty", enabled: true },
                { rule: "Cross-document duplicate check", enabled: true },
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <span className="text-sm">{rule.rule}</span>
                  <Switch defaultChecked={rule.enabled} />
                </div>
              ))}
              <Button variant="outline" className="w-full">+ Add Custom Rule</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Duplicate Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Similarity Threshold</Label>
                  <span className="text-sm text-muted-foreground">95%</span>
                </div>
                <Slider defaultValue={[95]} max={100} step={1} />
              </div>
              <div>
                <Label>Duplicate Action</Label>
                <Select defaultValue="flag">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flag">Flag for Review</SelectItem>
                    <SelectItem value="suppress">Auto-suppress</SelectItem>
                    <SelectItem value="keep-latest">Keep Latest Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Processing Complete", desc: "When documents finish processing", enabled: true },
                { label: "Exceptions Detected", desc: "When documents fail validation", enabled: true },
                { label: "Duplicates Found", desc: "When duplicate documents are detected", enabled: true },
                { label: "Integration Errors", desc: "When cloud sync or ERP push fails", enabled: true },
                { label: "Daily Summary", desc: "Receive a daily processing summary", enabled: false },
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium">{notif.label}</p>
                    <p className="text-sm text-muted-foreground">{notif.desc}</p>
                  </div>
                  <Switch defaultChecked={notif.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="font-medium">Audit Logging</p>
                  <p className="text-sm text-muted-foreground">Track all user actions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Document Retention Period</Label>
                <Select defaultValue="365">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Audit Log Retention</Label>
                <Select defaultValue="365">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                    <SelectItem value="1825">5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
