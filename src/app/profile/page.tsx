
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  Settings, Headphones, LogOut, ShieldCheck, 
  CreditCard, Gift, Users, ChevronRight, 
  Camera, Wallet, BadgeCheck, ShoppingCart, TrendingUp, Copy, History
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
      <div className="bg-white px-6 pt-12 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-50 p-0.5 shadow-sm">
              <Image 
                src={avatarUrl} 
                alt="Avatar" 
                width={80} 
                height={80}
                className="rounded-[0.9rem] object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center border border-gray-100 text-primary shadow-lg active:scale-95 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <button 
              onClick={() => handleCopy(mobileNumber, "Username")}
              className="flex items-center gap-2 group active:opacity-70 transition-opacity"
            >
              <h2 className="text-lg font-black text-gray-900">{mobileNumber}</h2>
              <Copy size={14} className="text-gray-300" />
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <button 
                onClick={() => handleCopy(uid, "UID")}
                className="flex items-center gap-1 text-[10px] font-bold text-gray-400 active:text-primary transition-colors"
              >
                <span>UID: {uid}</span>
                <Copy size={10} />
              </button>
              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
              <div className="flex items-center gap-0.5">
                <BadgeCheck size={12} className="text-primary" />
                <span className="text-[10px] font-bold text-primary">VIP 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Brief */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Balance</span>
            <p className="text-2xl font-black text-gray-900">₹{balance.toLocaleString()}</p>
          </div>
          <Button variant="secondary" className="rounded-xl h-10 px-4 font-bold text-xs bg-gray-50 border-0 hover:bg-gray-100">
            <Wallet size={16} className="mr-2" />
            WALLET
          </Button>
        </div>
      </div>

      {/* Main Sections */}
      <div className="px-6 mt-8 flex flex-col gap-6 pb-32">
        {/* Account Group */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <Link href="/orders?tab=history">
            <button className="w-full px-5 py-4 flex items-center justify-between transition-all active:bg-gray-50 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                  <ShoppingCart size={18} />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Buy History</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          </Link>
          {[
            { icon: TrendingUp, label: "Sell History", color: "text-green-500", bg: "bg-green-50" },
            { icon: CreditCard, label: "Linked Bank", color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Gift, label: "Rewards Wallet", color: "text-purple-500", bg: "bg-purple-50" },
            { icon: Users, label: "My Team", color: "text-indigo-500", bg: "bg-indigo-50" },
          ].map((item, i) => (
            <button 
              key={i} 
              className={cn(
                "w-full px-5 py-4 flex items-center justify-between transition-all active:bg-gray-50",
                i !== 3 && "border-b border-gray-50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.bg, item.color)}>
                  <item.icon size={18} />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Support Group */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {[
            { icon: Settings, label: "Settings", color: "text-gray-400" },
            { icon: ShieldCheck, label: "Security", color: "text-gray-400" },
            { icon: Headphones, label: "Support", color: "text-gray-400" },
            { icon: LogOut, label: "Logout", color: "text-red-400" },
          ].map((item, i) => (
            <button 
              key={i} 
              className={cn(
                "w-full px-5 py-4 flex items-center justify-between transition-all active:bg-gray-50",
                i !== 3 && "border-b border-gray-50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center", item.color)}>
                  <item.icon size={18} />
                </div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
