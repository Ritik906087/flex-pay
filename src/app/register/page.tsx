"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
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
    <div className="flex flex-col min-h-screen bg-white px-8 pt-16">
      <div className="mb-12">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
          <span className="text-2xl font-black text-white">FP</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Register</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Create your professional ID</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <Input 
              type="tel" 
              placeholder="98765 43210" 
              className="bg-gray-50 border-gray-100 rounded-xl h-14 pl-12 text-gray-900 focus:ring-primary/20 transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Set Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <Input 
              type="password" 
              placeholder="Create strong pin" 
              className="bg-gray-50 border-gray-100 rounded-xl h-14 pl-12 text-gray-900 focus:ring-primary/20 transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Invite Code</label>
          <div className="relative">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <Input 
              type="text" 
              placeholder="Optional e.g. FX9872" 
              className="bg-gray-50 border-gray-100 rounded-xl h-14 pl-12 text-gray-900 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="mt-2 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
            By joining, you agree to our <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>.
          </p>
        </div>

        <Button 
          className="w-full h-16 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10 mt-2 text-xs"
          disabled={loading}
        >
          {loading ? "Registering..." : "Activate Account"}
          {!loading && <ArrowRight className="ml-2" size={18} />}
        </Button>
      </form>

      <div className="mt-10 mb-10 text-center">
        <p className="text-xs text-gray-400 mb-2">Already have an account?</p>
        <Link href="/login" className="text-[10px] font-black text-primary uppercase tracking-widest">
          Login instead
        </Link>
      </div>
    </div>
  );
}