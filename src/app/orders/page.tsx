
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  ShoppingBag, CheckCircle2, Loader2, Info, Search, 
  Copy, Clock, QrCode, Upload, ArrowRight, X, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type OrderStatus = 'available' | 'in-review' | 'success' | 'rejected' | 'cancelled';

interface Order {
  id: string;
  amount: number;
  profitPercent: number;
  bonus: number;
  status: OrderStatus;
  timestamp: number;
  utr?: string;
  screenshot?: string;
}

const MOCK_MARKET_ORDERS = [
  { id: "#124684887", amount: 100, profit: 6, bonus: 5 },
  { id: "#124684888", amount: 500, profit: 6, bonus: 5 },
  { id: "#124684889", amount: 1000, profit: 6, bonus: 5 },
  { id: "#124684890", amount: 5000, profit: 8, bonus: 10 },
  { id: "#124684891", amount: 200, profit: 6, bonus: 5 },
  { id: "#124684892", amount: 1500, profit: 6, bonus: 5 },
  { id: "#124684893", amount: 300, profit: 6, bonus: 5 },
];

export default function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "available");
  const [history, setHistory] = useState<Order[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('flexpay_orders');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const startOrder = (marketOrder: any) => {
    // Navigate to next page instead of popup
    const params = new URLSearchParams({
      id: marketOrder.id,
      amount: marketOrder.amount.toString(),
      profit: marketOrder.profit.toString(),
      bonus: marketOrder.bonus.toString()
    });
    router.push(`/orders/checkout?${params.toString()}`);
  };

  const filteredHistory = history.filter(o => {
    if (activeTab === 'completed') return o.status === 'success';
    if (activeTab === 'history') return true;
    return false;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Market</h1>
          <button className="text-gray-400 p-2 bg-gray-50 rounded-full active:scale-95 transition-transform">
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

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "available" && (
          <>
            <div className="px-6 py-4">
              <div className="bg-blue-50/50 rounded-xl p-3 flex gap-3 border border-blue-100">
                <Info className="text-primary shrink-0" size={16} />
                <p className="text-[10px] font-medium text-blue-900/80 leading-snug">
                  Tasks offer <span className="text-primary font-bold">6-8% profit</span> plus <span className="text-primary font-bold">₹5-10 bonus</span>. Review time: 30 mins.
                </p>
              </div>
            </div>

            <div className="px-6 flex flex-col gap-2.5">
              {MOCK_MARKET_ORDERS.map((order) => (
                <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm active:bg-gray-50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{order.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
                        +{order.profit}% + ₹{order.bonus}
                      </span>
                    </div>
                  </div>

                  <Button 
                    size="sm"
                    className="h-8 px-6 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-md shadow-primary/10"
                    onClick={() => startOrder(order)}
                  >
                    BUY
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {(activeTab === "completed" || activeTab === "history") && (
          <div className="px-6 mt-4 flex flex-col gap-3">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <ShoppingBag size={48} />
                <p className="text-xs font-bold mt-4 uppercase">No orders found</p>
              </div>
            ) : (
              filteredHistory.map((order) => (
                <div key={`${order.id}-${order.timestamp}`} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">{order.id}</span>
                      <span className="text-sm font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                    </div>
                    <div className={cn(
                      "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider",
                      order.status === 'success' ? "bg-green-50 text-green-600" :
                      order.status === 'in-review' ? "bg-yellow-50 text-yellow-600" :
                      order.status === 'rejected' ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"
                    )}>
                      {order.status.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Profit Earned</span>
                      <span className="text-xs font-bold text-green-600">+₹{(order.amount * order.profitPercent / 100 + order.bonus).toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-medium text-gray-400 block">
                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {order.utr && <span className="text-[9px] font-bold text-gray-500">UTR: {order.utr}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
