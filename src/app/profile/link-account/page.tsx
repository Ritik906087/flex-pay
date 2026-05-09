"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, CreditCard, User, 
  Smartphone, Hash, ShieldCheck, AlertCircle, RefreshCw, StopCircle, ChevronRight, Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PAYMENT_APPS = [
  { 
    id: "paytm", 
    name: "Paytm", 
    logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(5).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDUpLnBuZyIsImlhdCI6MTc3NTE0ODYzMiwiZXhwIjoxODA2Njg0NjMyfQ.QXSbgSLV3ULTcV3ss9Co9ZMe1oj3tb9bR_OP8xY-Nds" 
  },
  { 
    id: "phonepe", 
    name: "PhonePe", 
    logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(4).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDQpLnBuZyIsImlhdCI6MTc3NTE0ODYyMSwiZXhwIjoxODA2Njg0NjIxfQ.b_cMHhiCw52krGt2edtt1k5C1Keo8uGJwYIWpe6vZVo" 
  },
  { 
    id: "mobikwik", 
    name: "MobiKwik", 
    logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDEpLnBuZyIsImlhdCI6MTc3NTE0ODU3MywiZXhwIjoxODA2Njg0NTczfQ.m8Z7gn5FV-0ss58kTEUZ833u8Wv_bFun3YZeZtyIa9s" 
  },
  { 
    id: "airtel", 
    name: "Airtel Pay", 
    logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(2).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDIpLnBuZyIsImlhdCI6MTc3NTE0ODU5OSwiZXhwIjoxODA2Njg0NTk5fQ.yDb5CBUsF_MCejlDIzrQVjg6IMylJbAzEmHFaozfNjE" 
  },
  { 
    id: "freecharge", 
    name: "Freecharge", 
    logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDMpLnBuZyIsImlhdCI6MTc3NTE0ODYwOSwiZXhwIjoxODA2Njg0NjA5fQ.pus8pOlgEXCFb2pjIzNsVtU9DxnIxEeaVaeR3TuIQPc" 
  },
];

interface Account {
  id: string;
  name: string;
  mobile: string;
  upi: string;
  logo: string;
  appName: string;
  isOnline: boolean;
  linkedAt: number;
}

export default function LinkAccount() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<"initial" | "selection" | "form" | "linked">("initial");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", mobile: "", upi: "" });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('flexpay_linked_accounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAccounts(parsed);
      if (parsed.length > 0) setStep("linked");
    }
  }, []);

  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('flexpay_linked_accounts', JSON.stringify(newAccounts));
    if (newAccounts.length === 0) setStep("initial");
  };

  const handleLink = () => {
    if (!formData.name || !formData.mobile || !formData.upi) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required" });
      return;
    }

    // Duplicate check
    const isDuplicate = accounts.some(acc => acc.upi.toLowerCase() === formData.upi.toLowerCase() && acc.id !== editingId);
    if (isDuplicate) {
      toast({ variant: "destructive", title: "Duplicate UPI", description: "Already linked, please change your UPI" });
      return;
    }

    if (editingId) {
      const updated = accounts.map(acc => 
        acc.id === editingId ? { ...acc, ...formData } : acc
      );
      saveAccounts(updated);
      setEditingId(null);
      toast({ title: "Success", description: "Account updated successfully" });
    } else {
      const newAccount: Account = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        appName: selectedApp.name,
        logo: selectedApp.logo,
        isOnline: true,
        linkedAt: Date.now()
      };
      saveAccounts([...accounts, newAccount]);
      toast({ title: "Success", description: "Account linked successfully" });
    }

    setFormData({ name: "", mobile: "", upi: "" });
    setStep("linked");
  };

  const toggleStatus = (id: string) => {
    const updated = accounts.map(acc => 
      acc.id === id ? { ...acc, isOnline: !acc.isOnline } : acc
    );
    saveAccounts(updated);
    const acc = updated.find(a => a.id === id);
    toast({ 
      title: acc?.isOnline ? "Started Selling" : "Stopped Selling", 
      description: acc?.isOnline ? "Account is now online." : "Account is now offline."
    });
  };

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setFormData({ name: account.name, mobile: account.mobile, upi: account.upi });
    setSelectedApp(PAYMENT_APPS.find(a => a.name === account.appName));
    setStep("form");
  };

  const handleDelete = (id: string) => {
    const updated = accounts.filter(acc => acc.id !== id);
    saveAccounts(updated);
    toast({ title: "Removed", description: "Account removed successfully" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Compact Header */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1 -ml-1 active:scale-90 transition-transform">
              <ChevronLeft size={18} className="text-gray-900" />
            </button>
            <div>
              <h1 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">Linked Accounts</h1>
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Withdrawal & Sales</p>
            </div>
          </div>
          {step === "linked" && (
            <button 
              onClick={() => {
                setEditingId(null);
                setFormData({ name: "", mobile: "", upi: "" });
                setStep("selection");
              }}
              className="flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-lg text-primary active:scale-95 transition-all"
            >
              <Plus size={10} strokeWidth={3} />
              <span className="text-[8px] font-black uppercase">Add New</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-5 py-4">
        {step === "initial" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-gray-200 border border-gray-100 shadow-sm mb-4">
              <CreditCard size={28} />
            </div>
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">No Linked Account</h3>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight max-w-[180px] mb-6">
              Please link your account to start receiving payments.
            </p>
            <Button 
              onClick={() => setStep("selection")}
              className="h-10 px-8 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10"
            >
              GET YOUR UPI
            </Button>
          </div>
        )}

        {step === "selection" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Payment App</h3>
            <div className="flex flex-col gap-1.5">
              {PAYMENT_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => { setSelectedApp(app); setStep("form"); }}
                  className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between active:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 relative rounded-lg overflow-hidden border border-gray-50">
                      <Image src={app.logo} alt={app.name} fill className="object-cover" />
                    </div>
                    <span className="text-[9px] font-black text-gray-700 uppercase">{app.name}</span>
                  </div>
                  <ChevronRight size={12} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "form" && selectedApp && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-9 h-9 relative rounded-xl overflow-hidden border border-gray-50">
                <Image src={selectedApp.logo} alt={selectedApp.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-900 uppercase">{selectedApp.name}</h4>
                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Link your credentials</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[7px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <Input 
                    placeholder="Enter full name" 
                    className="h-10 bg-white border-gray-100 rounded-xl pl-9 text-[10px] font-bold placeholder:font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[7px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <Input 
                    type="tel"
                    placeholder="Enter phone number" 
                    className="h-10 bg-white border-gray-100 rounded-xl pl-9 text-[10px] font-bold placeholder:font-medium"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[7px] font-bold text-gray-400 uppercase tracking-widest ml-1">UPI Address (VPA)</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                  <Input 
                    placeholder="example@upi" 
                    className="h-10 bg-white border-gray-100 rounded-xl pl-9 text-[10px] font-bold placeholder:font-medium"
                    value={formData.upi}
                    onChange={(e) => setFormData({...formData, upi: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-2.5">
              <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[7px] font-bold text-amber-700 uppercase leading-snug tracking-tight">
                Ensure details belong to you. Mismatch will cause withdrawal failure and suspension.
              </p>
            </div>

            <Button 
              className="w-full h-11 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10"
              onClick={handleLink}
            >
              {editingId ? "UPDATE ACCOUNT" : "GET MY ACCOUNT"}
            </Button>
          </div>
        )}

        {step === "linked" && accounts.length > 0 && (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-white rounded-[1.2rem] border border-gray-100 p-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 relative rounded-lg overflow-hidden border border-gray-50">
                      <Image src={acc.logo} alt={acc.appName} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-gray-900 uppercase">{acc.appName}</h3>
                      <div className="flex items-center gap-1">
                        <div className={cn("w-1 h-1 rounded-full", acc.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400")}></div>
                        <span className={cn("text-[7px] font-black uppercase tracking-widest", acc.isOnline ? "text-green-500" : "text-gray-400")}>
                          {acc.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(acc.id)} className="p-1.5 text-gray-300 hover:text-red-500 active:scale-90 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-2 mb-4">
                  <div>
                    <span className="text-[6px] font-bold text-gray-400 uppercase tracking-widest block">Holder</span>
                    <p className="text-[9px] font-black text-gray-900 uppercase truncate pr-2">{acc.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[6px] font-bold text-gray-400 uppercase tracking-widest block">Mobile</span>
                    <p className="text-[9px] font-black text-gray-900">{acc.mobile}</p>
                  </div>
                  <div className="col-span-2 mt-1">
                    <span className="text-[6px] font-bold text-gray-400 uppercase tracking-widest block">UPI ID</span>
                    <p className="text-[9px] font-black text-primary tracking-tight">{acc.upi}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => toggleStatus(acc.id)}
                    variant="outline"
                    className={cn(
                      "flex-1 h-8 rounded-lg font-black text-[7px] uppercase tracking-wider transition-all",
                      acc.isOnline ? "border-red-50 bg-red-50 text-red-500" : "bg-green-500 text-white border-0"
                    )}
                  >
                    {acc.isOnline ? (
                      <><StopCircle size={10} className="mr-1.5" /> STOP SELL</>
                    ) : (
                      <><RefreshCw size={10} className="mr-1.5" /> START SELL</>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => handleEdit(acc)}
                    variant="ghost"
                    className="flex-1 h-8 rounded-lg font-bold text-[7px] text-gray-400 uppercase tracking-wider border border-gray-100 bg-gray-50/50"
                  >
                    CHANGE UPI
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
