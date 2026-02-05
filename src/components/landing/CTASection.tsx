import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Calendar, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const benefits = [
  "30-minute call to scope your project",
  "No credit card required",
  "Free compliance assessment",
  "Expert consultation included"
];

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="absolute inset-0 bg-gradient-glow" />
      
      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Don't Face the EPA Deadline
            <br />
            <span className="text-gradient">Alone</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join forward-thinking manufacturers who are leveraging AI to simplify PFAS compliance.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button variant="hero" size="xl" className="group" onClick={() => navigate("/login")}>
              Get Your Free Compliance Assessment
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="glass" size="lg" className="gap-2">
              <FileText className="h-5 w-5" />
              Download: Complete Guide to EPA PFAS Reporting
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Calendar className="h-5 w-5" />
              Schedule a Live Demo
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            <p>Email: compliance@omnireagent.com • Phone: 1-800-PFAS-HELP</p>
            <p className="mt-2">Monday-Friday 9am-6pm EST</p>
          </div>
        </div>
      </div>
    </section>
  );
}
