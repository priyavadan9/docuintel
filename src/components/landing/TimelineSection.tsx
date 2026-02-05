import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const timelineSteps = [
  { label: "Now - March 2026", description: "Document gathering and AI processing (60-90 days)" },
  { label: "April - June 2026", description: "Expert review and gap filling (60 days)" },
  { label: "July - August 2026", description: "Final submission preparation (30 days)" },
  { label: "September 2026", description: "Buffer for EPA portal issues/corrections (30 days)" },
  { label: "October 13, 2026", description: "DEADLINE", isDeadline: true }
];

export function TimelineSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 mb-6">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">20 Months Remaining</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Time Is
            <span className="text-gradient"> Running Out</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary to-destructive" />
            
            {/* Timeline Steps */}
            <div className="space-y-8">
              {timelineSteps.map((step, i) => (
                <div key={i} className="relative pl-12">
                  <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                    step.isDeadline 
                      ? "bg-destructive border-destructive" 
                      : "bg-primary border-primary"
                  }`} />
                  <div className={`p-4 rounded-xl ${
                    step.isDeadline 
                      ? "bg-destructive/10 border border-destructive/30" 
                      : "bg-secondary/30"
                  }`}>
                    <p className={`font-semibold ${step.isDeadline ? "text-destructive" : ""}`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-center mb-8">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Companies starting in Q3 2026</span> may not have sufficient time 
            to complete compliance, especially if supplier data requests take months.
          </p>
        </div>

        <div className="text-center">
          <Button variant="hero" size="xl" className="group">
            Start Your Assessment Today
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
