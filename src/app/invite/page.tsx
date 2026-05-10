
"use client"

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { UserPlus, Copy, Share2, Trophy, Target, Info, Loader2, QrCode as QrIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function Invite() {
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const fetchUserUid = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Using the first 8 characters of UUID as the UID/Invite Code
          setInviteCode(user.id.slice(0, 8).toUpperCase());
        }
      } catch (error) {
        console.error("Error fetching user for invite:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserUid();
  }, []);

  const inviteLink = `${origin}/register?ref=${inviteCode}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(inviteLink)}&bgcolor=FFFFFF&color=000000&margin=10`;

  const copyToClipboard = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteLink);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "Link Copied!",
      description: "Invite link is ready to share.",
    });
  };

  const copyUid = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "UID Copied",
      description: "Your invite code has been copied.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join FlexPay',
          text: `Join my payment network and earn ₹100 bonus! Use code: ${inviteCode}`,
          url: inviteLink,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-5 border-b border-gray-100">
        <h1 className="text-lg font-black text-gray-900">Invite & Earn</h1>
        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Build your two-tier profit network</p>
      </div>

      {/* Reward Card */}
      <div className="px-5 mt-5">
        <div className="bg-primary rounded-[1.8rem] p-5 text-white shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-0.5">₹100 Bonus</h2>
            <p className="text-[9px] font-medium opacity-80 mb-5 uppercase tracking-wider">For every L1 "Complete" member</p>
            
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span className="text-[8px] font-bold opacity-60 uppercase">L1 Commission</span>
                <p className="text-base font-black mt-0.5">0.3%</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span className="text-[8px] font-bold opacity-60 uppercase">L2 Commission</span>
                <p className="text-base font-black mt-0.5">0.2%</p>
              </div>
            </div>
          </div>
          <Trophy size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12" />
        </div>
      </div>

      {/* QR Section */}
      <div className="px-5 mt-6 flex flex-col items-center">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex flex-col items-center gap-4 shadow-sm w-full max-w-[280px]">
          <div className="relative w-44 h-44 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center overflow-hidden">
            {loading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : (
              <Image 
                src={qrCodeUrl} 
                alt="Invite QR Code" 
                fill 
                className="p-3 object-contain"
                unoptimized
              />
            )}
          </div>
          
          <div className="text-center w-full">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Personal Node ID</span>
            <button 
              onClick={copyUid}
              className="w-full bg-gray-50 hover:bg-gray-100 py-3 px-4 rounded-2xl border border-dashed border-gray-200 transition-colors group"
            >
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-black text-primary tracking-[0.15em]">{loading ? "..." : inviteCode}</p>
                <Copy size={14} className="text-primary/30 group-active:text-primary transition-colors" />
              </div>
            </button>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-2">Scan to join the terminal network</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 mt-6 flex gap-3">
        <Button 
          variant="outline"
          className="flex-1 h-14 rounded-2xl font-black uppercase tracking-wider border-gray-100 bg-white text-gray-600 shadow-sm text-[9px]"
          onClick={copyToClipboard}
          disabled={loading}
        >
          <Copy className="mr-2" size={16} />
          Copy Link
        </Button>
        <Button 
          className="flex-1 h-14 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-primary/20 text-[9px]"
          onClick={handleShare}
          disabled={loading}
        >
          <Share2 className="mr-2" size={16} />
          Share Now
        </Button>
      </div>

      {/* Rules Section */}
      <div className="px-5 mt-8 space-y-4">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Network Earnings Rules</h3>
        
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 border border-blue-100">
              <span className="font-black text-xs">L1</span>
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] font-black text-gray-900 uppercase">Level 1: Direct Nodes</h4>
              <p className="text-[9px] text-gray-500 font-bold leading-relaxed mt-1 uppercase tracking-tight">
                Earn <span className="text-primary font-black">0.3% commission</span> on every buy order your direct nodes complete.
              </p>
              <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2.5">
                <Target size={14} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[8.5px] font-black text-amber-700 uppercase leading-snug tracking-tighter">
                  MILESTONE: Receive ₹100 instant bonus when your L1 node completes ₹1,000 total volume.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50"></div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 shrink-0 border border-purple-100">
              <span className="font-black text-xs">L2</span>
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] font-black text-gray-900 uppercase">Level 2: Network Growth</h4>
              <p className="text-[9px] text-gray-500 font-bold leading-relaxed mt-1 uppercase tracking-tight">
                Earn <span className="text-primary font-black">0.2% commission</span> on every order processed by your team's referrals.
              </p>
              <div className="mt-2 flex items-center gap-1.5 opacity-60">
                <Info size={12} className="text-gray-400" />
                <p className="text-[8px] font-bold text-gray-400 uppercase">Level 2 is not eligible for Milestone Bonuses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
