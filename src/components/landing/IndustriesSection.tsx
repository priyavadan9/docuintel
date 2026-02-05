import { Car, Cpu, Factory, Plane, Shirt, Stethoscope } from "lucide-react";

const industries = [
  {
    icon: Car,
    title: "Automotive & Transportation",
    description: "Components, electronics, seals, gaskets, coatings, lubricants"
  },
  {
    icon: Cpu,
    title: "Electronics Manufacturing",
    description: "PCBs, wire harnesses, conformal coatings, connector systems"
  },
  {
    icon: Factory,
    title: "Industrial Equipment",
    description: "Hydraulic systems, sealing solutions, pumps, valves, machinery"
  },
  {
    icon: Plane,
    title: "Aerospace & Defense",
    description: "High-performance seals, specialized coatings, electronic components"
  },
  {
    icon: Shirt,
    title: "Textiles & Apparel",
    description: "Waterproof fabrics, stain-resistant treatments, outdoor gear"
  },
  {
    icon: Stethoscope,
    title: "Medical Devices",
    description: "Gaskets, tubing, coatings for pharmaceutical equipment"
  }
];

export function IndustriesSection() {
  return (
    <section className="py-24 relative bg-card/30">
      <div className="container px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for Complex Supply Chains
            <span className="text-gradient"> Across Industries</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => (
            <div
              key={industry.title}
              className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="mb-4 p-3 w-fit rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <industry.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{industry.title}</h3>
              <p className="text-sm text-muted-foreground">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
