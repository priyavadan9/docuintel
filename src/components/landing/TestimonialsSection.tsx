import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "We were facing a $75K consultant quote and 8-month timeline. OmniReagent's AI platform delivered our EPA submission in 10 weeks for a fraction of the cost. The audit trail they provided gave us complete confidence in our submission.",
    author: "Jane Smith",
    role: "VP Environmental Compliance",
    company: "Fortune 500 Electronics Manufacturer"
  },
  {
    quote: "With suppliers across China, Taiwan, and Japan, our documentation was a nightmare—invoices in multiple languages, inconsistent naming conventions. The AI handled it all seamlessly. We identified PFAS in products we never would have caught manually.",
    author: "Mike Johnson",
    role: "Director of Supply Chain",
    company: "Mid-Market Automotive Components Supplier"
  },
  {
    quote: "The team's chemical expertise combined with AI automation gave us the best of both worlds. They flagged edge cases our own engineers missed and explained every decision clearly.",
    author: "Sarah Chen",
    role: "EHS Manager",
    company: "Industrial Gasket Manufacturer"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Trusted by
            <span className="text-gradient"> Industry Leaders</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.author}
              className="p-8 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all"
            >
              <Quote className="h-10 w-10 text-primary/30 mb-4" />
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-border/50 pt-4">
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-primary">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
