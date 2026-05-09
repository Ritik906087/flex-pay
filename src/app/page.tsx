
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  TrendingUp, Wallet, ShoppingCart, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    
    // Load dynamic data from storage
    const loadData = () => {
      const savedOrders = localStorage.getItem('flexpay_orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const successOrders = orders.filter((o: any) => o.status === 'success');
        const calculatedBalance = successOrders.reduce((acc: number, o: any) => 
          acc + (o.amount * (o.profitPercent || 0) / 100 + (o.bonus || 0)), 0);
        
        setBalance(calculatedBalance);
        setRecentActivity(orders.slice(0, 5));
      } else {
        setBalance(0);
        setRecentActivity([]);
      }
    };

    loadData();
    window.addEventListener('p2p_order_update', loadData);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('p2p_order_update', loadData);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-10">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <span className="text-xl font-black text-white">FP</span>
        </div>
        <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Initializing Terminal</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <div className="pt-4 px-3 bg-white pb-5 border-b border-gray-100">
        <div className="overflow-x-auto no-scrollbar flex gap-3">
          {PlaceHolderImages.filter(img => img.id.startsWith('banner-')).map((banner) => (
            <div key={banner.id} className="min-w-[280px] h-36 rounded-[1.5rem] overflow-hidden relative shadow-sm">
              <Image 
                src={banner.imageUrl} 
                alt={banner.description} 
                fill 
                className="object-cover"
                data-ai-hint={banner.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-5 flex flex-col justify-center">
                <h4 className="text-white font-extrabold text-lg leading-tight">Secure P2P<br/>Trading</h4>
                <p className="text-white/80 text-[9px] font-bold uppercase mt-1.5 tracking-widest">Instant Settlements</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] font-bold opacity-80 uppercase tracking-[0.2em]">Commission Balance</span>
              <Wallet size={16} className="opacity-60" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-6">₹{balance.toLocaleString()}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => window.location.href='/orders'} className="bg-white/20 hover:bg-white/30 text-white border-0 h-10 rounded-xl font-black flex gap-2 text-[10px] uppercase tracking-wider">
                <ShoppingCart size={14} />
                BUY
              </Button>
              <Button onClick={() => window.location.href='/profile/sell'} className="bg-white text-primary hover:bg-gray-50 h-10 rounded-xl font-black flex gap-2 text-[10px] shadow-lg uppercase tracking-wider">
                <TrendingUp size={14} />
                SELL
              </Button>
            </div>
          </div>
          <div className="absolute top-[-40%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-[60px]"></div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3 ml-1">Today's Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Today Income", value: "₹0.00", color: "text-green-600" },
            { label: "Total Orders", value: "0", color: "text-blue-600" },
            { label: "Today Buy", value: "0", color: "text-indigo-600" },
            { label: "Team Income", value: "₹0.00", color: "text-amber-600" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-[1.5rem] border border-gray-100 flex flex-col gap-0.5 shadow-sm bg-white">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <span className={cn("text-base font-black", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6 pb-28">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Recent Tasks</h3>
          <button onClick={() => window.location.href='/profile/history'} className="text-primary text-[9px] font-black uppercase tracking-widest hover:opacity-70">View History</button>
        </div>
        <div className="flex flex-col gap-2.5">
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[1.5rem] border border-dashed border-gray-200 opacity-40">
              <Info size={24} className="text-gray-400 mb-2" />
              <p className="text-[9px] font-black uppercase tracking-widest">No Recent Tasks</p>
            </div>
          ) : (
            recentActivity.map((item, i) => (
              <div key={i} className="bg-white p-3.5 rounded-[1.2rem] border border-gray-100 flex justify-between items-center shadow-sm active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-primary">
                    <ShoppingCart size={16} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-gray-900">Task Completed</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-green-600">+₹{item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
