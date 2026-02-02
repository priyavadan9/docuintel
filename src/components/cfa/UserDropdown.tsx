import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export function UserDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg transition-colors py-1 pr-2">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 shadow-lg border border-slate-200">
        <div className="px-3 py-2 border-b border-slate-100">
          <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
        
        <DropdownMenuItem 
          onClick={() => navigate("/profile")}
          className="cursor-pointer py-2.5"
        >
          <User className="w-4 h-4 mr-2 text-slate-500" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer py-2.5">
          <Settings className="w-4 h-4 mr-2 text-slate-500" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
