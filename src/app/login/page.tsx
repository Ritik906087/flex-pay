
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Smartphone, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
    <div className="flex flex-col min-h-screen gradient-bg px-8 pt-24">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-16 animate-float">
        <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)] mb-4">
          <span className="text-3xl font-black text-primary-foreground tracking-tighter">FP</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">FLEXPAY</h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-medium">Secure Payment Terminal</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Mobile Number</label>
          <div className="relative group">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              type="tel" 
              placeholder="98765 43210" 
              className="bg-white/5 border-white/10 rounded-2xl py-7 pl-12 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Security Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="bg-white/5 border-white/10 rounded-2xl py-7 pl-12 pr-12 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary transition-all"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-primary rounded-md" />
            <label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer">Remember Me</label>
          </div>
          <Link href="#" className="text-xs font-bold text-primary uppercase">Forgot Pin?</Link>
        </div>

        <Button 
          className="w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 ripple accent-gradient border-0 mt-4"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Sign In Access"}
          {!loading && <ArrowRight className="ml-2" size={20} />}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-auto mb-10 text-center">
        <p className="text-xs text-muted-foreground mb-4">Don't have a FlexPay ID?</p>
        <Link href="/register">
          <Button variant="outline" className="w-full py-7 rounded-[2rem] font-black uppercase tracking-widest border-white/10 bg-white/5 text-white hover:bg-white/10">
            Create New Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
