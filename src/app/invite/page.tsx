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
      <div className="bg-white px-6 pt-10 pb-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Build Your Team</h1>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">Earn daily commissions from referrals</p>
      </div>

      {/* Reward Card */}
      <div className="px-6 mt-6">
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1">Earn ₹500</h2>
            <p className="text-xs font-medium opacity-80 mb-6 uppercase tracking-wider">For every active referral</p>
            
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="text-[9px] font-bold opacity-60 uppercase">Referrals</span>
                <p className="text-lg font-black mt-0.5">1,248</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="text-[9px] font-bold opacity-60 uppercase">Commission</span>
                <p className="text-lg font-black mt-0.5">12%</p>
              </div>
            </div>
          </div>
          <Trophy size={100} className="absolute -bottom-4 -right-4 opacity-10 rotate-12" />
        </div>
      </div>

      {/* QR Section */}
      <div className="px-6 mt-8 flex flex-col items-center">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center gap-4 shadow-sm w-full max-w-[280px]">
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <QrCode size={140} className="text-gray-900" />
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Your Code</span>
            <p className="text-xl font-black text-primary tracking-[0.2em]">{inviteCode}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 mt-8 flex gap-3">
        <Button 
          variant="outline"
          className="flex-1 h-14 rounded-xl font-bold uppercase tracking-wider border-gray-100 bg-white text-gray-600 shadow-sm text-[10px]"
          onClick={copyToClipboard}
        >
          <Copy className="mr-2" size={16} />
          Copy Link
        </Button>
        <Button className="flex-1 h-14 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-primary/10 text-[10px]">
          <Share2 className="mr-2" size={16} />
          Share Now
        </Button>
      </div>

      {/* Level Stats */}
      <div className="px-6 mt-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Commission Tiers</h3>
        <div className="flex flex-col gap-3">
          {[
            { level: "L1", title: "Direct Team", commission: "10%", color: "bg-blue-500" },
            { level: "L2", title: "Secondary Team", commission: "5%", color: "bg-green-500" },
            { level: "L3", title: "Global Team", commission: "2%", color: "bg-purple-500" },
          ].map((lvl, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs", lvl.color)}>
                  {lvl.level}
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-gray-900 uppercase">{lvl.title}</h4>
                  <p className="text-[9px] text-gray-400 font-medium">Profit Sharing active</p>
                </div>
              </div>
              <span className="text-sm font-black text-primary">{lvl.commission}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}