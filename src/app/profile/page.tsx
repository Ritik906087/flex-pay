
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
import { MOCK_USERS } from "@/lib/mock-admin-data";

export default function Profile() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const mobileNumber = "9876543210";
  const uid = "FLEX123456";

  useEffect(() => {
    loadUser();
    window.addEventListener('flexpay_users_update', loadUser);
    return () => window.removeEventListener('flexpay_users_update', loadUser);
  }, []);

  const loadUser = () => {
    const users = JSON.parse(localStorage.getItem('flexpay_users') || JSON.stringify(MOCK_USERS));
    const found = users.find((u: any) => u.uid === uid);
    setUser(found);
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
          <div>
            <button onClick={() => handleCopy(mobileNumber, "Phone")} className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-gray-900">{mobileNumber}</h2>
              <Copy size={10} className="text-gray-300" />
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[8px] font-bold text-gray-400">UID: {uid}</span>
              <div className="flex items-center gap-0.5">
                <BadgeCheck size={9} className="text-primary" />
                <span className="text-[8px] font-black text-primary uppercase">VIP 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4">
        <div className="bg-white rounded-[1rem] border border-gray-100 p-4 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-[7px] font-black text-gray-400 uppercase block mb-0.5">Main Assets</span>
            <p className="text-lg font-black text-gray-900">₹{user?.balance?.toLocaleString() || "0"}</p>
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
          <Link href="/admin">
            <button className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50 active:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white"><ShieldCheck size={16}/></div>
                <span className="text-[10px] font-black text-gray-700 uppercase">Admin Terminal</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          </Link>

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
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
