
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  LogOut, 
  CreditCard, Users, ChevronRight, 
  Wallet, BadgeCheck, ShoppingCart, TrendingUp, Copy, User, 
  ShieldCheck, Power, Gift, Headphones
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
      {/* Compact Profile Header */}
      <div className="bg-white px-5 pt-6 pb-6 border-b border-gray-100 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
            <User size={28} className="text-gray-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-black text-gray-900 tracking-tight">{mobile}</h2>
              <div className="flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-full">
                <BadgeCheck size={9} className="text-primary" />
                <span className="text-[7px] font-black text-primary uppercase">{isAdmin ? "Admin" : "Node L1"}</span>
              </div>
            </div>
            <button 
              onClick={() => handleCopy(uid, "UID")}
              className="flex items-center gap-1 mt-0.5 opacity-60 active:opacity-100 transition-opacity"
            >
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">ID: {uid}</span>
              <Copy size={9} className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Wallet Card */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-[1.5rem] border border-gray-100 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
              <Wallet size={20} />
            </div>
            <div>
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Net Balance</span>
              <p className="text-xl font-black text-gray-900">₹{balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Reordered Menu */}
      <div className="px-4 mt-4 flex flex-col gap-3 pb-24">
        <div className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm">
          
          {/* 1. Sell Center (Sell History) */}
          <Link href="/profile/sell">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500"><TrendingUp size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">Sell Center</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          {/* 2. Buy History (Order History) */}
          <Link href="/profile/history">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500"><ShoppingCart size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">Buy History</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          {/* 3. Link Account */}
          <Link href="/profile/link-account">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><CreditCard size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">Linked Terminal</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          {/* 4. Newbie Reward */}
          <Link href="/profile/newbie-reward">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500"><Gift size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">Newbie Reward</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">₹200</span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </button>
          </Link>

          {/* 5. Support */}
          <Link href="/profile/support">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><Headphones size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">24/7 Support</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

          {/* Admin Terminal (Optional if logged in as admin) */}
          {isAdmin && (
            <Link href="/admin">
              <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><ShieldCheck size={16}/></div>
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">Admin Control</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            </Link>
          )}

          {/* 6. Logout */}
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-4 flex items-center justify-center gap-2 bg-red-50/50 text-red-500 active:bg-red-100 transition-colors"
          >
            <Power size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest">Logout Session</span>
          </button>
        </div>

        <p className="text-center text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em]">Build v2.5 • FlexPay Secure</p>
      </div>

      <BottomNav />
    </div>
  );
}
