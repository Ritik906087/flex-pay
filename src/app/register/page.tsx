
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Section */}
      <div className="flex flex-col items-center pt-16 pb-6 px-8 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Join Network</p>
        <div className="w-6 h-1 bg-primary/20 rounded-full mt-3"></div>
      </div>

      {/* Register Form */}
      <div className="flex-1 px-8 pb-10 flex flex-col max-w-sm mx-auto w-full">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Smartphone size={16} />
              </div>
              <Input 
                type="tel" 
                placeholder="Phone number" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-11 text-sm font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Create Pin</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={16} />
                </div>
                <Input 
                  type={showPin ? "text" : "password"} 
                  placeholder="6-digit pin" 
                  className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-11 pr-11 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em] placeholder:tracking-normal"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Pin</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={16} />
                </div>
                <Input 
                  type={showPin ? "text" : "password"} 
                  placeholder="Repeat pin" 
                  className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-11 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em] placeholder:tracking-normal"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Invite Code</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Ticket size={16} />
              </div>
              <Input 
                type="text" 
                placeholder="Referral code (Optional)" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-11 text-sm font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 flex gap-3">
            <ShieldCheck className="text-primary shrink-0" size={16} />
            <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
              By registering, you agree to our <span className="text-primary font-bold">Trading Terms</span> and privacy policy.
            </p>
          </div>

          <div className="pt-2 space-y-4">
            <Button 
              className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
              {!loading && <ArrowRight className="ml-2" size={14} />}
            </Button>

            <Link href="/login" className="block">
              <Button 
                variant="outline"
                type="button"
                className="w-full h-14 rounded-2xl font-bold uppercase tracking-[0.1em] text-[10px] border-gray-100 text-gray-500 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <UserCheck className="mr-2" size={14} />
                Already have account? Login
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
