
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
import { supabase } from "@/lib/supabase";

// Sample Market Orders (In production these could be dynamic or pre-set amounts)
const MARKET_AMOUNTS = [
  { id: 'M1', amount: 500 },
  { id: 'M2', amount: 1000 },
  { id: 'M3', amount: 2000 },
  { id: 'M4', amount: 5000 },
  { id: 'M5', amount: 10000 },
  { id: 'M6', amount: 20000 },
];

export default function Orders() {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPending();
    const handleUpdate = () => checkPending();
    window.addEventListener('p2p_order_update', handleUpdate);
    return () => window.removeEventListener('p2p_order_update', handleUpdate);
  }, []);

  const checkPending = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: orders } = await supabase
        .from('p2p_orders')
        .select('*')
        .eq('buyer_id', user.id)
        .in('status', ['pending-payment', 'in-review'])
        .maybeSingle();
      
      setPendingOrder(orders || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = async (amount: number) => {
    if (pendingOrder) {
      toast({ variant: "destructive", title: "Active Order", description: "Complete or cancel your pending order first." });
      return;
    }

    setIsMatching(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const result = await P2PEngine.matchOrder(amount, user.id);

      if (result.order) {
        toast({ title: "Seller Matched!", description: "Transfer funds to complete settlement." });
        router.push(`/orders/checkout?id=${result.order.id}`);
      } else {
        toast({ 
          variant: "destructive", 
          title: "No Match Found", 
          description: result.error || "Currently no seller has sufficient liquidity." 
        });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <Tabs defaultValue="upi" className="w-full">
        <div className="bg-white px-5 pt-6 pb-2 border-b border-gray-100 sticky top-0 z-20">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-black text-primary uppercase tracking-tight">P2P Market</span>
              <span className="bg-green-100 text-green-600 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">Verified</span>
            </div>
          </div>

          <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 h-9 rounded-xl border border-gray-50 mb-2">
            <TabsTrigger value="upi" className="text-[9px] font-black uppercase tracking-widest rounded-lg">UPI Market</TabsTrigger>
            <TabsTrigger value="usdt" className="text-[9px] font-black uppercase tracking-widest rounded-lg">USDT Market</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 px-5">
          <TabsContent value="upi" className="mt-2 space-y-3">
            {isMatching && (
              <div className="bg-white p-4 rounded-xl border border-primary/20 flex items-center justify-center gap-3 animate-pulse shadow-sm">
                <Loader2 className="animate-spin text-primary" size={16} />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Searching Network...</span>
              </div>
            )}

            {pendingOrder && (
              <button 
                onClick={() => router.push(`/orders/checkout?id=${pendingOrder.id}`)}
                className="w-full bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between shadow-sm active:bg-amber-100 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle size={14} className="text-amber-500" />
                  <p className="text-[10px] font-bold text-amber-900 uppercase">Active Task: {pendingOrder.id}</p>
                </div>
                <ArrowRight size={12} className="text-amber-400" />
              </button>
            )}

            <div className="grid grid-cols-1 gap-2.5">
              {MARKET_AMOUNTS.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[8px] font-bold text-gray-400 uppercase">Settlement Request</span>
                    <p className="text-lg font-black text-gray-900">₹{order.amount.toLocaleString()}</p>
                  </div>
                  <Button 
                    className="h-10 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest bg-primary shadow-lg shadow-primary/10"
                    onClick={() => handleBuyClick(order.amount)}
                    disabled={isMatching || !!pendingOrder}
                  >
                    BUY
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
      <BottomNav />
    </div>
  );
}
