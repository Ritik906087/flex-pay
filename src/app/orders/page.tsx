
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { Info, Search, AlertCircle } from "lucide-react";
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

  const checkPendingOrder = () => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const pending = history.find((o: any) => o.status === 'pending-payment');
    return pending;
  };

  const startOrder = (marketOrder: any) => {
    const pending = checkPendingOrder();
    if (pending) {
      setPendingOrder(pending);
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
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-6 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Task Market</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Available Buy Orders</p>
          </div>
          <button className="text-gray-400 p-2 bg-gray-50 rounded-full active:scale-95 transition-transform">
            <Search size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 py-4">
          <div className="bg-primary/5 rounded-2xl p-4 flex gap-3 border border-primary/10">
            <Info className="text-primary shrink-0" size={16} />
            <p className="text-[10px] font-medium text-primary/80 leading-snug">
              Complete tasks to earn <span className="font-bold">6-8% profit</span>. All orders are reviewed within 30 mins for fast payouts.
            </p>
          </div>
        </div>

        <div className="px-6 flex flex-col gap-3">
          {MOCK_MARKET_ORDERS.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm active:bg-gray-50 transition-colors">
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
      </div>

      {/* Pending Order Dialog */}
      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="max-w-[85%] rounded-[1.5rem] border-0 p-6 shadow-2xl">
          <DialogHeader className="mb-4">
            <div className="mx-auto w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 mb-2">
              <AlertCircle size={20} />
            </div>
            <DialogTitle className="text-center text-[13px] font-black uppercase tracking-tight text-gray-900">Task In Progress</DialogTitle>
            <DialogDescription className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              You already have a pending task. Please complete it before starting a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-bold text-gray-400 uppercase">Order ID</span>
              <span className="text-[9px] font-black text-gray-900">{pendingOrder?.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-gray-400 uppercase">Amount</span>
              <span className="text-[12px] font-black text-primary">₹{pendingOrder?.amount.toLocaleString()}</span>
            </div>
          </div>

          <Button 
            className="w-full h-11 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10"
            onClick={resumePendingOrder}
          >
            RESUME TASK
          </Button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
