import { Check, X, Minus } from "lucide-react";

const comparisonData = [
  {
    feature: "Time to Complete",
    traditional: "6-12 months",
    generic: "3-6 months (manual input)",
    ours: "60-90 days"
  },
  {
    feature: "Cost",
    traditional: "$50K-$200K",
    generic: "$25K-$100K/year",
    ours: "Starting at $15K"
  },
  {
    feature: "Document Intelligence",
    traditional: "Manual review",
    generic: "User must enter data",
    ours: "Automatic extraction"
  },
  {
    feature: "Accuracy",
    traditional: "Human error risk",
    generic: "Depends on user input",
    ours: "AI + expert validation"
  },
  {
    feature: "Audit Trail",
    traditional: "Limited documentation",
    generic: "Database logs",
    ours: "Complete AI decision trail"
  },
  {
    feature: "Scalability",
    traditional: "Limited by headcount",
    generic: "Limited by user capacity",
    ours: "Unlimited documents"
  }
];

export function ComparisonSection() {
  return (
    <section className="py-24 relative bg-card/30">
      <div className="container px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why We're Different from
            <span className="text-gradient"> Traditional Solutions</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Traditional Consultants</th>
                <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Generic Compliance Software</th>
                <th className="text-center py-4 px-4 font-semibold text-gradient">Our AI Solution</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={row.feature} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-4 px-4 font-medium">{row.feature}</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{row.traditional}</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{row.generic}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {row.ours}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
