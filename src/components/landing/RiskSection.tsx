import { AlertTriangle, Scale, Globe, Users, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const risks = [
  {
    icon: Scale,
    title: "Regulatory Penalties",
    description: "EPA violations can result in fines up to $50,000+ per day for non-compliance. Late or incomplete submissions may trigger audits and enforcement actions."
  },
  {
    icon: Globe,
    title: "Public Disclosure",
    description: "Your PFAS data becomes public record. Incomplete or inaccurate reporting exposes you to competitor intelligence gathering, investor scrutiny, and NGO targeting."
  },
  {
    icon: Users,
    title: "Litigation Risk",
    description: "PFAS is the 'next asbestos.' Companies with undocumented PFAS use face increased liability in environmental contamination lawsuits and product liability claims."
  },
  {
    icon: TrendingDown,
    title: "Market Access",
    description: "Customers and retailers (especially in EU markets) are requiring PFAS declarations. Without documentation, you may lose key customer relationships and supply chain partnerships."
  }
];

export function RiskSection() {
  return (
    <section className="py-24 relative bg-destructive/5">
      <div className="container px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 mb-6">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Don't Risk It</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            The Cost of
            <span className="text-destructive"> Non-Compliance</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {risks.map((risk, i) => (
            <div
              key={risk.title}
              className="p-8 rounded-2xl bg-card border border-destructive/20 hover:border-destructive/40 transition-all"
            >
              <div className="mb-4 p-3 w-fit rounded-xl bg-destructive/10">
                <risk.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{risk.title}</h3>
              <p className="text-muted-foreground">{risk.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="xl">
            Get Compliant Now
          </Button>
        </div>
      </div>
    </section>
  );
}
