
"use client"

import { 
  LayoutDashboard, Users, CheckCircle2, History, Settings, LogOut, ShieldCheck, ChevronLeft, Menu 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingCount?: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ activeTab, onTabChange, pendingCount = 0, isOpen, onToggle }: AdminSidebarProps) {
  const router = useRouter();

  const navItems = [
    { id: "dashboard", label: "System Overview", icon: LayoutDashboard },
    { id: "users", label: "User Directory", icon: Users },
    { id: "approvals", label: "Review Queue", icon: CheckCircle2, badge: pendingCount },
    { id: "history", label: "Trade Logs", icon: History },
    { id: "settings", label: "Configurations", icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    if (window.location.pathname !== '/admin') {
      router.push(`/admin?tab=${id}`);
    } else {
      onTabChange(id);
    }
  };

  return (
    <aside className={cn(
      "bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50 transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
    )}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-[13px] font-black text-slate-900 tracking-tight uppercase">Terminal</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} className="text-slate-400 hover:text-slate-900">
            <ChevronLeft size={20} />
          </Button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn(
                  "transition-colors",
                  activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-primary"
                )} />
                <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
              </div>
              {item.badge ? (
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black",
                  activeTab === item.id ? "bg-white text-primary" : "bg-red-500 text-white"
                )}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-100">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl h-12" 
          onClick={() => router.push('/')}
        >
          <LogOut size={18} />
          <span className="text-[11px] font-black uppercase tracking-wider">Exit Terminal</span>
        </Button>
      </div>
    </aside>
  );
}
