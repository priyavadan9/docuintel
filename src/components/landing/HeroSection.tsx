import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Clock, FileCheck } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();

  const handleGetAssessment = () => {
    navigate("/login");
  };

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
          {/* Deadline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 mb-8">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">October 2026 EPA Deadline Approaching</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            EPA PFAS Reporting
            <br />
            <span className="text-gradient">Made Simple with AI</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Automatically scan 12 years of documents to identify PFAS substances 
            and generate your EPA submission—in weeks, not months.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="xl" className="group" onClick={handleGetAssessment}>
              Get Your Free Compliance Assessment
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl" className="gap-2">
              <Play className="h-5 w-5" />
              See How It Works
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-16">
            <Shield className="h-4 w-4 text-primary" />
            <span>Trusted by manufacturers across automotive, electronics, and industrial sectors</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "12,000+", label: "PFAS Chemicals Identified" },
              { value: "90 Days", label: "Average Completion Time" },
              { value: "90%", label: "Cost Savings vs Consultants" },
              { value: "99%+", label: "Accuracy Rate" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl glass">
                <p className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
