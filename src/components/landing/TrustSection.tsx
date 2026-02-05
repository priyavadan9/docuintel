import { Shield, Server, Brain, Database } from "lucide-react";

const certifications = [
  "SOC 2 Type II Certified",
  "ISO 27001 Information Security",
  "GDPR Compliant",
  "EPA Chemical Database Partner"
];

const partners = [
  { name: "AWS Cloud Infrastructure", icon: Server },
  { name: "Anthropic AI", icon: Brain },
  { name: "CompTox Chemistry Database", icon: Database }
];

export function TrustSection() {
  return (
    <section className="py-16 relative border-y border-border/50">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Security Badges */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Security & Compliance
            </h4>
            <div className="flex flex-wrap gap-4">
              {certifications.map((cert, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Technology Partners
            </h4>
            <div className="flex flex-wrap gap-4">
              {partners.map((partner, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50"
                >
                  <partner.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
