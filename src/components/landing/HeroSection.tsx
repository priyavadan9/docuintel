import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Sparkles, Brain, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-gradient-glow" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="container relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Document Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Transform Documents
            <br />
            <span className="text-gradient">Into Insights</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload, classify, extract, and chat with your business documents. 
            Reduce manual processing by 90% with intelligent automation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="hero" size="xl" className="group">
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl">
              Watch Demo
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Upload, label: "Smart Upload" },
              { icon: Brain, label: "AI Classification" },
              { icon: Zap, label: "Instant Extraction" },
            ].map((feature, i) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-3xl" />
          <div className="relative glass rounded-2xl p-2 shadow-elevated">
            <div className="bg-card rounded-xl overflow-hidden">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-32 bg-secondary rounded-lg animate-pulse" />
          <div className="h-8 w-24 bg-secondary/50 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-secondary rounded-lg" />
          <div className="h-8 w-8 bg-secondary rounded-lg" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Documents", value: "2,847" },
          { label: "Processed", value: "2,691" },
          { label: "Pending", value: "156" },
          { label: "Accuracy", value: "99.2%" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-secondary/30 rounded-xl">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-gradient">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { type: "Invoice", status: "Processed", confidence: "98%" },
          { type: "Contract", status: "Processing", confidence: "—" },
          { type: "Form", status: "Processed", confidence: "95%" },
        ].map((doc, i) => (
          <div key={i} className="p-4 bg-gradient-card rounded-xl border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{doc.type}</p>
                <p className="text-xs text-muted-foreground">{doc.status}</p>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary rounded-full"
                style={{ width: doc.confidence === "—" ? "60%" : doc.confidence }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
