
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, ChevronLeft, Clock, Copy, 
  CheckCircle2, Info, Building2, User, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = 'pending-payment' | 'in-review' | 'success' | 'rejected' | 'cancelled';

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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [history, setHistory] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('flexpay_orders');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };

  const filteredHistory = history.filter(o => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return o.status === 'pending-payment';
    if (activeTab === 'review') return o.status === 'in-review';
    if (activeTab === 'success') return o.status === 'success';
    if (activeTab === 'failed') return o.status === 'rejected' || o.status === 'cancelled';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="p-1 -ml-1 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Buy History</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Order records</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {["all", "pending", "review", "success", "failed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-2 text-[9px] font-bold uppercase tracking-widest relative transition-all whitespace-nowrap",
                activeTab === tab ? "text-primary" : "text-gray-400"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <ShoppingBag size={40} />
            <p className="text-[9px] font-black mt-3 uppercase tracking-widest">No orders</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredHistory.map((order) => (
              <div key={`${order.id}-${order.timestamp}`} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tight">{order.id}</span>
                    <span className="text-sm font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                  </div>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider",
                    order.status === 'success' ? "bg-green-50 text-green-600 border border-green-100" :
                    order.status === 'in-review' ? "bg-yellow-50 text-yellow-600 border border-yellow-100" :
                    order.status === 'pending-payment' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                    order.status === 'rejected' ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-50 text-gray-500 border border-gray-100"
                  )}>
                    {order.status.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-50 pt-2.5">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock size={10} />
                    <span className="text-[8px] font-bold">
                      {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {order.status === 'pending-payment' && (
                      <button 
                        onClick={() => {
                          const params = new URLSearchParams({
                            id: order.id,
                            amount: order.amount.toString(),
                            profit: (order.profitPercent || 0).toString(),
                            bonus: (order.bonus || 0).toString()
                          });
                          router.push(`/orders/checkout?${params.toString()}`);
                        }}
                        className="text-[8px] font-black text-white uppercase tracking-widest px-3 py-1 bg-primary rounded-lg active:scale-95 transition-all"
                      >
                        COMPLETE
                      </button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-[8px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-lg active:scale-95 transition-all">
                          View Details
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[85%] rounded-[1.5rem] border-0 p-0 overflow-hidden shadow-2xl">
                        <div className="bg-white px-5 pt-6 pb-6">
                          <DialogHeader className="mb-4">
                            <div className="mx-auto w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                              <Info size={20} />
                            </div>
                            <DialogTitle className="text-center text-[13px] font-black uppercase tracking-tight text-gray-900">Order Details</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Basic Info */}
                            <div className="bg-gray-50 rounded-xl p-3.5 space-y-2.5 border border-gray-100">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Order ID</span>
                                <button onClick={() => handleCopy(order.id, "Order ID")} className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-black text-gray-900">{order.id}</span>
                                  <Copy size={10} className="text-gray-300" />
                                </button>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Amount</span>
                                <span className="text-[12px] font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Status</span>
                                <span className={cn("text-[8px] font-black uppercase", order.status === 'success' ? "text-green-600" : "text-yellow-600")}>
                                  {order.status.replace('-', ' ')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Time</span>
                                <span className="text-[9px] font-bold text-gray-700">{new Date(order.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                              </div>
                              {order.utr && (
                                <div className="flex justify-between items-center border-t border-gray-100 pt-2.5">
                                  <span className="text-[8px] font-bold text-gray-400 uppercase">UTR</span>
                                  <button onClick={() => handleCopy(order.utr!, "UTR")} className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black text-primary tracking-widest">{order.utr}</span>
                                    <Copy size={10} className="text-primary/30" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Merchant Payment Details */}
                            <div className="space-y-2">
                              <h4 className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Merchant Info</h4>
                              <div className="bg-white rounded-xl border border-gray-100 p-3.5 space-y-3 shadow-sm">
                                <div className="flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                    <User size={12} />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-[7px] font-bold text-gray-400 uppercase block mb-0.5">Name</span>
                                    <button onClick={() => handleCopy("FLEXPAY MERCHANT LTD", "Merchant Name")} className="flex items-center gap-1.5 group">
                                      <p className="text-[9px] font-black text-gray-900">FLEXPAY MERCHANT LTD</p>
                                      <Copy size={9} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                                    <CheckCircle2 size={12} />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-[7px] font-bold text-gray-400 uppercase block mb-0.5">UPI ID</span>
                                    <button onClick={() => handleCopy("flexpay@upi", "UPI ID")} className="flex items-center gap-1.5 group">
                                      <p className="text-[9px] font-black text-primary">flexpay@upi</p>
                                      <Copy size={9} className="text-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button 
                            className="w-full h-10 rounded-xl mt-6 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/10"
                            onClick={(e) => {
                              const closeBtn = document.querySelector('[data-radix-collection-item]') as HTMLElement;
                              closeBtn?.click();
                            }}
                          >
                            CLOSE
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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
