"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  Headphones, LogOut, 
  CreditCard, Users, ChevronRight, 
  Camera, Wallet, BadgeCheck, ShoppingCart, TrendingUp, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
      const extra = successOrders.reduce((acc: number, o: any) => acc + (o.amount * o.profitPercent / 100 + o.bonus), 0);
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

  const avatarUrl = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl || "https://picsum.photos/seed/useravatar/200/200";

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-50 p-0.5 shadow-sm">
              <Image 
                src={avatarUrl} 
                alt="Avatar" 
                width={56} 
                height={56}
                className="rounded-[0.7rem] object-cover"
              />
            </div>
            <button className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100 text-primary shadow-lg active:scale-95 transition-transform">
              <Camera size={10} />
            </button>
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

      {/* Main Sections - Single Unified Group */}
      <div className="px-5 mt-5 flex flex-col gap-4 pb-32">
        <div className="bg-white rounded-[1rem] border border-gray-100 overflow-hidden shadow-sm">
          <Link href="/profile/history">
            <button className="w-full px-4 py-3 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <ShoppingCart size={14} />
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight">Buy History</span>
              </div>
              <ChevronRight size={12} className="text-gray-300" />
            </button>
          </Link>
          
          <button className="w-full px-4 py-3 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                <TrendingUp size={14} />
              </div>
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight">Sell History</span>
            </div>
            <ChevronRight size={12} className="text-gray-300" />
          </button>

          <Link href="/profile/link-account">
            <button className="w-full px-4 py-3 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                  <CreditCard size={14} />
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight">Linked Account</span>
              </div>
              <ChevronRight size={12} className="text-gray-300" />
            </button>
          </Link>

          {[
            { icon: Users, label: "My Team", color: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: Headphones, label: "Support", color: "text-gray-400", bg: "bg-gray-50" },
            { icon: LogOut, label: "Logout", color: "text-red-400", bg: "bg-red-50/50" },
          ].map((item, i, arr) => (
            <button 
              key={i} 
              className={cn(
                "w-full px-4 py-3 flex items-center justify-between transition-all active:bg-gray-50",
                i !== arr.length - 1 && "border-b border-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", item.bg, item.color)}>
                  <item.icon size={14} />
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight">{item.label}</span>
              </div>
              <ChevronRight size={12} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
