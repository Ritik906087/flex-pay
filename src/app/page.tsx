
"use client"

import { useState, useEffect, useRef } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { TrendingUp, Wallet, ShoppingBag, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { supabase } from "@/lib/supabase";
import { SecurityEngine } from "@/lib/security-engine";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState("Initializing...");
  const [displayUid, setDisplayUid] = useState("...");

  useEffect(() => {
    let profileSub: any = null;

    const initialize = async () => {
      try {
        setSyncStatus("Checking Auth...");
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push('/login');
          return;
        }

        setDisplayUid(user.id.slice(0, 8).toUpperCase());

        // Perform Device Intelligence Audit
        setSyncStatus("Security Audit...");
        await SecurityEngine.captureAll(user.id);

        setSyncStatus("Syncing Terminal...");
        await fetchProfile(user.id);
        
        setSyncStatus("Terminal Ready");
        setLoading(false);

        const channelName = `profile_sync_${user.id}`;
        profileSub = supabase.channel(channelName)
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, 
            () => fetchProfile(user.id)
          )
          .subscribe();

      } catch (err) {
        console.error("Initialization error:", err);
        setLoading(false);
      }
    };

    initialize();

    return () => { 
      if (profileSub) supabase.removeChannel(profileSub);
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
      const { data: orders } = await supabase.from('p2p_orders').select('*').or(`buyer_id.eq.${userId},seller_id.eq.${userId}`).order('created_at', { ascending: false }).limit(5);
      
      if (profileData) setProfile(profileData);
      if (orders) setActivity(orders);
    } catch (err) {
      console.error("Fetch data error:", err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-10">
      <div className="w-14 h-14 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl mb-6 animate-float">
        <span className="text-2xl font-black text-white">FP</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-900 text-[11px] font-black tracking-[0.2em] uppercase">Syncing Terminal</p>
        <div className="flex items-center gap-2">
          <Loader2 size={12} className="animate-spin text-primary/40" />
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{syncStatus}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <div className="pt-4 px-3 bg-white pb-5 border-b border-gray-100">
        <div className="overflow-x-auto no-scrollbar flex gap-3">
          {PlaceHolderImages.filter(img => img.id.startsWith('banner-')).map((banner) => (
            <div key={banner.id} className="min-w-[280px] h-36 rounded-[1.5rem] overflow-hidden relative shadow-sm">
              <Image src={banner.imageUrl} alt={banner.description} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-5 flex flex-col justify-center">
                <h4 className="text-white font-extrabold text-lg leading-tight">Secure P2P<br/>Trading</h4>
                <p className="text-white/80 text-[9px] font-bold uppercase mt-1.5 tracking-widest">Sentinel Guard Active</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[9px] font-black opacity-80 uppercase tracking-[0.2em] block mb-1">Commission Wallet</span>
            <h2 className="text-3xl font-black tracking-tight mb-6">₹{Number(profile?.balance || 0).toLocaleString()}</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => router.push('/orders')} className="bg-white/20 hover:bg-white/30 text-white border-0 h-10 rounded-xl font-black text-[10px] uppercase">BUY</Button>
              <Button onClick={() => router.push('/profile/sell')} className="bg-white hover:bg-gray-50 text-primary h-10 rounded-xl font-black text-[10px] uppercase shadow-lg">SELL</Button>
            </div>
          </div>
          <Wallet size={120} className="absolute -bottom-6 -right-6 opacity-10 rotate-12" />
        </div>
      </div>

      <div className="px-4 mt-6 pb-28">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Terminal Logs</h3>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-gray-400 uppercase">ID: {displayUid}</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2.5">
          {activity.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-[1.5rem] border border-gray-100 flex justify-between items-center shadow-sm active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm", item.status === 'success' ? "bg-green-50 text-green-500" : "bg-gray-50 text-primary")}>
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{item.status.replace('-', ' ')}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{item.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={cn("text-xs font-black", item.status === 'success' ? "text-green-600" : "text-gray-900")}>₹{item.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
