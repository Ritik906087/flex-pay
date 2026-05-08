
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, 
  Users, ShoppingCart, Share2, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(12500);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gradient-bg px-10">
        <div className="relative mb-8 animate-float">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <span className="text-4xl font-black text-primary-foreground tracking-tighter">FP</span>
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-2 text-white">FLEXPAY</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] font-medium">Premium Fintech</p>
        <div className="mt-20 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] w-24"></div>
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  const avatarUrl = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl || "https://picsum.photos/seed/default-avatar/200/200";

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 flex justify-between items-center">
        <div>
          <h2 className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Welcome back,</h2>
          <h1 className="text-xl font-bold">+91 9876543210</h1>
        </div>
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 p-0.5">
            <Image 
              src={avatarUrl} 
              alt="Avatar" 
              width={48} 
              height={48}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
            <span className="text-[8px] font-bold text-primary-foreground">V1</span>
          </div>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="px-6 mb-8">
        <div className="relative overflow-hidden rounded-[2rem] p-8 accent-gradient shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-primary-foreground/70 text-sm font-medium mb-1">Total Balance</p>
            <h2 className="text-4xl font-black text-primary-foreground mb-6">₹{balance.toLocaleString()}</h2>
            <div className="flex gap-4">
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-0 text-white flex-1 rounded-2xl py-6 font-bold">
                <ArrowDownCircle className="mr-2" size={20} />
                Recharge
              </Button>
              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-0 text-white flex-1 rounded-2xl py-6 font-bold">
                <ArrowUpCircle className="mr-2" size={20} />
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingCart, label: "Buy", color: "text-cyan-400" },
          { icon: TrendingUp, label: "Sell", color: "text-emerald-400" },
          { icon: Users, label: "Team", color: "text-indigo-400" },
          { icon: Share2, label: "Invite", color: "text-amber-400" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center ripple">
              <item.icon className={item.color} size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Banner Carousel */}
      <div className="px-6 mb-8 overflow-x-auto no-scrollbar flex gap-4">
        {PlaceHolderImages.filter(img => img.id.startsWith('banner-')).map((banner) => (
          <div key={banner.id} className="min-w-[85%] relative h-40 rounded-3xl overflow-hidden shadow-lg border border-white/5">
            <Image 
              src={banner.imageUrl} 
              alt={banner.description} 
              fill 
              className="object-cover"
              data-ai-hint={banner.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-white font-bold text-lg">Invest & Earn</h3>
              <p className="text-white/60 text-xs">Up to 6% commission daily</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Stats */}
      <div className="px-6 mb-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          Today's Dashboard
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Today Income", value: "₹450.00", icon: Wallet, color: "text-emerald-400" },
            { label: "Today Buy", value: "12", icon: ShoppingCart, color: "text-cyan-400" },
            { label: "Total Orders", value: "158", icon: TrendingUp, color: "text-indigo-400" },
            { label: "Team Income", value: "₹1,250.00", icon: Users, color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-3xl flex flex-col gap-1 border border-white/10 relative overflow-hidden">
              <div className="absolute -top-2 -right-2 opacity-10">
                <stat.icon size={48} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <span className="text-lg font-black text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 pb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Activity</h3>
          <Button variant="link" className="text-primary p-0 text-xs font-bold uppercase">View All</Button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { id: "#12468488", type: "Order Complete", amount: "+₹11.00", date: "2 mins ago", status: "success" },
            { id: "#12468489", type: "Recharge", amount: "+₹1,000.00", date: "1 hour ago", status: "success" },
            { id: "#12468490", type: "Order Complete", amount: "+₹15.00", date: "3 hours ago", status: "success" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl flex justify-between items-center border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <ShoppingCart size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">{item.type}</h4>
                  <p className="text-[10px] text-muted-foreground">{item.date} • {item.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-success">{item.amount}</span>
                <ChevronRight size={14} className="text-muted-foreground inline ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
