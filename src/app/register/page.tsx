
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, ArrowRight, ShieldCheck, Ticket, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Section */}
      <div className="flex flex-col items-center pt-12 pb-8 px-8">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-5">
          <span className="text-xl font-black text-white">FP</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">JOIN FLEXPAY</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5">Authorized Partner Access</p>
      </div>

      {/* Register Form */}
      <div className="flex-1 px-8 pb-10 flex flex-col overflow-y-auto no-scrollbar">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Contact</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Smartphone size={18} />
              </div>
              <Input 
                type="tel" 
                placeholder="Phone number" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-12 text-gray-900 font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Create Pin</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={18} />
              </div>
              <Input 
                type="password" 
                placeholder="Set 6-digit access pin" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-12 text-gray-900 font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em] placeholder:tracking-normal"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Invite Referral</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Ticket size={18} />
              </div>
              <Input 
                type="text" 
                placeholder="Referral code (Optional)" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-12 text-gray-900 font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 flex gap-3">
            <ShieldCheck className="text-primary shrink-0" size={16} />
            <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
              By proceeding, you agree to our <span className="text-primary font-bold">Trading Terms</span> and confirm you are at least 18 years of age.
            </p>
          </div>

          <Button 
            className="w-full h-15 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/15 mt-2 active:scale-[0.98] transition-all"
            disabled={loading}
          >
            {loading ? "Configuring Account..." : "Activate Partner ID"}
            {!loading && <ArrowRight className="ml-2" size={16} />}
          </Button>
        </form>

        <div className="mt-auto pt-8 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Existing User?</p>
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] px-6 py-2 border border-primary/10 rounded-full hover:bg-primary/5 active:scale-95 transition-all">
            <UserCheck size={14} />
            Access Login
          </Link>
        </div>
      </div>
    </div>
  );
}
