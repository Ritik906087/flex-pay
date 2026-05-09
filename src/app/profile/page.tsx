
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  LogOut, 
  CreditCard, Users, ChevronRight, 
  Wallet, BadgeCheck, ShoppingCart, TrendingUp, Copy, User, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function Profile() {
  const { toast } = useToast();
  const [balance, setBalance] = useState(12500);
  const mobileNumber = "9876543210";
  const uid = "FLEX123456";

  useEffect(() => {
    const saved = localStorage.getItem('flexpay_orders');
    if (saved) {
      const orders = JSON.parse(saved);
      const successOrders = orders.filter((o: any) => o.status === 'success');
      const extra = successOrders.reduce((acc: number, o: any) => acc + (o.amount * (o.profitPercent || 0) / 100 + (o.bonus || 0)), 0);
      setBalance(12500 + extra);
    }
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border-2 border-gray-100 p-0.5 shadow-sm">
              <User size={28} className="text-gray-300" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <button 
              onClick={() => handleCopy(mobileNumber, "Username")}
              className="flex items-center gap-1.5 group active:opacity-70 transition-opacity"
            >
              <h2 className="text-sm font-black text-gray-900">{mobileNumber}</h2>
              <Copy size={10} className="text-gray-300" />
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <button 
                onClick={() => handleCopy(uid, "UID")}
                className="flex items-center gap-1 text-[8px] font-bold text-gray-400 active:text-primary transition-colors"
              >
                <span>UID: {uid}</span>
                <Copy size={8} />
              </button>
              <span className="w-0.5 h-0.5 bg-gray-200 rounded-full"></span>
              <div className="flex items-center gap-0.5">
                <BadgeCheck size={9} className="text-primary" />
                <span className="text-[8px] font-black text-primary uppercase tracking-tighter">VIP 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Brief */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-[1rem] border border-gray-100 p-3.5 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Total Assets</span>
            <p className="text-lg font-black text-gray-900">₹{balance.toLocaleString()}</p>
          </div>
          <Button variant="secondary" className="rounded-xl h-8 px-3 font-bold text-[9px] bg-gray-50 border-0 hover:bg-gray-100">
            <Wallet size={12} className="mr-1.5" />
            WALLET
          </Button>
        </div>
      </div>

      {/* Main Sections */}
      <div className="px-5 mt-5 flex flex-col gap-4 pb-32">
        <div className="bg-white rounded-[1rem] border border-gray-100 overflow-hidden shadow-sm">
          <Link href="/profile/history">
            <button className="w-full px-4 py-3.5 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-6.5 h-6.5 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <ShoppingCart size={15} />
                </div>
                <span className="text-[9.5px] font-black text-gray-700 uppercase tracking-tight">Buy History</span>
              </div>
              <ChevronRight size={13} className="text-gray-300" />
            </button>
          </Link>
          
          <button className="w-full px-4 py-3.5 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-6.5 h-6.5 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                <TrendingUp size={15} />
              </div>
              <span className="text-[9.5px] font-black text-gray-700 uppercase tracking-tight">Sell History</span>
            </div>
            <ChevronRight size={13} className="text-gray-300" />
          </button>

          <Link href="/profile/newbie-reward">
            <button className="w-full px-4 py-3.5 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50 group">
              <div className="flex items-center gap-3">
                <div className="w-6.5 h-6.5 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <Sparkles size={15} />
                </div>
                <span className="text-[9.5px] font-black text-gray-700 uppercase tracking-tight">Newbie Reward</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">CLAIM NOW</span>
                <ChevronRight size={13} className="text-gray-300" />
              </div>
            </button>
          </Link>

          <Link href="/profile/link-account">
            <button className="w-full px-4 py-3.5 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-6.5 h-6.5 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                  <CreditCard size={15} />
                </div>
                <span className="text-[9.5px] font-black text-gray-700 uppercase tracking-tight">Linked Account</span>
              </div>
              <ChevronRight size={13} className="text-gray-300" />
            </button>
          </Link>

          <Link href="/profile/team">
            <button className="w-full px-4 py-3.5 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-6.5 h-6.5 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Users size={15} />
                </div>
                <span className="text-[9.5px] font-black text-gray-700 uppercase tracking-tight">My Team</span>
              </div>
              <ChevronRight size={13} className="text-gray-300" />
            </button>
          </Link>

          <button className="w-full px-4 py-3.5 flex items-center justify-between transition-all active:bg-red-50">
            <div className="flex items-center gap-3">
              <div className="w-6.5 h-6.5 rounded-lg bg-red-50 flex items-center justify-center text-red-400">
                <LogOut size={15} />
              </div>
              <span className="text-[9.5px] font-black text-red-500 uppercase tracking-tight">Logout</span>
            </div>
            <ChevronRight size={13} className="text-gray-300" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
