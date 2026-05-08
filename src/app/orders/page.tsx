
"use client"

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { ShoppingBag, ChevronRight, CheckCircle2, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MOCK_ORDERS = [
  { id: "#1246848879887", amount: 100, profit: 6, bonus: 5, status: "available" },
  { id: "#1246848879888", amount: 500, profit: 6, bonus: 5, status: "available" },
  { id: "#1246848879889", amount: 1000, profit: 6, bonus: 5, status: "available" },
  { id: "#1246848879890", amount: 5000, profit: 8, bonus: 10, status: "available" },
  { id: "#1246848879891", amount: 200, profit: 6, bonus: 5, status: "available" },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState("available");
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = (id: string, amount: number, profitPercent: number, bonus: number) => {
    setPurchasing(id);
    const reward = (amount * profitPercent / 100) + bonus;

    setTimeout(() => {
      setPurchasing(null);
      toast({
        title: "Order Successful!",
        description: `You earned ₹${reward.toFixed(2)} commission!`,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">Order Market</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Earn passive commission daily</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="glass-card p-1.5 rounded-2xl flex">
          {["available", "pending", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                activeTab === tab ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-6 mb-6">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
          <Info className="text-primary shrink-0" size={18} />
          <p className="text-[10px] font-medium leading-relaxed text-primary-foreground/80">
            Commission Rule: On every successful purchase, you receive <span className="text-primary font-bold">6% profit</span> + <span className="text-primary font-bold">₹5 extra bonus</span> instantly in your wallet.
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-6 flex flex-col gap-4">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="glass-card p-5 rounded-[2rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 bg-success/10 rounded-full border border-success/20">
                <span className="text-[8px] font-bold text-success uppercase">Active</span>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Order Serial</span>
              <h4 className="text-sm font-black text-white">{order.id}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Amount</span>
                <span className="text-xl font-black text-white">₹{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Profit</span>
                <span className="text-xl font-black text-primary">+{order.profit}% + ₹{order.bonus}</span>
              </div>
            </div>

            <Button 
              className="w-full py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 ripple"
              disabled={purchasing !== null}
              onClick={() => handlePurchase(order.id, order.amount, order.profit, order.bonus)}
            >
              {purchasing === order.id ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  Purchase Now
                  <ChevronRight className="ml-2" size={18} />
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Bottom Nav Placeholder */}
      <BottomNav />
    </div>
  );
}
