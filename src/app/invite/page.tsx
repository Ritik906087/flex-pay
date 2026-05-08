"use client"

import { BottomNav } from "@/components/bottom-nav";
import { UserPlus, Copy, Share2, Users, Trophy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Invite() {
  const { toast } = useToast();
  const inviteCode = "FX9872";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://flexpay.app/register?ref=${inviteCode}`);
    toast({
      title: "Success",
      description: "Invite link copied to clipboard.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-5 border-b border-gray-100">
        <h1 className="text-lg font-black text-gray-900">Build Your Team</h1>
        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Earn daily commissions from referrals</p>
      </div>

      {/* Reward Card */}
      <div className="px-5 mt-5">
        <div className="bg-primary rounded-[1.8rem] p-5 text-white shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-0.5">Earn ₹500</h2>
            <p className="text-[9px] font-medium opacity-80 mb-5 uppercase tracking-wider">For every active referral</p>
            
            <div className="flex gap-3">
              <div className="flex-1 bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span className="text-[8px] font-bold opacity-60 uppercase">Referrals</span>
                <p className="text-base font-black mt-0.5">1,248</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span className="text-[8px] font-bold opacity-60 uppercase">Commission</span>
                <p className="text-base font-black mt-0.5">12%</p>
              </div>
            </div>
          </div>
          <Trophy size={80} className="absolute -bottom-4 -right-4 opacity-10 rotate-12" />
        </div>
      </div>

      {/* QR Section */}
      <div className="px-5 mt-6 flex flex-col items-center">
        <div className="bg-white p-5 rounded-[1.8rem] border border-gray-100 flex flex-col items-center gap-3 shadow-sm w-full max-w-[240px]">
          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
            <QrCode size={120} className="text-gray-900" />
          </div>
          <div className="text-center">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 block">Your Code</span>
            <p className="text-lg font-black text-primary tracking-[0.2em]">{inviteCode}</p>
          </div>
        </div>
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
        <Button className="flex-1 h-12 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/10 text-[9px]">
          <Share2 className="mr-2" size={14} />
          Share Now
        </Button>
      </div>

      {/* Level Stats */}
      <div className="px-5 mt-8">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Commission Tiers</h3>
        <div className="flex flex-col gap-2.5">
          {[
            { level: "L1", title: "Direct Team", commission: "10%", color: "bg-blue-500" },
            { level: "L2", title: "Secondary Team", commission: "5%", color: "bg-green-500" },
            { level: "L3", title: "Global Team", commission: "2%", color: "bg-purple-500" },
          ].map((lvl, i) => (
            <div key={i} className="bg-white p-3.5 rounded-[1.2rem] border border-gray-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-[10px]", lvl.color)}>
                  {lvl.level}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-900 uppercase">{lvl.title}</h4>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tight">Profit Sharing active</p>
                </div>
              </div>
              <span className="text-xs font-black text-primary">{lvl.commission}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
