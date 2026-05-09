
"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  CheckCircle2, Loader2, Copy, Clock, QrCode, 
  ArrowRight, AlertCircle, ChevronLeft, XCircle, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function UsdtCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const initialized = useRef(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [txid, setTxid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const TRC20_ADDRESS = "TYv3u4PqX9Rz8Wd2mK5h7B1N4L6J0S9A3Q";

  const orderData = {
    id: searchParams.get('id') || "#USDT000",
    amount: parseInt(searchParams.get('amount') || "0"),
    usdt: searchParams.get('usdt') || "0",
    profit: parseInt(searchParams.get('profit') || "8"),
  };

  useEffect(() => {
    if (!initialized.current && orderData.id !== "#USDT000") {
      const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
      const existingIdx = history.findIndex((o: any) => o.id === orderData.id);
      
      if (existingIdx === -1) {
        const newOrder = {
          ...orderData,
          profitPercent: orderData.profit,
          bonus: 0,
          status: 'pending-payment',
          timestamp: Date.now(),
          type: 'USDT'
        };
        localStorage.setItem('flexpay_orders', JSON.stringify([newOrder, ...history]));
      }
      initialized.current = true;
    }
  }, [orderData]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleCancelOrder("Time limit exceeded");
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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

  const handleCancelOrder = (reason?: string) => {
    const r = reason || cancelReason;
    if (!r && !reason) {
      toast({ variant: "destructive", title: "Select Reason", description: "Please provide a reason for cancellation." });
      return;
    }
    setIsCancelling(true);
    setTimeout(() => {
      const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
      const updated = history.map((o: any) => 
        o.id === orderData.id ? { ...o, status: 'cancelled', cancelReason: r } : o
      );
      localStorage.setItem('flexpay_orders', JSON.stringify(updated));
      setIsCancelling(false);
      router.push('/orders');
    }, 1000);
  };

  const handleSubmitProof = () => {
    if (!txid || txid.length < 10) {
      toast({ variant: "destructive", title: "Invalid TXID", description: "Please enter a valid Transaction Hash." });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
      const updated = history.map((o: any) => 
        o.id === orderData.id ? { 
          ...o, 
          status: 'in-review', 
          txid, 
          timestamp: Date.now() 
        } : o
      );
      localStorage.setItem('flexpay_orders', JSON.stringify(updated));
      setIsSubmitting(false);
      toast({ title: "Submitted", description: "Transaction verification in progress." });
      router.push('/orders');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-5 pt-8 pb-3 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/orders')} className="p-1.5 -ml-1.5 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">USDT Checkout</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">TRC20 Network</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
          <Clock size={10} className="animate-pulse" />
          <span className="text-[9px] font-black">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-10 overflow-y-auto no-scrollbar">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Transfer Exactly</span>
                <span className="text-2xl font-black text-primary">{orderData.usdt} USDT</span>
                <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Approx: ₹{orderData.amount.toLocaleString()}</p>
              </div>
              <ShieldCheck size={32} className="text-green-500 opacity-20" />
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                <QrCode size={140} className="text-gray-900" />
              </div>
              
              <div className="w-full space-y-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center block">Wallet Address (TRC20)</span>
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-900 break-all pr-2">{TRC20_ADDRESS}</span>
                  <button onClick={() => handleCopy(TRC20_ADDRESS, "Wallet Address")} className="text-primary active:scale-90 transition-transform shrink-0">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle size={14} />
                <h4 className="text-[9px] font-black uppercase tracking-widest">Network Rules:</h4>
              </div>
              <ul className="text-[8px] text-amber-900/70 space-y-1.5 font-bold leading-relaxed uppercase tracking-tight">
                <li>• USE <span className="text-amber-600 font-black">BINANCE</span> OR <span className="text-amber-600 font-black">COINDCX</span> ONLY</li>
                <li>• NETWORK: <span className="text-amber-600 font-black">TRON (TRC20)</span></li>
                <li>• SUBMIT <span className="text-amber-600 font-black">TXID</span> AFTER SUCCESSFUL TRANSFER</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 h-14 rounded-xl font-black uppercase tracking-wider text-[9px] border-red-100 text-red-500 bg-red-50/30">CANCEL</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[85%] rounded-[1.8rem] border-0 p-6 shadow-2xl">
                  <DialogHeader className="mb-4">
                    <XCircle size={20} className="mx-auto text-red-500 mb-2" />
                    <DialogTitle className="text-center text-[13px] font-black uppercase tracking-tight text-gray-900">Cancel Order</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="grid gap-2">
                      {["Wrong network", "Exchange issue", "Technical error", "Changed mind"].map((reason) => (
                        <div key={reason} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer">
                          <RadioGroupItem value={reason} id={reason} className="h-4 w-4" />
                          <Label htmlFor={reason} className="text-[10px] font-bold text-gray-700 cursor-pointer flex-1 uppercase tracking-tight">{reason}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="flex gap-2.5 pt-2">
                      <DialogClose asChild><Button variant="outline" className="flex-1 h-11 rounded-xl font-bold text-[9px] uppercase tracking-wider">Back</Button></DialogClose>
                      <Button variant="destructive" className="flex-[2] h-11 rounded-xl font-black text-[9px] uppercase tracking-widest" onClick={() => handleCancelOrder()} disabled={isCancelling}>CONFIRM</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="flex-[2] h-14 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] shadow-xl shadow-primary/20" onClick={() => setStep(2)}>I HAVE TRANSFERRED</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-2">
              <p className="text-[9px] font-bold text-blue-900 text-center uppercase tracking-tight">
                Submit your Transaction Hash (TXID) below. Verification takes 15-30 minutes.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">TXID / Transaction Hash</label>
              <Input 
                placeholder="Paste TXID here" 
                className="h-14 bg-gray-50 border-gray-100 rounded-xl font-black text-[11px] tracking-wider placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-300 focus:bg-white transition-all"
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
              />
              <div className="flex items-start gap-2 px-1 mt-1">
                <AlertCircle size={10} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[7.5px] font-bold text-amber-600 uppercase leading-tight tracking-tight">
                  Verification is automatic. Incorrect TXID will result in order failure and account review.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-xl font-bold uppercase tracking-wider text-[9px] border-gray-100 text-gray-400 bg-white" 
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] shadow-xl shadow-primary/20" 
                disabled={isSubmitting} 
                onClick={handleSubmitProof}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "SUBMIT TXID"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
