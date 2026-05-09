
"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  CheckCircle2, Loader2, Copy, Clock, QrCode, 
  Upload, ArrowRight, AlertCircle, ChevronLeft, XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { P2PEngine, P2POrder } from "@/lib/p2p-engine";
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
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<P2POrder | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadOrder();
    const handleUpdate = () => loadOrder();
    window.addEventListener('p2p_order_update', handleUpdate);
    return () => window.removeEventListener('p2p_order_update', handleUpdate);
  }, [orderId]);

  const loadOrder = () => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const found = history.find((o: P2POrder) => o.id === orderId);
    if (found) {
      setOrder(found);
      const remaining = Math.max(0, Math.floor((found.expiryTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (found.status === 'success') {
        toast({ title: "Order Success!", description: "Commission credited." });
        router.push('/profile/history');
      }
    } else {
      router.push('/orders');
    }
  };

  useEffect(() => {
    if (timeLeft <= 0 && order?.status === 'pending-payment') {
      P2PEngine.cancelOrder(orderId!, "Time limit exceeded");
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, order]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard." });
  };

  const handleSubmitProof = () => {
    if (!utr || !file) {
      toast({ variant: "destructive", title: "Error", description: "UTR and Screenshot required." });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
      const updated = history.map((o: P2POrder) => 
        o.id === orderId ? { ...o, status: 'in-review', utr, timestamp: Date.now() } : o
      );
      localStorage.setItem('flexpay_orders', JSON.stringify(updated));
      setIsSubmitting(false);
      window.dispatchEvent(new CustomEvent('p2p_order_update'));
      toast({ title: "Submitted", description: "Proof is under review." });
      router.push('/profile/history');
    }, 1500);
  };

  if (!order) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="px-5 pt-8 pb-3 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/orders')}><ChevronLeft size={20} /></button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">P2P Settlement</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase">{order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
          <Clock size={10} className="animate-pulse" />
          <span className="text-[9px] font-black">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-10 overflow-y-auto no-scrollbar">
        {step === 1 ? (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[8px] font-bold text-gray-400 uppercase block mb-0.5">Transfer Exactly</span>
                <span className="text-2xl font-black text-gray-900">₹{order.amount.toLocaleString()}</span>
              </div>
              <Button variant="secondary" size="icon" className="bg-white" onClick={() => handleCopy(order.amount.toString())}>
                <Copy size={16} />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <QrCode size={140} />
              </div>
              
              <div className="w-full space-y-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase text-center block">Merchant VPA</span>
                <div className="flex items-center justify-between bg-gray-50 px-5 py-3 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-black text-primary">{order.sellerUpi}</span>
                  <button onClick={() => handleCopy(order.sellerUpi)} className="text-primary"><Copy size={16}/></button>
                </div>
                <p className="text-[8px] font-bold text-gray-400 text-center uppercase">Verified Name: {order.sellerName}</p>
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <ul className="text-[8.5px] text-blue-900 font-bold space-y-2 uppercase leading-relaxed">
                <li>• Send exact amount to avoid matching issues</li>
                <li>• Take screenshot after success</li>
                <li>• Do not refresh or close until proof submitted</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-xl font-black uppercase tracking-wider text-[9px] border-red-100 text-red-500 bg-red-50/30"
                onClick={() => P2PEngine.cancelOrder(order.id, "User Cancelled")}
              >
                CANCEL
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-xl font-black uppercase tracking-[0.1em] text-[10px]"
                onClick={() => setStep(2)}
              >
                I HAVE PAID
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Screenshot Proof</label>
                <div 
                  className={cn(
                    "h-44 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer",
                    file ? "border-green-400 bg-green-50/20" : "border-gray-200 bg-gray-50"
                  )}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {file ? <CheckCircle2 className="text-green-500" size={24} /> : <Upload size={24} className="text-gray-300" />}
                  <span className="text-[8px] font-bold text-gray-400 uppercase">{file ? file.name : "Select Screenshot"}</span>
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">12-Digit UTR</label>
                <Input 
                  placeholder="Enter Reference Number" 
                  className="h-12 bg-gray-50 border-gray-100 rounded-xl font-black text-[13px] tracking-widest"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-14 rounded-xl font-bold uppercase text-[9px]" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-[2] h-14 rounded-xl font-black uppercase text-[10px]" onClick={handleSubmitProof} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "SUBMIT PROOF"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
