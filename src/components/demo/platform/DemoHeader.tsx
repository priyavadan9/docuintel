import { Bell, Search, X, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DemoHeaderProps {
  onClose: () => void;
}

export function DemoHeader({ onClose }: DemoHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents, invoices, contracts..."
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium">Notifications</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <Badge variant="destructive" className="text-xs">Duplicate</Badge>
                <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
              </div>
              <p className="text-sm">Duplicate detected: INV-2024-001_copy.pdf</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">Exception</Badge>
                <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
              </div>
              <p className="text-sm">Low confidence: Privacy_Policy_2024.pdf</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">Processed</Badge>
                <span className="text-xs text-muted-foreground ml-auto">30m ago</span>
              </div>
              <p className="text-sm">5 invoices processed from email inbox</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Exit Demo */}
        <Button variant="ghost" size="sm" onClick={onClose} className="gap-2 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          Exit Demo
        </Button>
      </div>
    </header>
  );
}
