
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Smartphone, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Section / Brand */}
      <div className="flex flex-col items-center pt-16 pb-10 px-8">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-5">
          <span className="text-xl font-black text-white">FP</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">WELCOME BACK</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5">Premium Payment Network</p>
      </div>

      {/* Auth Form */}
      <div className="flex-1 px-8 pb-10 flex flex-col">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                <Smartphone size={18} />
              </div>
              <Input 
                type="tel" 
                placeholder="Enter registered number" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-12 text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Secure Pin</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                <Lock size={18} />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter 6-digit pin" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-12 pr-12 text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.3em] placeholder:tracking-normal"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end px-1">
            <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-wider">Reset Account Pin</button>
          </div>

          <Button 
            className="w-full h-15 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/15 mt-2 bg-primary hover:bg-primary/95 active:scale-[0.98] transition-all"
            disabled={loading}
          >
            {loading ? "Verifying Credentials..." : "Login to Workspace"}
            {!loading && <ArrowRight className="ml-2" size={16} />}
          </Button>
        </form>

        <div className="mt-auto pt-10 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">New to the Network?</p>
          <Link href="/register">
            <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-[0.15em] border-gray-100 text-gray-600 hover:bg-gray-50 text-[10px] active:scale-[0.98] transition-all">
              Create Partner ID
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
