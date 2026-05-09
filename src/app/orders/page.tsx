
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  Info, AlertCircle, ArrowRight, Wallet, BadgeIndianRupee, 
  CircleDollarSign, Plus, CheckCircle2, ChevronRight 
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
  const [showLinkRequiredDialog, setShowLinkRequiredDialog] = useState(false);
  const [showAccountSelectionDialog, setShowAccountSelectionDialog] = useState(false);
  const [selectedMarketOrder, setSelectedMarketOrder] = useState<any>(null);
  const [compatibleAccounts, setCompatibleAccounts] = useState<any[]>([]);
  const [usdtAmount, setUsdtAmount] = useState<string>("");

  const USDT_RATE = 110;

  useEffect(() => {
    checkAndSetPending();
  }, []);

  const checkAndSetPending = () => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const pending = history.find((o: any) => o.status === 'pending-payment');
    setPendingOrder(pending || null);
    return pending;
  };

  const handleBuyClick = (marketOrder: any) => {
    // 1. Check for pending orders
    const pending = checkAndSetPending();
    if (pending) {
      setShowPendingDialog(true);
      return;
    }

    // 2. Check for MobiKwik/Freecharge accounts
    const linkedAccounts = JSON.parse(localStorage.getItem('flexpay_linked_accounts') || '[]');
    const compatible = linkedAccounts.filter((acc: any) => 
      acc.appName === "MobiKwik" || acc.appName === "Freecharge"
    );

    setSelectedMarketOrder(marketOrder);
    
    if (compatible.length === 0) {
      setShowLinkRequiredDialog(true);
    } else {
      setCompatibleAccounts(compatible);
      setShowAccountSelectionDialog(true);
    }
  };

  const confirmPurchase = () => {
    if (!selectedMarketOrder) return;
    const params = new URLSearchParams({
      id: selectedMarketOrder.id,
      amount: selectedMarketOrder.amount.toString(),
      profit: selectedMarketOrder.profit.toString(),
      bonus: selectedMarketOrder.bonus.toString()
    });
    router.push(`/orders/checkout?${params.toString()}`);
  };

  const startUsdtOrder = () => {
    const pending = checkAndSetPending();
    if (pending) {
      setShowPendingDialog(true);
      return;
    }

    if (!usdtAmount || parseFloat(usdtAmount) <= 0) return;

    const inrAmount = parseFloat(usdtAmount) * USDT_RATE;
    const params = new URLSearchParams({
      id: `#USDT${Math.floor(Math.random() * 1000000)}`,
      amount: inrAmount.toString(),
      usdt: usdtAmount,
      profit: "8",
      bonus: "0"
    });
    router.push(`/orders/usdt-checkout?${params.toString()}`);
  };

  const resumePendingOrder = () => {
    if (!pendingOrder) return;
    const isUsdt = pendingOrder.id.startsWith('#USDT');
    const path = isUsdt ? '/orders/usdt-checkout' : '/orders/checkout';
    
    const params = new URLSearchParams({
      id: pendingOrder.id,
      amount: pendingOrder.amount.toString(),
      profit: (pendingOrder.profitPercent || 0).toString(),
      bonus: (pendingOrder.bonus || 0).toString()
    });
    if (isUsdt && pendingOrder.usdt) params.set('usdt', pendingOrder.usdt);
    
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-red-600 uppercase tracking-tight">6% + ₹5 per order</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span className="text-[11px] font-black text-red-600 uppercase tracking-tight">1 USDT = ₹{USDT_RATE}</span>
          </div>
          <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Guaranteed Profit Sharing</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
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

        <div className="px-5 mt-4">
          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 h-10 rounded-xl border border-gray-100">
              <TabsTrigger value="upi" className="text-[9px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BadgeIndianRupee size={12} className="mr-1.5" />
                UPI +
              </TabsTrigger>
              <TabsTrigger value="usdt" className="text-[9px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CircleDollarSign size={12} className="mr-1.5" />
                USDT
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upi" className="mt-4">
              <div className="flex flex-col gap-2.5">
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
                      onClick={() => handleBuyClick(order)}
                    >
                      BUY
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="usdt" className="mt-4">
              <div className="bg-white p-5 rounded-[1.8rem] border border-gray-100 shadow-sm space-y-5">
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">USDT Amount</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                      <CircleDollarSign size={18} />
                    </div>
                    <Input 
                      type="number" 
                      placeholder="Enter USDT to buy" 
                      className="h-14 bg-gray-50 border-gray-100 rounded-2xl pl-11 text-base font-black placeholder:font-medium placeholder:text-gray-300 focus:bg-white transition-all"
                      value={usdtAmount}
                      onChange={(e) => setUsdtAmount(e.target.value)}
                    />
                  </div>
                </div>

                {usdtAmount && parseFloat(usdtAmount) > 0 && (
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-bold text-primary/60 uppercase tracking-widest mb-0.5">Estimated Cost</p>
                      <p className="text-xl font-black text-primary">₹{(parseFloat(usdtAmount) * USDT_RATE).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-primary/60 uppercase tracking-widest mb-0.5">Rate</p>
                      <p className="text-[10px] font-black text-primary">₹110 / USDT</p>
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 rounded-xl p-3 flex gap-3 border border-amber-100">
                  <Info className="text-amber-600 shrink-0" size={14} />
                  <p className="text-[8px] font-bold text-amber-700 leading-snug uppercase tracking-tight">
                    USDT settlements are processed within 15-30 minutes. Use TRC20 network only.
                  </p>
                </div>

                <Button 
                  className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                  onClick={startUsdtOrder}
                  disabled={!usdtAmount || parseFloat(usdtAmount) <= 0}
                >
                  CONFIRM PURCHASE
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Account Selection Dialog (Shown if compatible accounts exist) */}
      <Dialog open={showAccountSelectionDialog} onOpenChange={setShowAccountSelectionDialog}>
        <DialogContent className="max-w-[85%] rounded-[1.8rem] border-0 p-6 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center text-[13px] font-black uppercase tracking-tight text-gray-900">Confirm Order</DialogTitle>
            <DialogDescription className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
              Available compatible accounts
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 max-h-[200px] overflow-y-auto no-scrollbar mb-6">
            {compatibleAccounts.map((acc, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 relative rounded-lg overflow-hidden border border-gray-100 bg-white">
                    <Image src={acc.logo} alt={acc.appName} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-900 uppercase">{acc.appName}</p>
                    <p className="text-[7px] font-bold text-gray-400 tracking-tight">{acc.upi}</p>
                  </div>
                </div>
                <CheckCircle2 size={14} className="text-green-500" />
              </div>
            ))}
          </div>

          <Button 
            className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
            onClick={confirmPurchase}
          >
            CONFIRM BUY
          </Button>
        </DialogContent>
      </Dialog>

      {/* Link Required Dialog (Shown if NO MobiKwik/Freecharge found) */}
      <Dialog open={showLinkRequiredDialog} onOpenChange={setShowLinkRequiredDialog}>
        <DialogContent className="max-w-[85%] rounded-[1.8rem] border-0 p-6 shadow-2xl">
          <DialogHeader className="mb-4">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-3">
              <AlertCircle size={24} />
            </div>
            <DialogTitle className="text-center text-[13px] font-black uppercase tracking-tight text-red-600">Action Required</DialogTitle>
          </DialogHeader>

          <div className="text-center mb-6">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-wide leading-relaxed">
              Please first link MobiKwik/Freecharge account before purchasing tasks.
            </p>
          </div>

          <Button 
            className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
            onClick={() => router.push('/profile/link-account')}
          >
            GET UPI
          </Button>
        </DialogContent>
      </Dialog>

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
