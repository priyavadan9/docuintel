import { AlertTriangle, FileSearch, Building2, Scale, Globe } from "lucide-react";

const challenges = [
  {
    icon: FileSearch,
    title: "12 Years of Records",
    description: "Review thousands of invoices, shipping documents, and supplier communications from 2011-2022"
  },
  {
    icon: AlertTriangle,
    title: "12,000+ PFAS Chemicals",
    description: "Identify substances appearing as trade names, CAS numbers, or generic descriptions like 'fluoropolymer coating'"
  },
  {
    icon: Building2,
    title: "Complex Supply Chains",
    description: "Your suppliers may not even know what's in the materials they sold you"
  },
  {
    icon: Scale,
    title: "'Known or Reasonably Ascertainable'",
    description: "The EPA standard requires exhaustive due diligence across your entire documentation"
  },
  {
    icon: Globe,
    title: "Public Disclosure",
    description: "Your PFAS data becomes public record with potential litigation and market access risks"
  }
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 relative bg-card/30">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 mb-6">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Critical Compliance Deadline</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The October 2026 Deadline Is
              <span className="text-gradient"> Closer Than You Think</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              If your company manufactured or imported PFAS-containing products between 2011-2022, 
              you're required to report to the EPA under TSCA Section 8(a)(7).
            </p>
          </div>

          {/* Challenge Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {challenges.map((challenge, i) => (
              <div
                key={challenge.title}
                className="p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-destructive/30 transition-all"
              >
                <div className="mb-4 p-3 w-fit rounded-xl bg-destructive/10">
                  <challenge.icon className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
            ))}
          </div>

          {/* Traditional Approach Warning */}
          <div className="p-8 rounded-2xl bg-destructive/5 border border-destructive/20">
            <h3 className="text-xl font-semibold mb-4 text-destructive">The Traditional Approach</h3>
            <p className="text-muted-foreground mb-4">
              Hiring environmental consultants costs <span className="font-semibold text-foreground">$50,000-$200,000</span> and 
              takes <span className="font-semibold text-foreground">6-12 months</span> of manual document review. 
              Even then, accuracy isn't guaranteed.
            </p>
            <p className="text-lg font-semibold text-gradient">There's a better way.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
