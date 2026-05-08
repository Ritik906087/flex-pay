"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, 
  Users, ShoppingCart, Share2, ChevronRight, Bell, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(12500);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-10">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <span className="text-2xl font-black text-white">FP</span>
        </div>
        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">FlexPay Loading</p>
      </div>
    );
  }

  const avatarUrl = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl || "https://picsum.photos/seed/default-avatar/200/200";

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
            <Image 
              src={avatarUrl} 
              alt="Avatar" 
              width={40} 
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Good Morning,</h2>
            <h1 className="text-sm font-bold text-gray-900">+91 98765 43210</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Search size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-6 mt-6">
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium opacity-80 uppercase tracking-widest">Available Balance</span>
              <Wallet size={20} className="opacity-60" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-6">₹{balance.toLocaleString()}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0 h-12 rounded-xl font-bold flex gap-2">
                <ShoppingCart size={18} />
                Buy
              </Button>
              <Button className="bg-white text-primary hover:bg-gray-50 h-12 rounded-xl font-bold flex gap-2">
                <TrendingUp size={18} />
                Sell
              </Button>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="px-6 mt-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Today Income", value: "₹450.00", color: "text-green-500", bg: "bg-green-50" },
            { label: "Today Buy", value: "12", color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Total Orders", value: "158", color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Team Income", value: "₹1,250.00", color: "text-amber-500", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{stat.label}</span>
              <span className={cn("text-lg font-black", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Slider */}
      <div className="px-6 mt-8">
        <div className="overflow-x-auto no-scrollbar flex gap-4 pb-2">
          {PlaceHolderImages.filter(img => img.id.startsWith('banner-')).map((banner) => (
            <div key={banner.id} className="min-w-[280px] h-36 rounded-2xl overflow-hidden relative border border-gray-100">
              <Image 
                src={banner.imageUrl} 
                alt={banner.description} 
                fill 
                className="object-cover"
                data-ai-hint={banner.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent p-5 flex flex-col justify-center">
                <h4 className="text-white font-bold text-lg leading-tight">Fast P2P<br/>Trading</h4>
                <p className="text-white/70 text-[10px] font-medium uppercase mt-1">Start Earning Today</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mt-8 pb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
          <Button variant="link" className="text-primary text-[10px] font-bold uppercase p-0">See All</Button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { id: "#12468488", type: "Order Complete", amount: "+₹11.00", date: "2 mins ago", status: "success" },
            { id: "#12468489", type: "P2P Buy", amount: "+₹1,000.00", date: "1 hour ago", status: "success" },
            { id: "#12468490", type: "Order Complete", amount: "+₹15.00", date: "3 hours ago", status: "success" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-gray-900">{item.type}</h4>
                  <p className="text-[9px] text-gray-400 font-medium">{item.date} • {item.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-green-600">{item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}