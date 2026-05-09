"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, CreditCard, User, 
  Smartphone, Hash, ShieldCheck, AlertCircle, RefreshCw, StopCircle, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PAYMENT_APPS = [
  { id: "paytm", name: "Paytm", color: "bg-blue-500" },
  { id: "phonepe", name: "PhonePe", color: "bg-purple-600" },
  { id: "mobikwik", name: "MobiKwik", color: "bg-blue-400" },
  { id: "freecharge", name: "Freecharge", color: "bg-orange-500" },
  { id: "airtel", name: "Airtel Pay", color: "bg-red-600" },
  { id: "slice", name: "Slice", color: "bg-indigo-700" },
  { id: "indusind", name: "IndusInd", color: "bg-red-800" },
];

export default function LinkAccount() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<"initial" | "selection" | "form" | "linked">("initial");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", mobile: "", upi: "" });
  const [linkedAccount, setLinkedAccount] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('flexpay_linked_account');
    if (saved) {
      setLinkedAccount(JSON.parse(saved));
      setStep("linked");
    }
  }, []);

  const handleLink = () => {
    if (!formData.name || !formData.mobile || !formData.upi) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required" });
      return;
    }
    const account = { ...selectedApp, ...formData };
    localStorage.setItem('flexpay_linked_account', JSON.stringify(account));
    setLinkedAccount(account);
    setStep("linked");
    toast({ title: "Success", description: "Account linked successfully" });
  };

  const handleStopSell = () => {
    setIsOnline(!isOnline);
    toast({ 
      title: isOnline ? "Stopped Selling" : "Started Selling", 
      description: isOnline ? "Your account is now offline." : "Your account is now online."
    });
  };

  const handleChangeUpi = () => {
    setStep("selection");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Linked Account</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Withdrawal & Sales</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-6">
        {step === "initial" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-gray-200 border border-gray-100 shadow-sm mb-4">
              <CreditCard size={32} />
            </div>
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1.5">No Linked UPI</h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight max-w-[200px] mb-8">
              Please link your UPI account to start receiving payments.
            </p>
            <Button 
              onClick={() => setStep("selection")}
              className="h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
            >
              GET YOUR UPI
            </Button>
          </div>
        )}

        {step === "selection" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Payment App</h3>
            <div className="flex flex-col gap-2">
              {PAYMENT_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => { setSelectedApp(app); setStep("form"); }}
                  className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between active:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-[10px]", app.color)}>
                      {app.name[0]}
                    </div>
                    <span className="text-[10px] font-black text-gray-700 uppercase">{app.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "form" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm", selectedApp.color)}>
                {selectedApp.name[0]}
              </div>
              <div>
                <h4 className="text-[11px] font-black text-gray-900 uppercase">{selectedApp.name}</h4>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Link your credentials</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <Input 
                    placeholder="Enter full name" 
                    className="h-11 bg-white border-gray-100 rounded-xl pl-10 text-[11px] font-bold placeholder:font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <Input 
                    type="tel"
                    placeholder="Enter phone number" 
                    className="h-11 bg-white border-gray-100 rounded-xl pl-10 text-[11px] font-bold placeholder:font-medium"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">UPI Address (VPA)</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <Input 
                    placeholder="example@upi" 
                    className="h-11 bg-white border-gray-100 rounded-xl pl-10 text-[11px] font-bold placeholder:font-medium"
                    value={formData.upi}
                    onChange={(e) => setFormData({...formData, upi: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100 flex gap-3">
              <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[7.5px] font-bold text-amber-700 uppercase leading-snug tracking-tight">
                Ensure the UPI ID belongs to you. Mismatch will cause withdrawal failure and account suspension.
              </p>
            </div>

            <Button 
              className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
              onClick={handleLink}
            >
              GET MY ACCOUNT
            </Button>
          </div>
        )}

        {step === "linked" && linkedAccount && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Linked Display Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg", linkedAccount.color)}>
                    {linkedAccount.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase">{linkedAccount.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isOnline ? "bg-green-500" : "bg-gray-400")}></div>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", isOnline ? "text-green-500" : "text-gray-400")}>
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
                <ShieldCheck size={28} className="text-primary opacity-20" />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Holder Name</span>
                  <p className="text-xs font-black text-gray-900 uppercase">{linkedAccount.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">UPI ID</span>
                    <p className="text-[11px] font-black text-primary tracking-tight">{linkedAccount.upi}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Mobile</span>
                    <p className="text-[11px] font-black text-gray-900">{linkedAccount.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleStopSell}
                variant={isOnline ? "outline" : "default"}
                className={cn(
                  "w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                  isOnline ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-500 hover:bg-green-600 shadow-green-100"
                )}
              >
                {isOnline ? (
                  <><StopCircle size={16} className="mr-2" /> STOP SELL</>
                ) : (
                  <><RefreshCw size={16} className="mr-2" /> START SELL</>
                )}
              </Button>
              
              <Button 
                onClick={handleChangeUpi}
                variant="ghost"
                className="w-full h-12 rounded-xl font-bold text-[9px] text-gray-400 uppercase tracking-widest hover:bg-white border border-transparent hover:border-gray-100"
              >
                CHANGE UPI ACCOUNT
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
