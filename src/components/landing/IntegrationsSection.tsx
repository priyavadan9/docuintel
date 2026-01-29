import { Cloud, Database, Mail, FolderSync } from "lucide-react";

const integrations = [
  {
    name: "Google Drive",
    icon: "https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",
    category: "Cloud Storage"
  },
  {
    name: "OneDrive",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg",
    category: "Cloud Storage"
  },
  {
    name: "SharePoint",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Microsoft_Office_SharePoint_%282019%E2%80%93present%29.svg",
    category: "Enterprise"
  },
  {
    name: "Dropbox",
    icon: "https://www.dropbox.com/static/images/logo.svg",
    category: "Cloud Storage"
  },
  {
    name: "Salesforce",
    icon: "https://www.salesforce.com/content/dam/sfdc-docs/www/logos/logo-salesforce.svg",
    category: "CRM"
  },
  {
    name: "SAP",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    category: "ERP"
  }
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-24 relative overflow-hidden">
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Connect Your
            <span className="text-gradient"> Entire Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Seamlessly integrate with your existing cloud storage, enterprise systems, and business applications.
          </p>
        </div>

        {/* Integration Categories */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Cloud, label: "Cloud Storage", count: "4+" },
            { icon: Database, label: "ERP Systems", count: "10+" },
            { icon: Mail, label: "Email Providers", count: "5+" },
            { icon: FolderSync, label: "Workflow Tools", count: "15+" },
          ].map((cat) => (
            <div key={cat.label} className="p-6 rounded-2xl glass text-center">
              <cat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="font-semibold">{cat.label}</p>
              <p className="text-2xl font-bold text-gradient">{cat.count}</p>
            </div>
          ))}
        </div>

        {/* Integration Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="p-4 rounded-xl glass hover:shadow-glow transition-all duration-300 flex items-center gap-3"
            >
              <div className="h-10 w-10 flex items-center justify-center">
                <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {integration.name[0]}
                </div>
              </div>
              <div>
                <p className="font-medium">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Don't see your tool? We support custom integrations via API.
          </p>
          <a href="#" className="text-primary hover:underline font-medium">
            View All Integrations →
          </a>
        </div>
      </div>
    </section>
  );
}
