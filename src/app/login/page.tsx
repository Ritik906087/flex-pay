
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Smartphone, Lock, ArrowRight } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Section */}
      <div className="flex flex-col items-center pt-24 pb-12 px-8 text-center">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Premium Payment Network</p>
        <div className="w-8 h-1 bg-primary/20 rounded-full mt-4"></div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 px-8 pb-10 flex flex-col">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                <Smartphone size={18} />
              </div>
              <Input 
                type="tel" 
                placeholder="Enter mobile number" 
                className="bg-gray-50 border-gray-100 rounded-2xl h-14 pl-12 text-gray-900 font-bold placeholder:font-medium placeholder:text-gray-300 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Secure Pin</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                <Lock size={18} />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="6-digit pin" 
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
            <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-wider">Reset Pin</button>
          </div>

          <Button 
            className="w-full h-15 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/15 mt-2 bg-primary hover:bg-primary/95 active:scale-[0.98] transition-all"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Login"}
            {!loading && <ArrowRight className="ml-2" size={16} />}
          </Button>
        </form>

        <div className="mt-auto pt-10 text-center">
          <Link href="/register">
            <Button variant="ghost" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-transparent hover:text-primary">
              Create New Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
