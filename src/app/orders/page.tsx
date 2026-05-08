
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [activeTab, setActiveTab] = useState("available");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<Order[]>([]);
  const { toast } = useToast();

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('flexpay_orders');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Timer logic
  useEffect(() => {
    if (!selectedOrder || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [selectedOrder, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  const startOrder = (marketOrder: any) => {
    setSelectedOrder({
      ...marketOrder,
      status: 'available',
      timestamp: Date.now()
    });
    setStep(1);
    setTimeLeft(1800);
    setUtr("");
    setFile(null);
  };

  const handleSubmitProof = () => {
    if (!utr || !file) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please enter UTR and upload screenshot." });
      return;
    }

    setIsSubmitting(true);
    if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);

    setTimeout(() => {
      const newOrder: Order = {
        ...selectedOrder!,
        status: 'in-review',
        utr,
        timestamp: Date.now(),
      };
      
      const updatedHistory = [newOrder, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('flexpay_orders', JSON.stringify(updatedHistory));
      
      setIsSubmitting(false);
      setSelectedOrder(null);
      setActiveTab("completed");
      
      toast({
        title: "Order Submitted",
        description: "Your payment is under review. Usually takes 30 mins.",
      });

      // Simulate Admin Approval after 10 seconds for demo
      setTimeout(() => {
        handleAdminApproval(newOrder.id);
      }, 10000);
    }, 1500);
  };

  const handleAdminApproval = (orderId: string) => {
    setHistory(current => {
      const updated = current.map(o => 
        o.id === orderId ? { ...o, status: 'success' as OrderStatus } : o
      );
      localStorage.setItem('flexpay_orders', JSON.stringify(updated));
      return updated;
    });
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

      {/* Payment Sheet */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[420px] p-0 rounded-t-[2rem] sm:rounded-[2rem] border-none">
          <div className="bg-white px-6 pt-6 pb-8 overflow-hidden rounded-t-[2rem] sm:rounded-[2rem]">
            <DialogHeader className="mb-6 flex flex-row justify-between items-center space-y-0">
              <DialogTitle className="text-lg font-black text-gray-900 uppercase tracking-tight">
                Order {selectedOrder?.id}
              </DialogTitle>
              <div className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <Clock size={12} />
                <span className="text-[10px] font-black">{formatTime(timeLeft)}</span>
              </div>
            </DialogHeader>

            {step === 1 ? (
              <div className="space-y-6">
                {/* Amount Display */}
                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Amount</span>
                    <span className="text-2xl font-black text-gray-900">₹{selectedOrder?.amount.toLocaleString()}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(selectedOrder?.amount.toString() || "", "Amount")}>
                    <Copy size={16} className="text-primary" />
                  </Button>
                </div>

                {/* QR Section */}
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                    <QrCode size={140} className="text-gray-900" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Scan to pay via UPI</p>
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-900">flexpay@upi</span>
                      <button onClick={() => handleCopy("flexpay@upi", "UPI ID")} className="p-1 hover:bg-gray-100 rounded">
                        <Copy size={14} className="text-primary" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-[10px] font-black text-blue-900 uppercase mb-2">Instructions:</h4>
                  <ul className="text-[9px] text-blue-900/70 space-y-1.5 font-medium">
                    <li className="flex gap-2"><ArrowRight size={10} className="mt-0.5 shrink-0" /> Transfer the exact amount shown above.</li>
                    <li className="flex gap-2"><ArrowRight size={10} className="mt-0.5 shrink-0" /> Copy and keep your 12-digit UTR/Ref number.</li>
                    <li className="flex gap-2"><ArrowRight size={10} className="mt-0.5 shrink-0" /> Take a screenshot of successful payment.</li>
                  </ul>
                </div>

                <Button 
                  className="w-full h-14 rounded-xl font-black uppercase tracking-[0.1em] text-xs shadow-lg shadow-primary/20"
                  onClick={() => setStep(2)}
                >
                  I HAVE PAID
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Screenshot</label>
                    <div 
                      className={cn(
                        "h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden relative",
                        file ? "border-green-400 bg-green-50/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      )}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      {file ? (
                        <>
                          <CheckCircle2 size={24} className="text-green-500" />
                          <span className="text-[10px] font-bold text-green-600 uppercase">{file.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} className="text-gray-300" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Select Payment Screenshot</span>
                        </>
                      )}
                      <input 
                        id="file-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">UTR / Ref Number</label>
                    <Input 
                      placeholder="Enter 12-digit UTR number" 
                      className="h-14 bg-gray-50 border-gray-100 rounded-xl font-medium"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                    />
                    <div className="flex items-center gap-1.5 px-1 mt-1">
                      <AlertCircle size={10} className="text-amber-500" />
                      <p className="text-[8px] font-medium text-amber-600">Double check UTR. Wrong number leads to rejection.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 rounded-xl font-bold uppercase tracking-wider text-[10px] border-gray-100"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-[2] h-14 rounded-xl font-black uppercase tracking-[0.1em] text-xs shadow-lg shadow-primary/20"
                    disabled={isSubmitting}
                    onClick={handleSubmitProof}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "SUBMIT PROOF"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
