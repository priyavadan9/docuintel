import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  organization: string;
  timezone: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    digest: boolean;
  };
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: "sync" | "document" | "pfas" | "rfi" | "system";
  icon?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean }>;
  updateProfile: (updates: Partial<User>) => void;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: "user-1",
  email: "john.smith@acmecorp.com",
  fullName: "John Smith",
  role: "Compliance Officer",
  organization: "ACME Corporation",
  timezone: "America/New_York",
  notificationPreferences: {
    email: true,
    push: true,
    digest: false,
  },
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Cloud Storage Connected",
    description: "Google Drive has been successfully connected to your account.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    type: "sync",
  },
  {
    id: "n2",
    title: "Document Processed",
    description: "2014_Warehouse_Invoice.pdf has been indexed with 3 PFAS candidates found.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    type: "document",
  },
  {
    id: "n3",
    title: "PFAS Candidate Identified",
    description: "High-risk PFOA compound detected in supplier invoice from ChemCorp.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: "pfas",
  },
  {
    id: "n4",
    title: "RFI Drafted",
    description: "Request for Information drafted for Apex Chemical regarding Teflon Coating.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    type: "rfi",
  },
  {
    id: "n5",
    title: "Auto-Sync Complete",
    description: "Dropbox sync completed. 12 new documents added to processing queue.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    read: true,
    type: "sync",
  },
  {
    id: "n6",
    title: "System Update",
    description: "PFAS database updated with 45 new CAS numbers from EPA registry.",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    read: true,
    type: "system",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const login = useCallback(async (email: string, password: string, remember: boolean): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Demo validation
    if (!email || !password) {
      return { success: false, error: "Please enter both email and password." };
    }

    if (password.length < 6) {
      return { success: false, error: "Invalid credentials. Please try again." };
    }

    // Success - set user with the entered email
    setUser({
      ...mockUser,
      email: email,
    });
    setIsAuthenticated(true);

    if (remember) {
      // In a real app, would set a persistent cookie/token
      console.log("Remember me enabled");
    }

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const requestPasswordReset = useCallback(async (email: string): Promise<{ success: boolean }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (newPassword: string): Promise<{ success: boolean }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAsUnread = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `n-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        notifications,
        unreadCount,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
