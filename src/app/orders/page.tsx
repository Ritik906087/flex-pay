"use client"

import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { ShoppingBag, ChevronRight, CheckCircle2, Loader2, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MOCK_ORDERS = [
  { id: "#124684887", amount: 100, profit: 6, bonus: 5, status: "available" },
  { id: "#124684888", amount: 500, profit: 6, bonus: 5, status: "available" },
  { id: "#124684889", amount: 1000, profit: 6, bonus: 5, status: "available" },
  { id: "#124684890", amount: 5000, profit: 8, bonus: 10, status: "available" },
  { id: "#124684891", amount: 200, profit: 6, bonus: 5, status: "available" },
  { id: "#124684892", amount: 1500, profit: 6, bonus: 5, status: "available" },
  { id: "#124684893", amount: 300, profit: 6, bonus: 5, status: "available" },
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
        title: "Order Success",
        description: `Commission ₹${reward.toFixed(2)} added to wallet.`,
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Order Market</h1>
          <button className="text-gray-400 p-2 bg-gray-50 rounded-full">
            <Search size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          {["available", "completed", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-xs font-bold uppercase tracking-wider relative transition-all",
                activeTab === tab ? "text-primary" : "text-gray-400"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="px-6 py-4">
        <div className="bg-blue-50/50 rounded-xl p-3 flex gap-3 border border-blue-100">
          <Info className="text-primary shrink-0" size={16} />
          <p className="text-[10px] font-medium text-blue-900/80 leading-snug">
            Each task gives <span className="text-primary font-bold">6% profit</span> plus an additional <span className="text-primary font-bold">₹5 bonus</span> instantly.
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-6 flex flex-col gap-3 pb-24">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{order.id}</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  +{order.profit}% + ₹{order.bonus}
                </span>
              </div>
            </div>

            <Button 
              size="sm"
              className="h-9 px-5 rounded-xl font-bold text-xs shadow-md shadow-primary/10"
              disabled={purchasing !== null}
              onClick={() => handlePurchase(order.id, order.amount, order.profit, order.bonus)}
            >
              {purchasing === order.id ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "BUY"
              )}
            </Button>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}