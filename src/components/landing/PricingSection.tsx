import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "STARTER",
    price: "$15,000",
    description: "Best for: Small manufacturers (50-200 employees)",
    features: [
      "Up to 5,000 documents",
      "Up to 50 unique suppliers",
      "2-4 week turnaround",
      "Basic EPA submission package",
      "Email support"
    ],
    highlighted: false
  },
  {
    name: "PROFESSIONAL",
    price: "$35,000",
    description: "Best for: Mid-market companies (200-1,000 employees)",
    features: [
      "Up to 20,000 documents",
      "Up to 200 unique suppliers",
      "6-8 week turnaround",
      "Complete EPA submission package",
      "Dedicated compliance manager",
      "Supplier outreach support"
    ],
    highlighted: true
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    description: "Best for: Large organizations (1,000+ employees)",
    features: [
      "Unlimited documents",
      "Multi-site operations",
      "Priority processing",
      "White-glove service",
      "On-premise deployment option",
      "Ongoing compliance monitoring"
    ],
    highlighted: false
  }
];

const allPlansInclude = [
  "AI document processing",
  "Chemical expert review",
  "Audit trail documentation",
  "Gap analysis report",
  "90-day compliance guarantee"
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Transparent Pricing,
            <span className="text-gradient"> Predictable Costs</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`p-8 rounded-2xl border transition-all ${
                plan.highlighted 
                  ? "bg-gradient-card border-primary shadow-glow scale-105" 
                  : "bg-card/50 border-border/50 hover:border-primary/50"
              }`}
            >
              {plan.highlighted && (
                <div className="text-center mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gradient">{plan.price}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.highlighted ? "hero" : "outline"} 
                className="w-full group"
              >
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* All Plans Include */}
        <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl bg-secondary/30 border border-border/50">
          <h4 className="font-semibold mb-4">All Plans Include:</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {allPlansInclude.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
