
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  LogOut, 
  CreditCard, Users, ChevronRight, 
  Wallet, BadgeCheck, ShoppingCart, TrendingUp, Copy, User, Sparkles,
  ShieldCheck, Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobile, setMobile] = useState("User");
  const [uid, setUid] = useState("...");

  useEffect(() => {
    const adminFlag = localStorage.getItem('is_admin') === 'true';
    const userMobile = localStorage.getItem('flexpay_user_mobile') || "User";
    const userId = localStorage.getItem('flexpay_user_id') || "...";
    
    setIsAdmin(adminFlag);
    setMobile(userMobile);
    setUid(userId.slice(0, 8).toUpperCase());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    localStorage.removeItem('flexpay_user_id');
    localStorage.removeItem('flexpay_user_mobile');
    toast({ title: "Logged Out", description: "Session ended safely." });
    router.push('/login');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <div className="bg-white px-6 pt-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border-2 border-gray-100">
            <User size={28} className="text-gray-300" />
          </div>
          <div className="flex-1">
            <button onClick={() => handleCopy(mobile, "Phone")} className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-gray-900">{mobile}</h2>
              <Copy size={10} className="text-gray-300" />
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[8px] font-bold text-gray-400">UID: {uid}</span>
              <div className="flex items-center gap-0.5">
                <BadgeCheck size={9} className="text-primary" />
                <span className="text-[8px] font-black text-primary uppercase">{isAdmin ? "Admin" : "VIP 1"}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="px-5 -mt-4">
        <div className="bg-white rounded-[1rem] border border-gray-100 p-4 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-[7px] font-black text-gray-400 uppercase block mb-0.5">Main Assets</span>
            <p className="text-lg font-black text-gray-900">₹0</p>
          </div>
          <Link href="/profile/sell">
            <Button variant="secondary" className="rounded-xl h-9 px-4 font-black text-[9px] bg-primary text-white hover:bg-primary/90">
              <Power size={12} className="mr-1.5" />
              SELL CENTER
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-4 pb-32">
        <div className="bg-white rounded-[1rem] border border-gray-100 overflow-hidden shadow-sm">
          {isAdmin && (
            <Link href="/admin">
              <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white"><ShieldCheck size={16}/></div>
                  <span className="text-[10px] font-black text-gray-700 uppercase">Admin Terminal</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            </Link>
          )}

          <Link href="/profile/history">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><ShoppingCart size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase">Buy Records</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>
          
          <Link href="/profile/sell">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-500"><TrendingUp size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase">Sell Records</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          <Link href="/profile/link-account">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500"><CreditCard size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase">Linked Terminal</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          <Link href="/profile/team">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500"><Users size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase">My Team</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
