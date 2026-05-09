"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  CheckCircle2, Loader2, Copy, Clock, QrCode, 
  Upload, ArrowRight, AlertCircle, ChevronLeft, XCircle 
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

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const orderData = {
    id: searchParams.get('id') || "#ORD000",
    amount: parseInt(searchParams.get('amount') || "0"),
    profit: parseInt(searchParams.get('profit') || "0"),
    bonus: parseInt(searchParams.get('bonus') || "0"),
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      toast({ variant: "destructive", title: "Order Cancelled", description: "Time limit exceeded." });
      router.back();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, router, toast]);

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

  const handleCancelOrder = () => {
    if (!cancelReason) {
      toast({ variant: "destructive", title: "Select Reason", description: "Please provide a reason for cancellation." });
      return;
    }
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      toast({ title: "Order Cancelled", description: "The order has been successfully cancelled." });
      router.push('/orders');
    }, 1200);
  };

  const handleSubmitProof = () => {
    if (!utr || !file) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please enter UTR and upload screenshot." });
      return;
    }

    setIsSubmitting(true);
    if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);

    setTimeout(() => {
      const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
      const newOrder = {
        id: orderData.id,
        amount: orderData.amount,
        profitPercent: orderData.profit,
        bonus: orderData.bonus,
        status: 'in-review',
        utr,
        timestamp: Date.now(),
      };
      
      localStorage.setItem('flexpay_orders', JSON.stringify([newOrder, ...history]));
      
      setIsSubmitting(false);
      toast({ title: "Submitted", description: "Order under review." });
      router.push('/orders?tab=completed');

      setTimeout(() => {
        const current = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
        const updated = current.map((o: any) => 
          o.id === orderData.id ? { ...o, status: 'success' } : o
        );
        localStorage.setItem('flexpay_orders', JSON.stringify(updated));
      }, 10000);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Checkout</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{orderData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
          <Clock size={10} className="animate-pulse" />
          <span className="text-[9px] font-black">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-10 overflow-y-auto no-scrollbar">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Amount Section */}
            <div className="bg-gray-50 rounded-2xl p-5 flex justify-between items-center border border-gray-100 shadow-sm">
              <div>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Total Amount</span>
                <span className="text-2xl font-black text-gray-900">₹{orderData.amount.toLocaleString()}</span>
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-xl h-10 w-10 bg-white shadow-sm"
                onClick={() => handleCopy(orderData.amount.toString(), "Amount")}
              >
                <Copy size={16} className="text-primary" />
              </Button>
            </div>

            {/* QR/UPI Section */}
            <div className="flex flex-col items-center gap-5">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                <QrCode size={140} className="text-gray-900" />
              </div>
              
              <div className="w-full space-y-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center block">Merchant UPI ID</span>
                <div className="flex items-center justify-between bg-gray-50 px-5 py-3 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-black text-gray-900">flexpay@upi</span>
                  <button onClick={() => handleCopy("flexpay@upi", "UPI ID")} className="text-primary active:scale-90 transition-transform">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-[8px] font-black text-blue-900 uppercase mb-2">Instructions:</h4>
              <ul className="text-[9px] text-blue-900/70 space-y-1.5 font-medium leading-relaxed">
                <li className="flex gap-2.5"><ArrowRight size={10} className="mt-0.5 shrink-0 text-primary" /> Transfer exact <span className="text-primary font-bold">₹{orderData.amount}</span></li>
                <li className="flex gap-2.5"><ArrowRight size={10} className="mt-0.5 shrink-0 text-primary" /> Note the <span className="text-primary font-bold">12-digit UTR</span> number</li>
                <li className="flex gap-2.5"><ArrowRight size={10} className="mt-0.5 shrink-0 text-primary" /> Take a payment success screenshot</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 rounded-xl font-bold uppercase tracking-wider text-[9px] border-red-100 text-red-500 bg-red-50/30 hover:bg-red-50 active:scale-95 transition-all"
                  >
                    CANCEL ORDER
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[85%] rounded-[1.5rem] border-0 p-6 shadow-2xl">
                  <DialogHeader className="mb-4">
                    <div className="mx-auto w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 mb-2">
                      <XCircle size={20} />
                    </div>
                    <DialogTitle className="text-center text-[13px] font-black uppercase tracking-tight text-gray-900">Cancel Order</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Select reason for cancellation:</p>
                    <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="grid gap-2">
                      {["Wrong amount transferred", "Merchant UPI issue", "Technical error", "Changed my mind"].map((reason) => (
                        <div key={reason} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100 active:bg-gray-100 transition-colors cursor-pointer">
                          <RadioGroupItem value={reason} id={reason} className="h-4 w-4" />
                          <Label htmlFor={reason} className="text-[10px] font-bold text-gray-700 cursor-pointer flex-1">{reason}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="flex gap-2.5 pt-2">
                      <DialogClose asChild>
                        <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold text-[9px] uppercase tracking-wider">Back</Button>
                      </DialogClose>
                      <Button 
                        variant="destructive" 
                        className="flex-[2] h-11 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-red-100"
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Processing..." : "Confirm Cancel"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                className="flex-[2] h-14 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                onClick={() => setStep(2)}
              >
                I HAVE PAID
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Screenshot</label>
                <div 
                  className={cn(
                    "h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer overflow-hidden relative",
                    file ? "border-green-400 bg-green-50/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  )}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="text-[8px] font-bold text-green-600 uppercase px-3 text-center truncate max-w-[150px]">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <Upload size={24} className="text-gray-300" />
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Select Screenshot</span>
                    </div>
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
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">UTR / Reference Number</label>
                <Input 
                  placeholder="Enter 12-digit UTR number" 
                  className="h-12 bg-gray-50 border-gray-100 rounded-xl font-black text-[13px] tracking-widest placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-300"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
                <div className="flex items-start gap-2 px-1 mt-0.5">
                  <AlertCircle size={10} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[7.5px] font-bold text-amber-600 uppercase leading-tight tracking-tight">Wrong UTR leads to immediate order rejection and permanent block.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-xl font-bold uppercase tracking-wider text-[9px] border-gray-100 text-gray-400 bg-white"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-xl font-black uppercase tracking-[0.1em] text-[10px] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                disabled={isSubmitting}
                onClick={handleSubmitProof}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "SUBMIT PROOF"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
