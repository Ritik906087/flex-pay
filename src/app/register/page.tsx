"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, ArrowRight, ShieldCheck, Ticket, UserCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Top Section - Minimalist */}
      <div className="flex flex-col items-center pt-8 pb-2 px-8 text-center">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Join Network</p>
        <div className="w-5 h-0.5 bg-primary/20 rounded-full mt-1.5"></div>
      </div>

      {/* Register Form - Compact & Single Page */}
      <div className="flex-1 px-8 flex flex-col justify-center max-w-sm mx-auto w-full">
        <form onSubmit={handleRegister} className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Smartphone size={14} />
              </div>
              <Input 
                type="tel" 
                placeholder="Phone number" 
                className="bg-gray-50 border-gray-100 rounded-xl h-11 pl-10 text-[13px] font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Create Pin</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={14} />
              </div>
              <Input 
                type={showPin ? "text" : "password"} 
                placeholder="6-digit pin" 
                className="bg-gray-50 border-gray-100 rounded-xl h-11 pl-10 pr-10 text-[13px] font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em] placeholder:tracking-normal"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Pin</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={14} />
              </div>
              <Input 
                type={showPin ? "text" : "password"} 
                placeholder="Repeat pin" 
                className="bg-gray-50 border-gray-100 rounded-xl h-11 pl-10 text-[13px] font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em] placeholder:tracking-normal"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Invite Code</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Ticket size={14} />
              </div>
              <Input 
                type="text" 
                placeholder="Optional code" 
                className="bg-gray-50 border-gray-100 rounded-xl h-11 pl-10 text-[13px] font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

          {/* Legal Small Text */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-2 flex gap-2">
            <ShieldCheck className="text-primary shrink-0" size={12} />
            <p className="text-[7px] text-gray-500 font-medium leading-tight uppercase tracking-tight">
              By registering, you agree to our <span className="text-primary font-bold">Terms</span> and policy.
            </p>
          </div>

          <div className="pt-1 space-y-2.5">
            <Button 
              className="w-full h-11 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
              {!loading && <ArrowRight className="ml-2" size={14} />}
            </Button>

            <Link href="/login" className="block text-center">
              <button 
                type="button"
                className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
              >
                Already have an account? <span className="text-primary font-black ml-1">Login</span>
              </button>
            </Link>
          </div>
        </form>
      </div>

      {/* Bottom Spacer to prevent scrolling */}
      <div className="pb-8"></div>
    </div>
  );
}
