import { 
  FileSearch, 
  Brain, 
  Building2, 
  FileCheck, 
  Shield,
  HeadphonesIcon,
  Languages,
  Database,
  Link2,
  FileText
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Intelligent Document Processing",
    items: [
      "OCR for scanned invoices and legacy documents",
      "Multi-language support (English, Chinese, Japanese, German)",
      "Automatic data extraction from tables, headers, line items",
      "Handles PDFs, images, Excel, CSV, emails"
    ]
  },
  {
    icon: Brain,
    title: "Chemical Intelligence",
    items: [
      "12,000+ PFAS substance database (EPA CompTox)",
      "Trade name to CAS number mapping",
      "Synonym recognition ('Teflon' → 'PTFE' → CAS# → PFAS structure)",
      "Automatic structural formula validation"
    ]
  },
  {
    icon: Building2,
    title: "Supply Chain Mapping",
    items: [
      "Supplier risk scoring based on industry and geography",
      "Automated supplier outreach templates",
      "Document request tracking",
      "Gap identification for missing data"
    ]
  },
  {
    icon: FileCheck,
    title: "Compliance Reporting",
    items: [
      "Pre-built EPA submission templates",
      "Year-by-year chemical inventory",
      "Volume calculations and unit conversions",
      "Supporting documentation package"
    ]
  },
  {
    icon: Shield,
    title: "Data Security",
    items: [
      "SOC 2 Type II certified",
      "End-to-end encryption",
      "Role-based access controls",
      "Cloud or on-premise deployment options"
    ]
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    items: [
      "Dedicated compliance manager",
      "Chemical expert review of flagged items",
      "Regulatory guidance and interpretation",
      "EPA submission support"
    ]
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Enterprise-Grade Features
            <span className="text-gradient"> Built for Compliance</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to transform complex document review into automated, intelligent processing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="mb-4 p-3 w-fit rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <ul className="space-y-2">
                {feature.items.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
