import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What if I don't have digital records from 2011-2022?",
    answer: "We can work with scanned documents, photos of paper files, or even physical documents you ship to us. Our OCR technology handles even poor-quality scans."
  },
  {
    question: "How accurate is the AI?",
    answer: "Our AI achieves 90%+ accuracy on PFAS identification, and every flagged item is reviewed by our chemical experts. We provide a compliance guarantee backed by our track record."
  },
  {
    question: "What if my suppliers don't respond to information requests?",
    answer: "We provide templated outreach, follow-up sequences, and alternative research methods. Our experts can often identify PFAS based on product descriptions, industry standards, and CAS number databases even without direct supplier confirmation."
  },
  {
    question: "Can you handle international documents in other languages?",
    answer: "Yes. We process documents in English, Chinese (Simplified/Traditional), Japanese, German, and other major languages. Our AI is trained on multilingual chemical nomenclature."
  },
  {
    question: "Do you actually submit to the EPA for us?",
    answer: "We provide a complete, submission-ready package and guide you through the EPA's CDX portal. For an additional fee, we can handle the actual portal submission on your behalf."
  },
  {
    question: "What happens after the October 2026 deadline?",
    answer: "We offer optional ongoing compliance monitoring to screen new products and suppliers for PFAS before they enter your supply chain—preventing future compliance issues."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We're SOC 2 Type II certified with end-to-end encryption, role-based access controls, and strict data retention policies. We can also deploy on-premise for enterprises with special security requirements."
  },
  {
    question: "How is this different from hiring a law firm or consultant?",
    answer: "Traditional consultants charge $200-$400/hour and take 6-12 months. We use AI to automate 80% of the work, then layer in expert review. You get better results faster and at 10x lower cost."
  },
  {
    question: "What if the EPA changes the requirements?",
    answer: "We monitor regulatory changes daily and update our platform automatically. Any changes to reporting requirements are reflected in your submission package at no additional cost."
  },
  {
    question: "Can I see a demo first?",
    answer: "Absolutely. Book a 30-minute demo to see the platform in action with sample data from your industry."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative bg-card/30">
      <div className="container px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked
            <span className="text-gradient"> Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="border border-border/50 rounded-xl px-6 bg-card/50 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
