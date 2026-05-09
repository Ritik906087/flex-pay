
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { TrendingUp, Wallet, ShoppingBag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    const profileSub = supabase.channel('profile_sync').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchProfile()).subscribe();
    return () => { supabase.removeChannel(profileSub); };
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: orders } = await supabase.from('p2p_orders').select('*').or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(5);
      
      setProfile(data);
      setActivity(orders || []);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-10">
      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse">
        <span className="text-xl font-black text-white">FP</span>
      </div>
      <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Syncing Terminal</p>
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
                <p className="text-white/80 text-[9px] font-bold uppercase mt-1.5 tracking-widest">Instant Settlements</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[9px] font-bold opacity-80 uppercase tracking-[0.2em] block mb-1">Commission Wallet</span>
            <h2 className="text-3xl font-black tracking-tight mb-6">₹{profile?.balance?.toLocaleString() || '0'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => window.location.href='/orders'} className="bg-white/20 text-white border-0 h-10 rounded-xl font-black text-[10px] uppercase">BUY</Button>
              <Button onClick={() => window.location.href='/profile/sell'} className="bg-white text-primary h-10 rounded-xl font-black text-[10px] uppercase">SELL</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 pb-28">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-4">Recent Terminal Logs</h3>
        <div className="flex flex-col gap-2.5">
          {activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[1.5rem] border border-dashed border-gray-200 opacity-40">
              <Info size={24} className="text-gray-400 mb-2" />
              <p className="text-[9px] font-black uppercase tracking-widest">No Activity Yet</p>
            </div>
          ) : (
            activity.map((item, i) => (
              <div key={i} className="bg-white p-3.5 rounded-[1.2rem] border border-gray-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-primary"><ShoppingBag size={16} /></div>
                  <div>
                    <h4 className="text-[12px] font-black text-gray-900">{item.status.toUpperCase()}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{item.id}</p>
                  </div>
                </div>
                <div className="text-right"><span className="text-xs font-black">₹{item.amount.toLocaleString()}</span></div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
