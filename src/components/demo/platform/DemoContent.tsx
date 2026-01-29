import { useDemo } from "@/contexts/DemoContext";
import { DashboardView } from "./views/DashboardView";
import { UploadView } from "./views/UploadView";
import { DocumentsView } from "./views/DocumentsView";
import { ClassificationView } from "./views/ClassificationView";
import { ExceptionsView } from "./views/ExceptionsView";
import { DuplicatesView } from "./views/DuplicatesView";
import { ChatView } from "./views/ChatView";
import { AnalyticsView } from "./views/AnalyticsView";
import { AuditView } from "./views/AuditView";
import { UsersView } from "./views/UsersView";
import { IntegrationsView } from "./views/IntegrationsView";
import { SettingsView } from "./views/SettingsView";

export function DemoContent() {
  const { activeView } = useDemo();

  const views: Record<string, React.ReactNode> = {
    dashboard: <DashboardView />,
    upload: <UploadView />,
    documents: <DocumentsView />,
    classification: <ClassificationView />,
    exceptions: <ExceptionsView />,
    duplicates: <DuplicatesView />,
    chat: <ChatView />,
    analytics: <AnalyticsView />,
    audit: <AuditView />,
    users: <UsersView />,
    integrations: <IntegrationsView />,
    settings: <SettingsView />,
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      {views[activeView] || <DashboardView />}
    </div>
  );
}
