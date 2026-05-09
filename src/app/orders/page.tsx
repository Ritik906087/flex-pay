
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Info, AlertCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [showPendingDialog, setShowPendingDialog] = useState(false);

  useEffect(() => {
    checkAndSetPending();
  }, []);

  const checkAndSetPending = () => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const pending = history.find((o: any) => o.status === 'pending-payment');
    if (pending) {
      setPendingOrder(pending);
    } else {
      setPendingOrder(null);
    }
    return pending;
  };

  const startOrder = (marketOrder: any) => {
    const pending = checkAndSetPending();
    if (pending) {
      setShowPendingDialog(true);
      return;
    }

    const params = new URLSearchParams({
      id: marketOrder.id,
      amount: marketOrder.amount.toString(),
      profit: marketOrder.profit.toString(),
      bonus: marketOrder.bonus.toString()
    });
    router.push(`/orders/checkout?${params.toString()}`);
  };

  const resumePendingOrder = () => {
    if (!pendingOrder) return;
    const params = new URLSearchParams({
      id: pendingOrder.id,
      amount: pendingOrder.amount.toString(),
      profit: (pendingOrder.profitPercent || 0).toString(),
      bonus: (pendingOrder.bonus || 0).toString()
    });
    router.push(`/orders/checkout?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header - Updated with Red Profit Info & USDT Rate */}
      <div className="bg-white px-5 pt-8 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-red-600 uppercase tracking-tight">6% + ₹5 per order</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span className="text-[11px] font-black text-red-600 uppercase tracking-tight">1 USDT = ₹110</span>
          </div>
          <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Guaranteed Profit Sharing</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Active Task Banner if exists */}
        {pendingOrder && (
          <div className="px-5 mt-4">
            <button 
              onClick={() => setShowPendingDialog(true)}
              className="w-full bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center justify-between group active:bg-amber-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-sm">
                  <AlertCircle size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Active Task Pending</p>
                  <p className="text-[10px] font-bold text-amber-900">{pendingOrder.id} • ₹{pendingOrder.amount}</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        <div className="px-5 py-4">
          <div className="bg-primary/5 rounded-xl p-3.5 flex gap-3 border border-primary/10">
            <Info className="text-primary shrink-0" size={14} />
            <p className="text-[9px] font-bold text-primary/80 leading-snug uppercase tracking-tight">
              Complete tasks to earn commission. Standard review time: 30 mins.
            </p>
          </div>
        </div>

        <div className="px-5 flex flex-col gap-2.5">
          {MOCK_MARKET_ORDERS.map((order) => (
            <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm active:bg-gray-50 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">{order.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
                  <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-lg border border-green-100">
                    <span className="text-[8px] font-black text-green-600 uppercase">+{order.profit}%</span>
                  </div>
                </div>
              </div>

              <Button 
                size="sm"
                className="h-8 px-5 rounded-xl font-black text-[9px] uppercase tracking-wider shadow-lg shadow-primary/10"
                onClick={() => startOrder(order)}
              >
                BUY
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Order Dialog */}
      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="max-w-[85%] rounded-[1.8rem] border-0 p-6 shadow-2xl">
          <DialogHeader className="mb-4">
            <div className="mx-auto w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-3">
              <AlertCircle size={24} />
            </div>
            <DialogTitle className="text-center text-[13px] font-black uppercase tracking-tight text-gray-900">Task In Progress</DialogTitle>
            <DialogDescription className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 leading-relaxed">
              You already have a pending task. Please complete or cancel it before starting a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
              <span className="text-[9px] font-black text-gray-900">{pendingOrder?.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Amount</span>
              <span className="text-[14px] font-black text-primary">₹{pendingOrder?.amount?.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button 
              className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
              onClick={resumePendingOrder}
            >
              RESUME TASK
            </Button>
            <Button 
              variant="ghost"
              className="w-full h-10 rounded-xl font-bold text-[9px] text-gray-400 uppercase tracking-widest"
              onClick={() => setShowPendingDialog(false)}
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
