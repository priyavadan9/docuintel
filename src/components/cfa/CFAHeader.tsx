import { useCFA } from "@/contexts/CFAContext";
import { Search, Bell, User, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CFAHeader() {
  const { stats } = useCFA();
  
  // Calculate days until Oct 13, 2026
  const deadline = new Date("2026-10-13");
  const today = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      {/* Left: Title and Deadline */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">PFAS Intelligence Platform</h1>
          <p className="text-xs text-slate-500">EPA TSCA Section 8(a)(7) Compliance</p>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          <Clock className="w-4 h-4 text-amber-600" />
          <div className="text-sm">
            <span className="text-slate-600">Submission Deadline: </span>
            <span className="font-semibold text-amber-700">Oct 13, 2026</span>
          </div>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 ml-1">
            {daysRemaining} Days
          </Badge>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search CAS #, Product, or Supplier..."
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Right: Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Stats Alert */}
        {stats.dataGaps > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-slate-600">
              <span className="font-medium text-amber-600">{stats.dataGaps}</span> gaps need attention
            </span>
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
            3
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">John Smith</p>
            <p className="text-xs text-slate-500">Compliance Officer</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-cfa-accent flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
