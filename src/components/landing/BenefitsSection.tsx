import { Clock, DollarSign, Target, Shield, Users, Compass } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "10x Faster Than Manual Review",
    description: "What takes consultants 6-12 months, our AI completes in 60-90 days. Meet the October 2026 deadline with time to spare."
  },
  {
    icon: DollarSign,
    title: "90%+ Cost Savings",
    description: "Typical consultant fees: $50K-$200K. Our solution: Starting at $15K for mid-market companies. Enterprise-grade compliance at a fraction of the cost."
  },
  {
    icon: Target,
    title: "Superior Accuracy",
    description: "AI eliminates human error in document review. Every extraction is traceable, auditable, and backed by our compliance guarantee."
  },
  {
    icon: Shield,
    title: "Complete Audit Trail",
    description: "Full transparency into every AI decision. Show EPA exactly how you identified each PFAS substance with complete documentation."
  },
  {
    icon: Users,
    title: "No Disruption to Your Team",
    description: "We handle the heavy lifting. Your team spends hours, not months, on compliance—freeing them to focus on core business."
  },
  {
    icon: Compass,
    title: "Future-Proof Compliance",
    description: "Optional ongoing monitoring ensures new products are screened for PFAS before they enter your supply chain."
  }
];

export function BenefitsSection() {
  return (
    <section className="py-24 relative bg-card/30">
      <div className="container px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why Choose Our
            <span className="text-gradient"> AI-First Approach?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Combine the precision of AI with expert human oversight for unmatched compliance confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className="group p-8 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="mb-6 p-4 w-fit rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
