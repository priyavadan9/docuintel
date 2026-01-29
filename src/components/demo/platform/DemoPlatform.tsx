import { DemoProvider } from "@/contexts/DemoContext";
import { DemoSidebar } from "./DemoSidebar";
import { DemoHeader } from "./DemoHeader";
import { DemoContent } from "./DemoContent";

interface DemoPlatformProps {
  onClose: () => void;
}

export function DemoPlatform({ onClose }: DemoPlatformProps) {
  return (
    <DemoProvider>
      <div className="fixed inset-0 z-50 bg-background flex animate-fade-in">
        <DemoSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DemoHeader onClose={onClose} />
          <DemoContent />
        </div>
      </div>
    </DemoProvider>
  );
}
