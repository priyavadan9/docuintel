import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Brain, 
  FileSearch, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Play,
  X,
  FileText,
  Sparkles
} from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const demoSteps = [
  {
    id: 1,
    title: "Upload Your Documents",
    description: "Drag and drop files or connect cloud storage like Google Drive, OneDrive, SharePoint, or Dropbox for automatic syncing.",
    icon: Upload,
  },
  {
    id: 2,
    title: "AI Classification",
    description: "Our AI automatically identifies document types - invoices, contracts, forms, policies, and more with 99%+ accuracy.",
    icon: Brain,
  },
  {
    id: 3,
    title: "Smart Data Extraction",
    description: "Extract structured data fields like dates, amounts, parties, and clauses. Validated against your business rules.",
    icon: FileSearch,
  },
  {
    id: 4,
    title: "Chat With Documents",
    description: "Ask questions in natural language. Get instant answers, summaries, and comparisons across your document library.",
    icon: MessageSquare,
  },
];

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setIsPlaying(true);
    }
  }, [open]);

  useEffect(() => {
    if (!isPlaying || !open) return;
    
    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, open]);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = demoSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-1.5 rounded-lg">
              <Play className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Interactive Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {demoSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentStep 
                      ? "w-8 bg-gradient-primary" 
                      : i < currentStep 
                        ? "w-2 bg-primary/50" 
                        : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 min-h-[500px]">
          {/* Left: Animation/Visual */}
          <div className="bg-gradient-dark p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <DemoAnimation step={currentStep} />
          </div>

          {/* Right: Description */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Step {step.id} of {demoSteps.length}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {step.description}
              </p>

              {/* Features for current step */}
              <div className="mt-8 space-y-3">
                {getStepFeatures(currentStep).map((feature, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep === demoSteps.length - 1 ? (
                <Button variant="hero" onClick={() => onOpenChange(false)} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Start Free Trial
                </Button>
              ) : (
                <Button variant="default" onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStepFeatures(step: number): string[] {
  const features = [
    ["Drag & drop uploads", "Cloud storage sync", "Email inbox integration", "Bulk import support"],
    ["Automatic document typing", "99.2% classification accuracy", "Custom category training", "Multi-language support"],
    ["Field-level extraction", "Table recognition", "Handwriting OCR", "Business rule validation"],
    ["Natural language queries", "Document summarization", "Cross-document comparison", "Citation with sources"],
  ];
  return features[step] || [];
}

function DemoAnimation({ step }: { step: number }) {
  return (
    <div className="relative z-10 w-full max-w-sm">
      {step === 0 && <UploadAnimation />}
      {step === 1 && <ClassificationAnimation />}
      {step === 2 && <ExtractionAnimation />}
      {step === 3 && <ChatAnimation />}
    </div>
  );
}

function UploadAnimation() {
  const [files, setFiles] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    [0, 1, 2].forEach((i) => {
      timers.push(setTimeout(() => setFiles(prev => [...prev, i]), i * 600));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="glass rounded-2xl p-6 w-full">
      <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center mb-4">
        <Upload className="h-10 w-10 text-primary mx-auto mb-3 animate-bounce" />
        <p className="text-sm text-muted-foreground">Drop files here</p>
      </div>
      <div className="space-y-2">
        {files.map((i) => (
          <div 
            key={i} 
            className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg animate-slide-up"
          >
            <FileText className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Document_{i + 1}.pdf</p>
              <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full animate-pulse" style={{ width: "100%" }} />
              </div>
            </div>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassificationAnimation() {
  const [classified, setClassified] = useState<number[]>([]);

  const docs = [
    { name: "INV-2024-001.pdf", type: "Invoice", confidence: 98 },
    { name: "Contract_Acme.pdf", type: "Contract", confidence: 96 },
    { name: "Policy_Update.pdf", type: "Policy", confidence: 94 },
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    docs.forEach((_, i) => {
      timers.push(setTimeout(() => setClassified(prev => [...prev, i]), i * 800));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="glass rounded-2xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <span className="font-medium">AI Classification</span>
      </div>
      <div className="space-y-3">
        {docs.map((doc, i) => (
          <div 
            key={i}
            className={`p-4 rounded-xl border transition-all duration-500 ${
              classified.includes(i) 
                ? "bg-gradient-card border-primary/30" 
                : "bg-secondary/30 border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium truncate">{doc.name}</span>
              {classified.includes(i) && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary animate-fade-in">
                  {doc.type}
                </span>
              )}
            </div>
            {classified.includes(i) && (
              <div className="flex items-center gap-2 animate-fade-in">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                    style={{ width: `${doc.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{doc.confidence}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtractionAnimation() {
  const [fields, setFields] = useState<number[]>([]);

  const extractedFields = [
    { label: "Invoice Number", value: "INV-2024-001" },
    { label: "Date", value: "Jan 15, 2024" },
    { label: "Amount", value: "$12,450.00" },
    { label: "Vendor", value: "Acme Corporation" },
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    extractedFields.forEach((_, i) => {
      timers.push(setTimeout(() => setFields(prev => [...prev, i]), i * 500));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="glass rounded-2xl p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <FileSearch className="h-5 w-5 text-primary" />
        <span className="font-medium">Extracted Data</span>
      </div>
      <div className="space-y-3">
        {extractedFields.map((field, i) => (
          <div 
            key={i}
            className={`transition-all duration-300 ${
              fields.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">{field.label}</span>
              <span className="font-medium">{field.value}</span>
            </div>
          </div>
        ))}
      </div>
      {fields.length === extractedFields.length && (
        <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-5 w-5 text-success" />
          <span className="text-sm text-success">All fields validated</span>
        </div>
      )}
    </div>
  );
}

function ChatAnimation() {
  const [messages, setMessages] = useState<number[]>([]);

  const chatMessages = [
    { role: "user", content: "What's the total invoice amount?" },
    { role: "assistant", content: "The total amount for INV-2024-001 is $12,450.00, due on Feb 15, 2024." },
    { role: "user", content: "Compare with last month" },
    { role: "assistant", content: "This is 15% higher than January's invoice of $10,826.00." },
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    chatMessages.forEach((_, i) => {
      timers.push(setTimeout(() => setMessages(prev => [...prev, i]), i * 1000));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="glass rounded-2xl p-4 w-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <MessageSquare className="h-5 w-5 text-primary" />
        <span className="font-medium">Document Chat</span>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {chatMessages.map((msg, i) => (
          messages.includes(i) && (
            <div 
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "bg-secondary rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
