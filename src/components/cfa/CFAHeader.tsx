import { useState, useEffect, useRef } from "react";
import { useCFA } from "@/contexts/CFAContext";
import { Search, Bell, User, Clock, AlertTriangle, FileText, FlaskConical, Building2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CFAHeader() {
  const { 
    stats, 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    searchOpen, 
    setSearchOpen,
    setCurrentView,
    setSelectedChemical,
    chemicalRecords,
    setInvestigationDrawerOpen,
    setDashboardFilter
  } = useCFA();
  
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Calculate days until Oct 13, 2026
  const deadline = new Date("2026-10-13");
  const today = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchOpen]);

  const handleResultClick = (result: typeof searchResults[0]) => {
    setSearchOpen(false);
    setSearchQuery("");
    
    switch (result.type) {
      case "chemical":
        const chemical = chemicalRecords.find(c => c.id === result.id);
        if (chemical) {
          setSelectedChemical(chemical);
          setInvestigationDrawerOpen(true);
          setCurrentView("detective");
        }
        break;
      case "document":
        setCurrentView("archaeologist");
        break;
      case "supplier":
        // Navigate to detective with supplier filter
        setCurrentView("detective");
        break;
    }
  };

  const handleGapsClick = () => {
    setDashboardFilter({ type: "gaps" });
    setCurrentView("detective");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "chemical": return <FlaskConical className="w-4 h-4 text-rose-500" />;
      case "document": return <FileText className="w-4 h-4 text-blue-500" />;
      case "supplier": return <Building2 className="w-4 h-4 text-emerald-500" />;
      default: return null;
    }
  };

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
      <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search CAS #, Product, or Supplier..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => searchQuery && setSearchOpen(true)}
            className="pl-10 pr-8 bg-slate-50 border-slate-200 focus:bg-white"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2 text-xs text-slate-500 border-b bg-slate-50">
              {searchResults.length} results found
            </div>
            <div className="max-h-80 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors border-b border-slate-100 last:border-0"
                >
                  {getResultIcon(result.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                    <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                  </div>
                  {result.score !== undefined && (
                    <Badge className={cn(
                      "shrink-0",
                      result.score >= 80 ? "bg-rose-100 text-rose-700" :
                      result.score >= 50 ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    )}>
                      {result.score}/100
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {searchOpen && searchQuery && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-4 text-center text-slate-500 text-sm">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>

      {/* Right: Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Stats Alert */}
        {stats.dataGaps > 0 && (
          <button 
            onClick={handleGapsClick}
            className="flex items-center gap-2 text-sm hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-slate-600">
              <span className="font-medium text-amber-600">{stats.dataGaps}</span> gaps need attention
            </span>
          </button>
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
