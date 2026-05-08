
"use client"

import { BottomNav } from "@/components/bottom-nav";
import { UserPlus, Copy, Share2, Users, Trophy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function Invite() {
  const { toast } = useToast();
  const inviteCode = "FX9872";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://flexpay.app/register?ref=${inviteCode}`);
    toast({
      title: "Link Copied!",
      description: "Share it with your friends to earn rewards.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-2xl font-black tracking-tight text-white uppercase mb-2">Invite Friends</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Build your team & grow income</p>
      </div>

      {/* Rewards Card */}
      <div className="px-6 mb-8">
        <div className="accent-gradient rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute -top-10 -right-10 opacity-20 rotate-12">
            <Trophy size={160} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-primary-foreground mb-2">Earn ₹500</h2>
            <p className="text-primary-foreground/80 text-xs font-medium uppercase tracking-widest mb-6">Per successful referral</p>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] font-bold text-primary-foreground/60 uppercase">Team Size</span>
                <p className="text-xl font-black text-white">1,248</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] font-bold text-primary-foreground/60 uppercase">Commission</span>
                <p className="text-xl font-black text-white">12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="px-6 mb-8 flex justify-center">
        <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-4 bg-white/5">
          <div className="bg-white p-4 rounded-3xl">
            <QrCode size={180} className="text-black" />
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Your Invite Code</span>
            <p className="text-2xl font-black text-primary tracking-[0.2em]">{inviteCode}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 flex flex-col gap-4">
        <div className="flex gap-4">
          <Button 
            className="flex-1 py-7 rounded-2xl font-black uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 text-white ripple"
            onClick={copyToClipboard}
          >
            <Copy className="mr-2" size={18} />
            Copy Link
          </Button>
          <Button className="flex-1 py-7 rounded-2xl font-black uppercase tracking-widest ripple shadow-xl shadow-primary/20">
            <Share2 className="mr-2" size={18} />
            Share Now
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="px-6 mt-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">Level Statistics</h3>
        <div className="flex flex-col gap-3">
          {[
            { level: "Level 1", members: "128", commission: "10%", color: "bg-cyan-500" },
            { level: "Level 2", members: "450", commission: "5%", color: "bg-blue-500" },
            { level: "Level 3", members: "670", commission: "2%", color: "bg-indigo-500" },
          ].map((lvl, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl flex justify-between items-center border border-white/10">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black", lvl.color)}>
                  L{i+1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">{lvl.level}</h4>
                  <p className="text-[10px] text-muted-foreground">{lvl.members} active members</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-primary">{lvl.commission}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
