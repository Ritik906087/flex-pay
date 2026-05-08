
"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  CheckCircle2, Loader2, Copy, Clock, QrCode, 
  Upload, ArrowRight, AlertCircle, ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Simulate admin approval
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
      <div className="px-6 pt-10 pb-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 active:scale-90 transition-transform">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">Checkout</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orderData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
          <Clock size={12} className="animate-pulse" />
          <span className="text-[10px] font-black">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-12 overflow-y-auto no-scrollbar">
        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Amount Section */}
            <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center border border-gray-100 shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total Amount</span>
                <span className="text-3xl font-black text-gray-900">₹{orderData.amount.toLocaleString()}</span>
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="rounded-2xl h-12 w-12 bg-white shadow-sm"
                onClick={() => handleCopy(orderData.amount.toString(), "Amount")}
              >
                <Copy size={18} className="text-primary" />
              </Button>
            </div>

            {/* QR/UPI Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-md">
                <QrCode size={180} className="text-gray-900" />
              </div>
              
              <div className="w-full space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">Merchant UPI ID</span>
                <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                  <span className="text-sm font-bold text-gray-900">flexpay@upi</span>
                  <button onClick={() => handleCopy("flexpay@upi", "UPI ID")} className="text-primary active:scale-90 transition-transform">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
              <h4 className="text-[10px] font-black text-blue-900 uppercase mb-3">Important Instructions:</h4>
              <ul className="text-[10px] text-blue-900/70 space-y-2.5 font-medium leading-relaxed">
                <li className="flex gap-3"><ArrowRight size={12} className="mt-0.5 shrink-0 text-primary" /> Transfer exact <span className="text-primary font-bold">₹{orderData.amount}</span> only.</li>
                <li className="flex gap-3"><ArrowRight size={12} className="mt-0.5 shrink-0 text-primary" /> Note down the <span className="text-primary font-bold">12-digit UTR</span> number.</li>
                <li className="flex gap-3"><ArrowRight size={12} className="mt-0.5 shrink-0 text-primary" /> Take a screenshot of the success page.</li>
              </ul>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.1em] text-xs shadow-xl shadow-primary/20"
              onClick={() => setStep(2)}
            >
              I HAVE PAID
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Screenshot</label>
                <div 
                  className={cn(
                    "h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer overflow-hidden relative",
                    file ? "border-green-400 bg-green-50/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  )}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 size={32} className="text-green-500" />
                      <span className="text-[10px] font-bold text-green-600 uppercase px-4 text-center">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={32} className="text-gray-300" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Screenshot</span>
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

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">UTR / Reference Number</label>
                <Input 
                  placeholder="Enter 12-digit UTR number" 
                  className="h-16 bg-gray-50 border-gray-100 rounded-2xl font-bold tracking-widest placeholder:tracking-normal placeholder:font-medium"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
                <div className="flex items-center gap-2 px-1 mt-1">
                  <AlertCircle size={14} className="text-amber-500 shrink-0" />
                  <p className="text-[9px] font-medium text-amber-600 leading-tight">Incorrect UTR leads to immediate order rejection and permanent account block.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-16 rounded-2xl font-bold uppercase tracking-wider text-[10px] border-gray-100 text-gray-400"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                className="flex-[2] h-16 rounded-2xl font-black uppercase tracking-[0.1em] text-xs shadow-xl shadow-primary/20"
                disabled={isSubmitting}
                onClick={handleSubmitProof}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "SUBMIT PROOF"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
