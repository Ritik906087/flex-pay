
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, 
  Users, ShoppingCart, Share2, ChevronRight, Bell, Search, Copy
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

  const mobileNumber = "9876543210";
  const uid = "FLEX123456";

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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

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

  const avatarUrl = PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl || "https://picsum.photos/seed/useravatar/200/200";

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
          <div className="flex flex-col">
            <h2 className="text-gray-400 text-[9px] uppercase tracking-wider font-bold">Good Morning,</h2>
            <button 
              onClick={() => handleCopy(mobileNumber, "Username")}
              className="flex items-center gap-1 active:opacity-70 transition-opacity"
            >
              <h1 className="text-sm font-bold text-gray-900">{mobileNumber}</h1>
              <Copy size={10} className="text-gray-300" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
            <Search size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 relative active:scale-90 transition-transform">
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-6 mt-6">
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Available Balance</span>
              <Wallet size={18} className="opacity-60" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-6">₹{balance.toLocaleString()}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0 h-11 rounded-xl font-bold flex gap-2 text-xs">
                <ShoppingCart size={16} />
                BUY
              </Button>
              <Button className="bg-white text-primary hover:bg-gray-50 h-11 rounded-xl font-bold flex gap-2 text-xs shadow-sm">
                <TrendingUp size={16} />
                SELL
              </Button>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="px-6 mt-8">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Today Income", value: "₹450.00", color: "text-green-500", bg: "bg-green-50/50" },
            { label: "Total Orders", value: "158", color: "text-purple-500", bg: "bg-purple-50/50" },
            { label: "Today Buy", value: "12", color: "text-blue-500", bg: "bg-blue-50/50" },
            { label: "Team Income", value: "₹1,250.00", color: "text-amber-500", bg: "bg-amber-50/50" },
          ].map((stat, i) => (
            <div key={i} className={cn("p-4 rounded-2xl border border-gray-100 flex flex-col gap-1 bg-white shadow-sm", stat.bg)}>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{stat.label}</span>
              <span className={cn("text-base font-black", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Slider */}
      <div className="px-6 mt-8">
        <div className="overflow-x-auto no-scrollbar flex gap-4 pb-2">
          {PlaceHolderImages.filter(img => img.id.startsWith('banner-')).map((banner) => (
            <div key={banner.id} className="min-w-[280px] h-36 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm">
              <Image 
                src={banner.imageUrl} 
                alt={banner.description} 
                fill 
                className="object-cover"
                data-ai-hint={banner.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-5 flex flex-col justify-center">
                <h4 className="text-white font-bold text-lg leading-tight">Secure P2P<br/>Network</h4>
                <p className="text-white/70 text-[10px] font-bold uppercase mt-1 tracking-wider">Fastest Execution</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mt-8 pb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
          <Button variant="link" className="text-primary text-[10px] font-bold uppercase p-0 h-auto">View All</Button>
        </div>
        <div className="flex flex-col gap-2.5">
          {recentActivity.map((item, i) => (
            <div key={i} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                  <ShoppingCart size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-gray-900">Buy Order Complete</h4>
                  <p className="text-[9px] text-gray-400 font-medium">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-green-600">+₹{item.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
