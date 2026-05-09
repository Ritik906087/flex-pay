
"use client"

import { useState, useEffect, useMemo } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  Info, AlertCircle, ArrowRight, Wallet, BadgeIndianRupee, 
  CircleDollarSign, Plus, CheckCircle2, ChevronRight, Search, SlidersHorizontal, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { P2PEngine } from "@/lib/p2p-engine";
import { useToast } from "@/hooks/use-toast";

// Market orders will be empty initially until sellers post them
const MARKET_ORDERS: any[] = [];

export default function Orders() {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);
  
  const [minAmount, setMinAmount] = useState<string>("0");
  const [maxAmount, setMaxAmount] = useState<string>("1000000");

  useEffect(() => {
    checkPending();
    const handleUpdate = () => checkPending();
    window.addEventListener('p2p_order_update', handleUpdate);
    return () => window.removeEventListener('p2p_order_update', handleUpdate);
  }, []);

  const checkPending = () => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const pending = history.find((o: any) => o.status === 'pending-payment' || o.status === 'in-review');
    setPendingOrder(pending || null);
  };

  const handleBuyClick = (order: any) => {
    if (pendingOrder) {
      toast({ variant: "destructive", title: "Active Order", description: "Please complete or cancel your pending order first." });
      return;
    }

    setIsMatching(true);
    setTimeout(() => {
      const buyerId = localStorage.getItem('flexpay_user_id') || "USER_" + Math.random().toString(36).substr(2, 6);
      const matched = P2PEngine.matchOrder(order.amount, buyerId);

      setIsMatching(false);
      if (matched) {
        toast({ title: "Seller Matched!", description: "Order created successfully." });
        router.push(`/orders/checkout?id=${matched.id}`);
      } else {
        toast({ 
          variant: "destructive", 
          title: "No Seller Available", 
          description: "Currently no seller has sufficient balance for this amount." 
        });
      }
    }, 1500);
  };

  const filteredOrders = useMemo(() => {
    return MARKET_ORDERS.filter(order => {
      const min = minAmount ? parseInt(minAmount) : 0;
      const max = maxAmount ? parseInt(maxAmount) : 1000000;
      return order.amount >= min && order.amount <= max;
    });
  }, [minAmount, maxAmount]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <Tabs defaultValue="upi" className="w-full">
        <div className="bg-white px-5 pt-6 pb-2 border-b border-gray-100 sticky top-0 z-20">
          <div className="flex justify-between items-center mb-1.5 px-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-black text-primary uppercase tracking-tight">P2P Market</span>
              <span className="bg-green-100 text-green-600 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">Live Sync</span>
            </div>
          </div>

          <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 h-9 rounded-xl border border-gray-50 mb-2">
            <TabsTrigger value="upi" className="text-[9px] font-black uppercase tracking-widest rounded-lg">UPI Market</TabsTrigger>
            <TabsTrigger value="usdt" className="text-[9px] font-black uppercase tracking-widest rounded-lg">USDT Market</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 px-5">
          <TabsContent value="upi" className="mt-2 space-y-2.5">
            {isMatching && (
              <div className="bg-white p-4 rounded-xl border border-primary/20 flex items-center justify-center gap-3 animate-pulse shadow-sm">
                <Loader2 className="animate-spin text-primary" size={16} />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Searching for Seller...</span>
              </div>
            )}

            {pendingOrder && (
              <button 
                onClick={() => router.push(`/orders/checkout?id=${pendingOrder.id}`)}
                className="w-full bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between shadow-sm active:bg-amber-100 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle size={14} className="text-amber-500" />
                  <p className="text-[10px] font-bold text-amber-900 uppercase">Task In Progress: {pendingOrder.id}</p>
                </div>
                <ArrowRight size={12} className="text-amber-400" />
              </button>
            )}

            <div className="flex flex-col gap-2">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <BadgeIndianRupee size={40} className="text-gray-400 mb-3" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No Active Orders in Market</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white p-3.5 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[7px] font-bold text-gray-400 uppercase">{order.id}</span>
                      <p className="text-sm font-black text-gray-900">₹{order.amount.toLocaleString()}</p>
                    </div>
                    <Button 
                      size="sm"
                      className="h-8 px-6 rounded-lg font-black text-[9px] uppercase tracking-wider"
                      onClick={() => handleBuyClick(order)}
                      disabled={isMatching}
                    >
                      BUY
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
      <BottomNav />
    </div>
  );
}
