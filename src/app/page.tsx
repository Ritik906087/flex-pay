
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  TrendingUp, Wallet, ShoppingCart, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(12500);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    
    // Load balance and history
    const saved = localStorage.getItem('flexpay_orders');
    if (saved) {
      const orders = JSON.parse(saved);
      const successOrders = orders.filter((o: any) => o.status === 'success');
      const extra = successOrders.reduce((acc: number, o: any) => acc + (o.amount * o.profitPercent / 100 + o.bonus), 0);
      setBalance(12500 + extra);
      setRecentActivity(orders.slice(0, 5));
    } else {
      setRecentActivity([
        { id: "#12468488", status: "success", amount: 1000, timestamp: Date.now() - 3600000 },
        { id: "#12468487", status: "success", amount: 200, timestamp: Date.now() - 7200000 },
      ]);
    }

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white px-10">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <span className="text-2xl font-black text-white">FP</span>
        </div>
        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">FlexPay Loading</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Top Banner Slider as Header */}
      <div className="pt-6 px-4 bg-white pb-6 border-b border-gray-100">
        <div className="overflow-x-auto no-scrollbar flex gap-4">
          {PlaceHolderImages.filter(img => img.id.startsWith('banner-')).map((banner) => (
            <div key={banner.id} className="min-w-[320px] h-40 rounded-[2rem] overflow-hidden relative shadow-md">
              <Image 
                src={banner.imageUrl} 
                alt={banner.description} 
                fill 
                className="object-cover"
                data-ai-hint={banner.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-center">
                <h4 className="text-white font-extrabold text-xl leading-tight">Secure P2P<br/>Trading</h4>
                <p className="text-white/80 text-[10px] font-bold uppercase mt-2 tracking-widest">Instant Settlements</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-6 mt-6">
        <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-[0.2em]">Total Assets</span>
              <Wallet size={20} className="opacity-60" />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-8">₹{balance.toLocaleString()}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0 h-12 rounded-2xl font-black flex gap-2 text-xs uppercase tracking-wider">
                <ShoppingCart size={18} />
                BUY
              </Button>
              <Button className="bg-white text-primary hover:bg-gray-50 h-12 rounded-2xl font-black flex gap-2 text-xs shadow-lg uppercase tracking-wider">
                <TrendingUp size={18} />
                SELL
              </Button>
            </div>
          </div>
          <div className="absolute top-[-40%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-black/5 rounded-full blur-[40px]"></div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="px-6 mt-8">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4 ml-1">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Today Income", value: "₹450.00", color: "text-green-600", bg: "bg-white" },
            { label: "Total Orders", value: "158", color: "text-blue-600", bg: "bg-white" },
            { label: "Today Buy", value: "12", color: "text-indigo-600", bg: "bg-white" },
            { label: "Team Income", value: "₹1,250.00", color: "text-amber-600", bg: "bg-white" },
          ].map((stat, i) => (
            <div key={i} className={cn("p-5 rounded-[2rem] border border-gray-100 flex flex-col gap-1 shadow-sm", stat.bg)}>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <span className={cn("text-lg font-black", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mt-8 pb-32">
        <div className="flex justify-between items-center mb-5 px-1">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Recent Tasks</h3>
          <Button variant="link" className="text-primary text-[10px] font-black uppercase p-0 h-auto tracking-widest">History</Button>
        </div>
        <div className="flex flex-col gap-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 flex justify-between items-center shadow-sm active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-primary">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-gray-900">Task Completed</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-green-600">+₹{item.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
