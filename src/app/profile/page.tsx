
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  LogOut, 
  CreditCard, Users, ChevronRight, 
  Wallet, BadgeCheck, ShoppingCart, TrendingUp, Copy, User, Sparkles,
  ShieldCheck, Power, Gift, Headphones, MessageCircle
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
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const adminFlag = localStorage.getItem('is_admin') === 'true';
    const userMobile = localStorage.getItem('flexpay_user_mobile') || "User";
    const userId = localStorage.getItem('flexpay_user_id') || "...";
    
    setIsAdmin(adminFlag);
    setMobile(userMobile);
    setUid(userId.slice(0, 8).toUpperCase());

    // Load actual balance from storage
    const loadBalance = () => {
      const savedOrders = localStorage.getItem('flexpay_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const successOrders = orders.filter((o: any) => o.status === 'success');
        const calculatedBalance = successOrders.reduce((acc: number, o: any) => 
          acc + (o.amount * (o.profitPercent || 0) / 100 + (o.bonus || 0)), 0);
        setBalance(calculatedBalance);
      }
    };
    loadBalance();
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
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-10 pb-8 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <User size={32} className="text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-gray-900 tracking-tight">{mobile}</h2>
              <div className="flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-full">
                <BadgeCheck size={10} className="text-primary" />
                <span className="text-[8px] font-black text-primary uppercase">{isAdmin ? "Admin" : "Level 1"}</span>
              </div>
            </div>
            <button 
              onClick={() => handleCopy(uid, "UID")}
              className="flex items-center gap-1.5 mt-1 hover:opacity-70 transition-opacity"
            >
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: {uid}</span>
              <Copy size={10} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="px-5 -mt-6">
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <Wallet size={24} />
            </div>
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Wallet Balance</span>
              <p className="text-2xl font-black text-gray-900">₹{balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-5 mt-6 flex flex-col gap-4 pb-32">
        <div className="bg-white rounded-[1.8rem] border border-gray-100 overflow-hidden shadow-sm">
          
          <Link href="/profile/newbie-reward">
            <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500"><Gift size={18}/></div>
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Newbie Reward</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">CLAIM NOW</span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </button>
          </Link>

          {isAdmin && (
            <Link href="/admin">
              <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 active:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white"><ShieldCheck size={18}/></div>
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Admin Terminal</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            </Link>
          )}

          <Link href="/profile/link-account">
            <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><CreditCard size={18}/></div>
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Linked Terminal</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          <Link href="/profile/team">
            <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Users size={18}/></div>
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">My Team Network</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          <Link href="/profile/history">
            <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><ShoppingCart size={18}/></div>
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Order History</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          <Link href="/profile/sell">
            <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-500"><TrendingUp size={18}/></div>
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">Sell Center</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          <Link href="/profile/support">
            <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500"><Headphones size={18}/></div>
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">24/7 Support</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full px-5 py-5 flex items-center justify-center gap-3 bg-red-50 text-red-500 active:bg-red-100 transition-colors"
          >
            <Power size={18} />
            <span className="text-[12px] font-black uppercase tracking-widest">Logout Account</span>
          </button>
        </div>

        <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em]">FlexPay v2.5.0 Secure Build</p>
      </div>

      <BottomNav />
    </div>
  );
}
