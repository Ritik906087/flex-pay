
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Smartphone, Lock, ArrowRight, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // Admin bypass needs to still create a real Supabase session for RLS to work
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${mobile}@flexpay.app`,
        password: pin,
      });

      if (error) {
        // If it's the admin hardcoded login, and auth fails, it might be the first time
        if (mobile === "9060873927" && pin === "Gulshan@9060") {
          toast({ variant: "destructive", title: "Admin Auth Required", description: "Please register this admin number first to enable database access." });
          setLoading(false);
          return;
        }
        throw error;
      }

      // Check if user is admin in the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      localStorage.setItem('is_admin', profile?.is_admin ? 'true' : 'false');
      localStorage.setItem('flexpay_user_id', data.user.id);
      localStorage.setItem('flexpay_user_mobile', mobile);
      
      toast({ title: "Login Success", description: "Verified successfully." });
      
      if (profile?.is_admin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: error.message || "Invalid credentials."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex flex-col items-center pt-8 pb-2 px-8 text-center">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Secure Access</p>
        <div className="w-5 h-0.5 bg-primary/20 rounded-full mt-1.5"></div>
      </div>

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
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
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
                placeholder="Secure pin" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="ml-2" size={14} />
                </>
              )}
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

      <div className="pb-8"></div>
    </div>
  );
}
