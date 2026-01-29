import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "user" | "auditor";

export interface Document {
  id: string;
  name: string;
  type: "invoice" | "contract" | "policy" | "form" | "manual" | "statement";
  status: "pending" | "processing" | "processed" | "exception" | "duplicate";
  confidence: number;
  uploadedAt: Date;
  processedAt?: Date;
  size: number;
  source: "upload" | "email" | "drive" | "onedrive" | "sharepoint" | "dropbox";
  extractedData?: Record<string, string>;
  thumbnail?: string;
}

export interface DemoState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  documents: Document[];
  addDocument: (doc: Omit<Document, "id">) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  stats: {
    received: number;
    processing: number;
    processed: number;
    exceptions: number;
    duplicates: number;
  };
  activeView: string;
  setActiveView: (view: string) => void;
}

const DemoContext = createContext<DemoState | null>(null);

// Sample documents for demo
const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "INV-2024-001.pdf",
    type: "invoice",
    status: "processed",
    confidence: 98.5,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
    processedAt: new Date(Date.now() - 1000 * 60 * 25),
    size: 245000,
    source: "email",
    extractedData: {
      "Vendor": "Acme Corporation",
      "Invoice Number": "INV-2024-001",
      "Invoice Date": "2024-01-15",
      "Due Date": "2024-02-15",
      "Total Amount": "$12,450.00",
      "Tax": "$1,450.00",
      "Currency": "USD",
    },
  },
  {
    id: "2",
    name: "Service_Agreement_TechCorp.pdf",
    type: "contract",
    status: "processed",
    confidence: 96.2,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    processedAt: new Date(Date.now() - 1000 * 60 * 60),
    size: 1250000,
    source: "drive",
    extractedData: {
      "Parties": "TechCorp Inc. & DocuSense AI",
      "Effective Date": "2024-01-01",
      "Expiry Date": "2024-12-31",
      "Contract Value": "$150,000",
      "Renewal Clause": "Auto-renew for 12 months",
    },
  },
  {
    id: "3",
    name: "Employee_Onboarding_Form.pdf",
    type: "form",
    status: "processing",
    confidence: 0,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 5),
    size: 89000,
    source: "upload",
  },
  {
    id: "4",
    name: "INV-2024-001_copy.pdf",
    type: "invoice",
    status: "duplicate",
    confidence: 99.1,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 15),
    processedAt: new Date(Date.now() - 1000 * 60 * 10),
    size: 245000,
    source: "sharepoint",
  },
  {
    id: "5",
    name: "Privacy_Policy_2024.pdf",
    type: "policy",
    status: "exception",
    confidence: 72.3,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 45),
    size: 520000,
    source: "onedrive",
  },
  {
    id: "6",
    name: "Q4_Financial_Statement.pdf",
    type: "statement",
    status: "processed",
    confidence: 94.8,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    size: 890000,
    source: "dropbox",
    extractedData: {
      "Period": "Q4 2024",
      "Revenue": "$2,450,000",
      "Net Income": "$340,000",
      "Total Assets": "$5,200,000",
    },
  },
  {
    id: "7",
    name: "Product_Manual_v2.1.pdf",
    type: "manual",
    status: "processed",
    confidence: 91.5,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    processedAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
    size: 4500000,
    source: "upload",
  },
  {
    id: "8",
    name: "Vendor_Invoice_Feb.pdf",
    type: "invoice",
    status: "pending",
    confidence: 0,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 2),
    size: 180000,
    source: "email",
  },
];

export function DemoProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [activeView, setActiveView] = useState("dashboard");

  const addDocument = (doc: Omit<Document, "id">) => {
    const newDoc = { ...doc, id: Date.now().toString() };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const stats = {
    received: documents.length,
    processing: documents.filter((d) => d.status === "processing" || d.status === "pending").length,
    processed: documents.filter((d) => d.status === "processed").length,
    exceptions: documents.filter((d) => d.status === "exception").length,
    duplicates: documents.filter((d) => d.status === "duplicate").length,
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        documents,
        addDocument,
        updateDocument,
        stats,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return context;
}
