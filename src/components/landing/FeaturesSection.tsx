import { 
  Upload, 
  Brain, 
  FileSearch, 
  Copy, 
  CheckCircle, 
  MessageSquare,
  Workflow,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Multi-Source Ingestion",
    description: "Upload documents or sync from Google Drive, OneDrive, SharePoint, Dropbox, and email inboxes automatically."
  },
  {
    icon: Brain,
    title: "AI Classification",
    description: "Automatically classify invoices, contracts, forms, policies, and more using advanced document understanding."
  },
  {
    icon: FileSearch,
    title: "Smart Extraction",
    description: "Extract structured data fields with high accuracy using AI-powered document analysis."
  },
  {
    icon: Copy,
    title: "Duplicate Detection",
    description: "Identify duplicate and near-duplicate documents across all sources, preventing redundant processing."
  },
  {
    icon: CheckCircle,
    title: "Validation Engine",
    description: "Validate extracted data against business rules and consistency checks before downstream processing."
  },
  {
    icon: Workflow,
    title: "System Integration",
    description: "Route validated data to ERP, CRM, workflow tools, or custom systems via flexible APIs."
  },
  {
    icon: MessageSquare,
    title: "Document Chat",
    description: "Ask questions, get summaries, and compare documents through natural conversation."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant with encryption at rest and in transit, role-based access controls, and audit logs."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for
            <span className="text-gradient"> Document Intelligence</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to transform manual document handling into automated, intelligent processing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-4 p-3 w-fit rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
