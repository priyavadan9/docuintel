import { Upload, Brain, UserCheck, FileCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Documents",
    description: "Simply provide your historical invoices, purchase orders, bills of lading, and supplier documentation from 2011-2022. We accept PDFs, scanned images, Excel files, emails—any format."
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Extraction & Analysis",
    items: [
      "Extracts product names, suppliers, quantities, and dates from messy documents",
      "Identifies potential PFAS substances using trade names, CAS numbers, and chemical descriptions",
      "Maps your supply chain to flag high-risk suppliers and materials",
      "Cross-references against EPA's PFAS database (12,000+ substances)"
    ]
  },
  {
    number: "03",
    icon: UserCheck,
    title: "Expert Review & Validation",
    description: "Our compliance experts review AI-flagged items for accuracy, resolve ambiguities, and ensure regulatory compliance."
  },
  {
    number: "04",
    icon: FileCheck,
    title: "EPA Submission Package",
    items: [
      "Detailed PFAS inventory by chemical, year, and volume",
      "Supplier documentation and chain of custody",
      "Gap analysis and recommendations",
      "Draft EPA Form ready for CDX portal submission"
    ]
  }
];

export function SolutionSection() {
  return (
    <section id="solution" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              AI-Powered PFAS Compliance
              <span className="text-gradient"> in 90 Days</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines advanced document intelligence with chemical expertise 
              to automate your entire PFAS reporting process.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex gap-6 p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all group"
              >
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="text-2xl font-bold text-gradient">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  
                  {step.description && (
                    <p className="text-muted-foreground">{step.description}</p>
                  )}
                  
                  {step.items && (
                    <ul className="space-y-2 mt-2">
                      {step.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-muted-foreground">
                          <ArrowRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-lg font-semibold">Timeline:</span>
              <span className="text-lg text-gradient font-bold">60-90 days from document upload to final report</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
