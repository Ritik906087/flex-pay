
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
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Top Section */}
      <div className="flex flex-col items-center pt-8 pb-3 px-8 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Join Network</p>
        <div className="w-6 h-1 bg-primary/20 rounded-full mt-2"></div>
      </div>

      {/* Register Form */}
      <div className="flex-1 px-8 pb-4 flex flex-col max-w-sm mx-auto w-full">
        <form onSubmit={handleRegister} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Smartphone size={16} />
              </div>
              <Input 
                type="tel" 
                placeholder="Phone number" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-12 pl-11 text-sm font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Create Pin</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={14} />
                </div>
                <Input 
                  type={showPin ? "text" : "password"} 
                  placeholder="Pin" 
                  className="bg-gray-50 border-gray-100 rounded-2xl h-12 pl-9 pr-8 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em] placeholder:tracking-normal"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Pin</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={14} />
                </div>
                <Input 
                  type={showPin ? "text" : "password"} 
                  placeholder="Repeat" 
                  className="bg-gray-50 border-gray-100 rounded-2xl h-12 pl-9 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em] placeholder:tracking-normal"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Invite Code</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Ticket size={16} />
              </div>
              <Input 
                type="text" 
                placeholder="Optional code" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-12 pl-11 text-sm font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-2.5 flex gap-2">
            <ShieldCheck className="text-primary shrink-0" size={14} />
            <p className="text-[8px] text-gray-500 font-medium leading-tight">
              By registering, you agree to our <span className="text-primary font-bold">Terms</span> and policy.
            </p>
          </div>

          <div className="pt-1 space-y-3">
            <Button 
              className="w-full h-12 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
              {!loading && <ArrowRight className="ml-2" size={14} />}
            </Button>

            <Link href="/login" className="block">
              <Button 
                variant="outline"
                type="button"
                className="w-full h-12 rounded-2xl font-bold uppercase tracking-[0.1em] text-[10px] border-gray-100 text-gray-500 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <UserCheck className="mr-2" size={14} />
                Login
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
