
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ChevronLeft, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = 'in-review' | 'success' | 'rejected' | 'cancelled';

interface Order {
  id: string;
  amount: number;
  profitPercent: number;
  bonus: number;
  status: OrderStatus;
  timestamp: number;
  utr?: string;
}

export default function BuyHistory() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [history, setHistory] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('flexpay_orders');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const filteredHistory = history.filter(o => {
    if (activeTab === 'all') return true;
    if (activeTab === 'review') return o.status === 'in-review';
    if (activeTab === 'success') return o.status === 'success';
    if (activeTab === 'failed') return o.status === 'rejected' || o.status === 'cancelled';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 active:scale-90 transition-transform">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">Buy History</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your task records</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {["all", "review", "success", "failed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-[10px] font-bold uppercase tracking-widest relative transition-all whitespace-nowrap",
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

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-20">
            <ShoppingBag size={48} />
            <p className="text-[10px] font-black mt-4 uppercase tracking-widest">No orders found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredHistory.map((order) => (
              <div key={`${order.id}-${order.timestamp}`} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{order.id}</span>
                    <span className="text-sm font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider",
                    order.status === 'success' ? "bg-green-50 text-green-600 border border-green-100" :
                    order.status === 'in-review' ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                    order.status === 'rejected' ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-50 text-gray-500 border border-gray-100"
                  )}>
                    {order.status.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 border-t border-gray-50 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Profit Earned</span>
                      <span className="text-xs font-bold text-green-600">+₹{(order.amount * order.profitPercent / 100 + order.bonus).toFixed(2)}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-1 text-gray-400 mb-0.5">
                        <Clock size={10} />
                        <span className="text-[9px] font-medium">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {order.utr && <span className="text-[9px] font-bold text-gray-500">UTR: {order.utr}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
