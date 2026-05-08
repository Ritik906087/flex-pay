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
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-8 pt-24">
      {/* Branding */}
      <div className="mb-16">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
          <span className="text-2xl font-black text-white">FP</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Login</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Premium Payment Network</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <Input 
              type="tel" 
              placeholder="Enter number" 
              className="bg-gray-50 border-gray-100 rounded-xl h-14 pl-12 text-gray-900 focus:ring-primary/20 transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pin Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="bg-gray-50 border-gray-100 rounded-xl h-14 pl-12 pr-12 text-gray-900 focus:ring-primary/20 transition-all font-medium"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end px-1">
          <Link href="#" className="text-[10px] font-bold text-primary uppercase tracking-wider">Forgot Pin?</Link>
        </div>

        <Button 
          className="w-full h-16 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10 mt-4 text-xs"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Login to Account"}
          {!loading && <ArrowRight className="ml-2" size={18} />}
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="mt-auto mb-12 text-center">
        <p className="text-xs text-gray-400 mb-4">No account yet?</p>
        <Link href="/register">
          <Button variant="outline" className="w-full h-14 rounded-xl font-bold uppercase tracking-widest border-gray-100 bg-white text-gray-500 hover:bg-gray-50 text-[10px]">
            Join the Network
          </Button>
        </Link>
      </div>
    </div>
  );
}