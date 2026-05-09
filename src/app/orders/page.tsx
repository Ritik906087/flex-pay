
"use client"

import { useState, useEffect, useMemo } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { 
  Info, AlertCircle, ArrowRight, Wallet, BadgeIndianRupee, 
  CircleDollarSign, Plus, CheckCircle2, ChevronRight, Search, SlidersHorizontal
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
  { id: "#124684890", amount: 5000, profit: 6, bonus: 5 },
  { id: "#124684891", amount: 200, profit: 6, bonus: 5 },
  { id: "#124684892", amount: 1500, profit: 6, bonus: 5 },
  { id: "#124684893", amount: 300, profit: 6, bonus: 5 },
  { id: "#124684894", amount: 10000, profit: 6, bonus: 5 },
  { id: "#124684895", amount: 25000, profit: 6, bonus: 5 },
  { id: "#124684896", amount: 100000, profit: 6, bonus: 5 },
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
  
  // Filter state
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

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

  const filteredOrders = useMemo(() => {
    return MOCK_MARKET_ORDERS.filter(order => {
      const min = minAmount ? parseInt(minAmount) : 0;
      const max = maxAmount ? parseInt(maxAmount) : 100000000;
      return order.amount >= min && order.amount <= max;
    });
  }, [minAmount, maxAmount]);

  const handleBuyClick = (marketOrder: any) => {
    const pending = checkAndSetPending();
    if (pending) {
      setShowPendingDialog(true);
      return;
    }

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

  const handleAccountSelect = (account: any) => {
    if (!selectedMarketOrder) return;
    setShowAccountSelectionDialog(false);
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
      {/* Premium Header */}
      <div className="bg-white px-5 pt-8 pb-4 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-primary uppercase tracking-tight">Active Market</span>
              <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
              <span className="text-[11px] font-bold text-gray-400">FIXED: 6% + ₹5</span>
            </div>
            <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Guaranteed P2P Settlements</p>
          </div>
          <div className="bg-green-50 px-2 py-1 rounded-lg border border-green-100">
            <span className="text-[9px] font-black text-green-600 uppercase">Live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {pendingOrder && (
          <div className="px-5 mt-4">
            <button 
              onClick={() => setShowPendingDialog(true)}
              className="w-full bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between group active:bg-amber-100 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                  <AlertCircle size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Active Task Pending</p>
                  <p className="text-[11px] font-bold text-amber-900">{pendingOrder.id} • ₹{pendingOrder.amount.toLocaleString()}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        <div className="px-5 mt-5">
          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1.5 h-12 rounded-2xl border border-gray-100">
              <TabsTrigger value="upi" className="text-[10px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                <BadgeIndianRupee size={14} className="mr-2" />
                UPI+
              </TabsTrigger>
              <TabsTrigger value="usdt" className="text-[10px] font-black uppercase tracking-widest rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                <CircleDollarSign size={14} className="mr-2" />
                USDT Node
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upi" className="mt-6 space-y-4">
              {/* Ultra Compact Filter Row */}
              <div className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-xl text-gray-400 border border-gray-100">
                  <SlidersHorizontal size={12} />
                </div>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-300">MIN</span>
                    <Input 
                      type="number" 
                      placeholder="₹100" 
                      className="h-9 bg-gray-50/50 border-gray-100 rounded-xl text-[10px] font-black pl-8 pr-2 focus:bg-white transition-colors"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-300">MAX</span>
                    <Input 
                      type="number" 
                      placeholder="₹10Cr" 
                      className="h-9 bg-gray-50/50 border-gray-100 rounded-xl text-[10px] font-black pl-8 pr-2 focus:bg-white transition-colors"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Order List */}
              <div className="flex flex-col gap-3">
                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Search size={40} />
                    <p className="text-[10px] font-black mt-3 uppercase tracking-widest">No matching tasks</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm active:bg-gray-50 transition-all group">
                      <div className="flex flex-col gap-1">
                        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-tight">{order.id}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base font-black text-gray-900 tracking-tight">₹{order.amount.toLocaleString()}</span>
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                            <span className="text-[9px] font-black text-green-600 uppercase">+{order.profit}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span className="text-[8px] font-bold text-gray-400 uppercase">Bonus: ₹{order.bonus}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="h-9 px-6 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-primary/10 transition-transform active:scale-95"
                        onClick={() => handleBuyClick(order)}
                      >
                        BUY
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="usdt" className="mt-6">
              <div className="bg-white p-6 rounded-[2.2rem] border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">USDT Investment</label>
                    <span className="text-[9px] font-black text-primary">₹110 / USDT</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                      <CircleDollarSign size={20} />
                    </div>
                    <Input 
                      type="number" 
                      placeholder="Enter USDT to buy" 
                      className="h-16 bg-gray-50 border-gray-100 rounded-2xl pl-12 text-lg font-black placeholder:font-medium placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                      value={usdtAmount}
                      onChange={(e) => setUsdtAmount(e.target.value)}
                    />
                  </div>
                </div>

                {usdtAmount && parseFloat(usdtAmount) > 0 && (
                  <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 flex justify-between items-center animate-in fade-in zoom-in-95 duration-300">
                    <div>
                      <p className="text-[8px] font-bold text-primary/60 uppercase tracking-widest mb-1">Total INR Cost</p>
                      <p className="text-2xl font-black text-primary">₹{(parseFloat(usdtAmount) * USDT_RATE).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/50 p-2 rounded-xl border border-white">
                      <Info className="text-primary/40" size={16} />
                    </div>
                  </div>
                )}

                <div className="bg-amber-50/50 rounded-2xl p-4 flex gap-3.5 border border-amber-100">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                    <AlertCircle size={14} />
                  </div>
                  <p className="text-[8.5px] font-bold text-amber-700 leading-normal uppercase tracking-tight">
                    USDT Node settlements are high-priority and processed within 15 mins via TRC20 network.
                  </p>
                </div>

                <Button 
                  className="w-full h-16 rounded-2xl font-black text-[12px] uppercase tracking-[0.25em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
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

      {/* Account Selection Drawer */}
      <Dialog open={showAccountSelectionDialog} onOpenChange={setShowAccountSelectionDialog}>
        <DialogContent className="max-w-[430px] w-full rounded-t-[2.5rem] rounded-b-none border-0 p-8 shadow-2xl fixed bottom-0 top-auto translate-y-0 translate-x-[-50%] pb-12 animate-in slide-in-from-bottom duration-300">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-center text-[15px] font-black uppercase tracking-tight text-gray-900">Select Node Account</DialogTitle>
            <DialogDescription className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Choose linked terminal to proceed
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto no-scrollbar mb-6">
            {compatibleAccounts.map((acc, i) => (
              <button 
                key={i} 
                onClick={() => handleAccountSelect(acc)}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between active:bg-gray-100 transition-all text-left w-full group shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                    <Image src={acc.logo} alt={acc.appName} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-gray-900 uppercase">{acc.appName}</p>
                    <p className="text-[9px] font-bold text-gray-400 tracking-tight">{acc.upi}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-300 group-active:text-primary border border-gray-50 shadow-sm transition-colors">
                  <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Required Drawer */}
      <Dialog open={showLinkRequiredDialog} onOpenChange={setShowLinkRequiredDialog}>
        <DialogContent className="max-w-[430px] w-full rounded-t-[2.5rem] rounded-b-none border-0 p-8 shadow-2xl fixed bottom-0 top-auto translate-y-0 translate-x-[-50%] pb-12">
          <DialogHeader className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 shadow-sm">
              <AlertCircle size={32} />
            </div>
            <DialogTitle className="text-center text-[15px] font-black uppercase tracking-tight text-red-600">Access Restricted</DialogTitle>
          </DialogHeader>

          <div className="text-center mb-8 px-4">
            <p className="text-[11px] font-black text-gray-600 uppercase tracking-wide leading-relaxed">
              Your terminal must be linked with <span className="text-red-500">MobiKwik</span> or <span className="text-red-500">Freecharge</span> to authorize market transactions.
            </p>
          </div>

          <Button 
            className="w-full h-16 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-red-100 bg-red-500 hover:bg-red-600 border-0"
            onClick={() => router.push('/profile/link-account')}
          >
            LINK TERMINAL NOW
          </Button>
        </DialogContent>
      </Dialog>

      {/* Pending Order Drawer */}
      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="max-w-[430px] w-full rounded-t-[2.5rem] rounded-b-none border-0 p-8 shadow-2xl fixed bottom-0 top-auto translate-y-0 translate-x-[-50%] pb-12">
          <DialogHeader className="mb-6">
            <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4 shadow-sm">
              <AlertCircle size={32} />
            </div>
            <DialogTitle className="text-center text-[15px] font-black uppercase tracking-tight text-gray-900">Task In Progress</DialogTitle>
            <DialogDescription className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 leading-relaxed">
              One terminal task is already active. Complete or abort the existing node before initializing a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Node ID</span>
              <span className="text-[10px] font-black text-gray-900">{pendingOrder?.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Node Value</span>
              <span className="text-lg font-black text-primary">₹{pendingOrder?.amount?.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              className="w-full h-16 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
              onClick={resumePendingOrder}
            >
              RESUME TASK
            </Button>
            <Button 
              variant="ghost"
              className="w-full h-10 rounded-xl font-bold text-[10px] text-gray-400 uppercase tracking-widest"
              onClick={() => setShowPendingDialog(false)}
            >
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
