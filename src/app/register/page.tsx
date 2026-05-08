
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, UserPlus, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
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
    <div className="flex flex-col min-h-screen gradient-bg px-8 pt-16">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Create ID</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Join the premium P2P network</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Mobile Number</label>
          <div className="relative group">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              type="tel" 
              placeholder="Enter mobile number" 
              className="bg-white/5 border-white/10 rounded-2xl py-7 pl-12 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Set Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              type="password" 
              placeholder="Create strong password" 
              className="bg-white/5 border-white/10 rounded-2xl py-7 pl-12 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Confirm Password</label>
          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              type="password" 
              placeholder="Repeat password" 
              className="bg-white/5 border-white/10 rounded-2xl py-7 pl-12 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">Invite Code (Optional)</label>
          <div className="relative group">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
            <Input 
              type="text" 
              placeholder="e.g. FX9872" 
              className="bg-white/5 border-white/10 rounded-2xl py-7 pl-12 text-white placeholder:text-white/20 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="mt-4 bg-primary/5 border border-primary/10 rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            By registering, you agree to our <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Risk Management Policy</span>.
          </p>
        </div>

        <Button 
          className="w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 ripple accent-gradient border-0 mt-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Activate Account"}
          {!loading && <ArrowRight className="ml-2" size={20} />}
        </Button>
      </form>

      <div className="mt-10 mb-10 text-center">
        <p className="text-xs text-muted-foreground mb-2">Already part of the team?</p>
        <Link href="/login" className="text-sm font-black text-primary uppercase tracking-widest">
          Return to login
        </Link>
      </div>
    </div>
  );
}
