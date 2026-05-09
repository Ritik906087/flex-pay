"use client"

import { BottomNav } from "@/components/bottom-nav";
import { UserPlus, Copy, Share2, Users, Trophy, QrCode, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Invite() {
  const { toast } = useToast();
  const inviteCode = "FLEX123456";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://flexpay.app/register?ref=${inviteCode}`);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "Success",
      description: "Invite link copied to clipboard.",
    });
  };

  const copyUid = () => {
    navigator.clipboard.writeText(inviteCode);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "Copied",
      description: "UID copied to clipboard.",
    });
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
        <button 
          onClick={copyUid}
          className="bg-white p-5 rounded-[1.8rem] border border-gray-100 flex flex-col items-center gap-3 shadow-sm w-full max-w-[240px] active:scale-[0.98] transition-all group"
        >
          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100 group-active:bg-gray-100 transition-colors">
            <QrCode size={120} className="text-gray-900" />
          </div>
          <div className="text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 block">Your Invite Code (UID)</span>
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg font-black text-primary tracking-[0.1em]">{inviteCode}</p>
              <Copy size={12} className="text-primary/30" />
            </div>
            <span className="text-[7px] font-bold text-gray-300 uppercase tracking-tighter mt-1 block">Tap to copy UID</span>
          </div>
        </button>
      </div>

      {/* Actions */}
      <div className="px-5 mt-6 flex gap-2.5">
        <Button 
          variant="outline"
          className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider border-gray-100 bg-white text-gray-600 shadow-sm text-[9px]"
          onClick={copyToClipboard}
        >
          <Copy className="mr-2" size={14} />
          Copy Link
        </Button>
        <Button className="flex-1 h-12 rounded-xl font-black uppercase tracking-wider shadow-lg shadow-primary/10 text-[9px]">
          <Share2 className="mr-2" size={14} />
          Share Now
        </Button>
      </div>

      {/* Rules Section */}
      <div className="px-5 mt-8 space-y-4">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Reward System Rules</h3>
        
        <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-4">
          {/* Level 1 Detail */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <span className="font-black text-xs">L1</span>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-gray-900 uppercase">Level 1: Direct Referrals</h4>
              <p className="text-[9px] text-gray-500 font-medium leading-relaxed mt-1">
                Earn <span className="text-primary font-black">0.3% Commission</span> on every order your direct friends buy.
              </p>
              <div className="mt-2 bg-amber-50 rounded-lg p-2 border border-amber-100 flex items-start gap-2">
                <Target size={12} className="text-amber-500 mt-0.5" />
                <p className="text-[8px] font-bold text-amber-700 uppercase leading-tight tracking-tight">
                  Milestone: Get ₹100 when your L1 friend successfully buys total ₹1,000 worth of orders.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-50"></div>

          {/* Level 2 Detail */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 shrink-0">
              <span className="font-black text-xs">L2</span>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-gray-900 uppercase">Level 2: Team Network</h4>
              <p className="text-[9px] text-gray-500 font-medium leading-relaxed mt-1">
                Earn <span className="text-primary font-black">0.2% Commission</span> on every order bought by friends of your L1 referrals.
              </p>
              <div className="mt-2 flex items-center gap-1.5 opacity-60">
                <Info size={10} className="text-gray-400" />
                <p className="text-[8px] font-bold text-gray-400 uppercase">L2 is not eligible for ₹100 Milestone Rewards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
