
"use client"

import { BottomNav } from "@/components/bottom-nav";
import { 
  User, Settings, Headphones, LogOut, ShieldCheck, 
  History, CreditCard, Gift, Users, ChevronRight, 
  Camera, Wallet, BadgeCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function Profile() {
  const mobileNumber = "+91 9876543210";
  const uid = "FX102456";

  const avatarUrl = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl || "https://picsum.photos/seed/default-avatar/200/200";

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Profile Header */}
      <div className="px-6 pt-16 pb-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-primary/20 p-1 shadow-2xl">
            <Image 
              src={avatarUrl} 
              alt="Avatar" 
              width={112} 
              height={112}
              className="rounded-[1.5rem] object-cover"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background text-primary-foreground">
            <Camera size={18} />
          </button>
        </div>
        <h2 className="text-2xl font-black text-white mb-1">{mobileNumber}</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">UID: {uid}</span>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="flex items-center gap-1">
            <BadgeCheck size={12} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase">VIP 1 MEMBER</span>
          </div>
        </div>
      </div>

      {/* Balance Grid */}
      <div className="px-6 mb-8 grid grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-[2rem] border border-white/10">
          <Wallet size={20} className="text-primary mb-3" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Wallet Balance</span>
          <p className="text-xl font-black text-white">₹12,500.00</p>
        </div>
        <div className="glass-card p-5 rounded-[2rem] border border-white/10">
          <Gift size={20} className="text-amber-400 mb-3" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Rewards</span>
          <p className="text-xl font-black text-white">₹2,450.00</p>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 flex flex-col gap-6">
        {/* Section 1: Financial */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground ml-2">Account Management</h3>
          <div className="glass-card rounded-[2rem] border border-white/10 overflow-hidden">
            {[
              { icon: CreditCard, label: "Bank Account", color: "text-cyan-400" },
              { icon: History, label: "Transaction History", color: "text-blue-400" },
              { icon: Gift, label: "Reward Wallet", color: "text-amber-400" },
              { icon: Users, label: "Team Report", color: "text-indigo-400" },
            ].map((item, i) => (
              <button 
                key={i} 
                className={cn(
                  "w-full px-6 py-5 flex items-center justify-between transition-all active:bg-white/5",
                  i !== 3 && "border-b border-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={item.color} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Support & App */}
        <div className="pb-10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground ml-2">Preferences</h3>
          <div className="glass-card rounded-[2rem] border border-white/10 overflow-hidden">
            {[
              { icon: Settings, label: "System Settings", color: "text-slate-400" },
              { icon: ShieldCheck, label: "Security Center", color: "text-emerald-400" },
              { icon: Headphones, label: "Customer Support", color: "text-rose-400" },
              { icon: LogOut, label: "Sign Out", color: "text-muted-foreground" },
            ].map((item, i) => (
              <button 
                key={i} 
                className={cn(
                  "w-full px-6 py-5 flex items-center justify-between transition-all active:bg-white/5",
                  i !== 3 && "border-b border-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={item.color} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
