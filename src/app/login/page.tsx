"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Smartphone, Lock, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Top Section - Minimalist */}
      <div className="flex flex-col items-center pt-8 pb-2 px-8 text-center">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Secure Access</p>
        <div className="w-5 h-0.5 bg-primary/20 rounded-full mt-1.5"></div>
      </div>

      {/* Auth Form - Compact & Single Page */}
      <div className="flex-1 px-8 flex flex-col justify-center max-w-sm mx-auto w-full">
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                <Smartphone size={14} />
              </div>
              <Input 
                type="tel" 
                placeholder="Enter mobile number" 
                className="bg-gray-50 border-gray-100 rounded-xl h-11 pl-10 text-[13px] font-bold placeholder:font-medium placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Secure Pin</label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                <Lock size={14} />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="6-digit pin" 
                className="bg-gray-50 border-gray-100 rounded-xl h-11 pl-10 pr-10 text-[13px] font-bold placeholder:font-medium placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.3em] placeholder:tracking-normal"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end px-1">
            <button type="button" className="text-[8px] font-bold text-primary uppercase tracking-wider hover:opacity-70">Forgot Pin?</button>
          </div>

          <div className="pt-2 space-y-2.5">
            <Button 
              className="w-full h-11 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/10 bg-primary hover:bg-primary/95 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login"}
              {!loading && <ArrowRight className="ml-2" size={14} />}
            </Button>

            <Link href="/register" className="block">
              <Button 
                variant="outline"
                type="button"
                className="w-full h-11 rounded-xl font-bold uppercase tracking-[0.1em] text-[10px] border-gray-100 text-gray-500 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <UserPlus className="mr-2" size={14} />
                Create Account
              </Button>
            </Link>
          </div>
        </form>
      </div>

      {/* Bottom Spacer to prevent scrolling */}
      <div className="pb-8"></div>
    </div>
  );
}
