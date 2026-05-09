
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, ArrowRight, ShieldCheck, Ticket, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Block Registration with Admin Mobile
    if (mobile === "9060873927") {
      toast({ variant: "destructive", title: "Access Denied", description: "This number is reserved for system administration." });
      return;
    }

    if (mobile.length < 10) {
      toast({ variant: "destructive", title: "Invalid Mobile", description: "Please enter a valid 10-digit number." });
      return;
    }
    
    if (pin !== confirmPin) {
      toast({ variant: "destructive", title: "Pin Mismatch", description: "Secure pin and confirm pin must match." });
      return;
    }

    if (pin.length < 6) {
      toast({ variant: "destructive", title: "Pin Too Short", description: "Pin must be at least 6 digits." });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `${mobile}@flexpay.app`,
        password: pin,
        options: {
          data: {
            mobile: mobile,
            invite_code: inviteCode,
            name: `User ${mobile.slice(-4)}`
          }
        }
      });

      if (error) throw error;

      toast({ title: "Success", description: "Account created! Please login." });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not register."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex flex-col items-center pt-8 pb-2 px-8 text-center">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Join Network</p>
        <div className="w-5 h-0.5 bg-primary/20 rounded-full mt-1.5"></div>
      </div>

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
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
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
                value={pin}
                onChange={(e) => setPin(e.target.value)}
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
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
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
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="bg-gray-50 border-gray-100 rounded-xl h-11 pl-10 text-[13px] font-bold placeholder:font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="ml-2" size={14} />
                </>
              )}
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

      <div className="pb-8"></div>
    </div>
  );
}
