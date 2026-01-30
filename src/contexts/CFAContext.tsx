import React, { createContext, useContext, useState, ReactNode } from "react";

export type CFAView = "dashboard" | "archaeologist" | "detective" | "orchestrator";
export type RiskLevel = "high" | "medium" | "low";
export type ProcessingStatus = "uploading" | "ocr" | "extracting" | "complete" | "error";

export interface ChemicalRecord {
  id: string;
  productName: string;
  casNumber: string;
  yearDetected: number;
  sourceDocument: string;
  riskScore: number;
  status: "verified" | "evidence-gap" | "pending-review";
  supplier: string;
  concentration?: string;
  notes?: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: ProcessingStatus;
  progress: number;
  extractedData?: {
    date: string;
    supplier: string;
    chemical: string;
    casNumber?: string;
  };
}

export interface RFITask {
  id: string;
  chemicalId: string;
  productName: string;
  casNumber: string;
  supplier: string;
  status: "pending" | "drafted" | "sent" | "responded";
  createdAt: Date;
  sentAt?: Date;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
  type: "upload" | "extraction" | "rfi" | "verification" | "system";
}

interface CFAContextType {
  currentView: CFAView;
  setCurrentView: (view: CFAView) => void;
  
  // Stats
  stats: {
    documentsIngested: number;
    pfasCandidates: number;
    dataGaps: number;
    rfisSent: number;
  };
  
  // Chemical records
  chemicalRecords: ChemicalRecord[];
  setChemicalRecords: React.Dispatch<React.SetStateAction<ChemicalRecord[]>>;
  
  // Uploaded files
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  selectedFile: UploadedFile | null;
  setSelectedFile: (file: UploadedFile | null) => void;
  
  // RFI Tasks
  rfiTasks: RFITask[];
  setRfiTasks: React.Dispatch<React.SetStateAction<RFITask[]>>;
  
  // Audit Log
  auditLog: AuditLogEntry[];
  addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
  
  // Investigation
  selectedChemical: ChemicalRecord | null;
  setSelectedChemical: (chemical: ChemicalRecord | null) => void;
  investigationDrawerOpen: boolean;
  setInvestigationDrawerOpen: (open: boolean) => void;
  
  // RFI Modal
  rfiModalOpen: boolean;
  setRfiModalOpen: (open: boolean) => void;
  currentRfiTask: RFITask | null;
  setCurrentRfiTask: (task: RFITask | null) => void;
}

const CFAContext = createContext<CFAContextType | undefined>(undefined);

// Mock data
const mockChemicalRecords: ChemicalRecord[] = [
  {
    id: "1",
    productName: "Teflon Coating Additive",
    casNumber: "335-67-1",
    yearDetected: 2014,
    sourceDocument: "2014_Warehouse_Invoice.pdf",
    riskScore: 98,
    status: "evidence-gap",
    supplier: "ChemCorp",
    notes: "SDS missing concentration percentage"
  },
  {
    id: "2",
    productName: "PFOS Surface Treatment",
    casNumber: "1763-23-1",
    yearDetected: 2012,
    sourceDocument: "Purchase_Order_2012.pdf",
    riskScore: 95,
    status: "verified",
    supplier: "Midwest Chem Supply",
    concentration: "12.5%"
  },
  {
    id: "3",
    productName: "GenX Processing Agent",
    casNumber: "62037-80-3",
    yearDetected: 2018,
    sourceDocument: "Supplier_SDS_2018.pdf",
    riskScore: 87,
    status: "pending-review",
    supplier: "DuPont Legacy"
  },
  {
    id: "4",
    productName: "Scotchgard Protector",
    casNumber: "307-55-1",
    yearDetected: 2011,
    sourceDocument: "Inventory_Report_Q2_2011.xlsx",
    riskScore: 72,
    status: "evidence-gap",
    supplier: "3M Industrial",
    notes: "Missing disposal records"
  },
  {
    id: "5",
    productName: "PFOA Surfactant Blend",
    casNumber: "335-67-1",
    yearDetected: 2015,
    sourceDocument: "Lab_Analysis_2015.pdf",
    riskScore: 91,
    status: "verified",
    supplier: "Apex Chemical",
    concentration: "8.2%"
  },
  {
    id: "6",
    productName: "Fluoropolymer Coating",
    casNumber: "9002-84-0",
    yearDetected: 2019,
    sourceDocument: "Material_Safety_Sheet.pdf",
    riskScore: 45,
    status: "verified",
    supplier: "Industrial Solutions Inc",
    concentration: "2.1%"
  },
  {
    id: "7",
    productName: "Anti-Stick Compound",
    casNumber: "376-06-7",
    yearDetected: 2013,
    sourceDocument: "Batch_Record_2013.pdf",
    riskScore: 82,
    status: "evidence-gap",
    supplier: "ChemCorp",
    notes: "Supplier contact information outdated"
  }
];

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "a1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    action: "Document Processed",
    user: "System",
    details: "SDS_2014_Batch.pdf successfully processed via OCR",
    type: "extraction"
  },
  {
    id: "a2",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    action: "PFAS Candidate Identified",
    user: "AI Agent",
    details: "CAS 335-67-1 (PFOA) detected in warehouse invoice",
    type: "system"
  },
  {
    id: "a3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    action: "RFI Drafted",
    user: "John Smith",
    details: "Drafted supplier inquiry for Apex Chemical",
    type: "rfi"
  },
  {
    id: "a4",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    action: "Bulk Upload Complete",
    user: "Sarah Johnson",
    details: "142 documents uploaded from legacy archive",
    type: "upload"
  },
  {
    id: "a5",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    action: "Evidence Verified",
    user: "Mike Chen",
    details: "Concentration data confirmed for PFOS Surface Treatment",
    type: "verification"
  }
];

export function CFAProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<CFAView>("dashboard");
  const [chemicalRecords, setChemicalRecords] = useState<ChemicalRecord[]>(mockChemicalRecords);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [rfiTasks, setRfiTasks] = useState<RFITask[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog);
  const [selectedChemical, setSelectedChemical] = useState<ChemicalRecord | null>(null);
  const [investigationDrawerOpen, setInvestigationDrawerOpen] = useState(false);
  const [rfiModalOpen, setRfiModalOpen] = useState(false);
  const [currentRfiTask, setCurrentRfiTask] = useState<RFITask | null>(null);

  const stats = {
    documentsIngested: 14203,
    pfasCandidates: chemicalRecords.filter(r => r.riskScore >= 70).length + 120,
    dataGaps: chemicalRecords.filter(r => r.status === "evidence-gap").length + 42,
    rfisSent: rfiTasks.filter(t => t.status === "sent").length + 12
  };

  const addAuditEntry = (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `a${Date.now()}`,
      timestamp: new Date()
    };
    setAuditLog(prev => [newEntry, ...prev]);
  };

  return (
    <CFAContext.Provider
      value={{
        currentView,
        setCurrentView,
        stats,
        chemicalRecords,
        setChemicalRecords,
        uploadedFiles,
        setUploadedFiles,
        selectedFile,
        setSelectedFile,
        rfiTasks,
        setRfiTasks,
        auditLog,
        addAuditEntry,
        selectedChemical,
        setSelectedChemical,
        investigationDrawerOpen,
        setInvestigationDrawerOpen,
        rfiModalOpen,
        setRfiModalOpen,
        currentRfiTask,
        setCurrentRfiTask
      }}
    >
      {children}
    </CFAContext.Provider>
  );
}

export function useCFA() {
  const context = useContext(CFAContext);
  if (context === undefined) {
    throw new Error("useCFA must be used within a CFAProvider");
  }
  return context;
}
