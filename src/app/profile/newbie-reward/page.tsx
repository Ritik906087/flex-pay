"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Gift, CheckCircle2, Star, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RewardTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "claim" | "claimed" | "pending";
}

export default function NewbieReward() {
  const router = useRouter();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<RewardTask[]>([
    {
      id: "welcome",
      title: "Welcome Bonus",
      description: "Successfully registered on FlexPay",
      reward: 10,
      status: "claimed"
    },
    {
      id: "profile",
      title: "Complete Profile",
      description: "Link your first UPI account to start",
      reward: 5,
      status: "claim"
    },
    {
      id: "first-buy",
      title: "First Purchase",
      description: "Buy your first order from task market",
      reward: 50,
      status: "pending"
    },
    {
      id: "referral",
      title: "First Referral",
      description: "Invite 1 friend to join your team",
      reward: 20,
      status: "pending"
    }
  ]);

  const handleClaim = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: "claimed" } : task
    ));
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    toast({
      title: "Reward Claimed",
      description: "The bonus has been added to your balance.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Newbie Rewards</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Exclusive for new members</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-10 overflow-y-auto no-scrollbar">
        {/* Banner */}
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-amber-300" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Starter Package</span>
            </div>
            <h2 className="text-2xl font-black mb-1">Get ₹100 Extra</h2>
            <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase tracking-tight">Complete simple tasks to earn your initial business capital</p>
          </div>
          <Gift size={100} className="absolute -bottom-6 -right-6 opacity-10 -rotate-12" />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mission Center</h3>
          
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group active:bg-gray-50 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm border",
                    task.status === "claimed" ? "bg-green-50 border-green-100 text-green-500" : 
                    task.status === "claim" ? "bg-blue-50 border-blue-100 text-blue-500" : "bg-gray-50 border-gray-100 text-gray-300"
                  )}>
                    {task.status === "claimed" ? <CheckCircle2 size={18} /> : <Star size={18} />}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{task.title}</h4>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{task.description}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-[10px] font-black text-primary">₹{task.reward}</span>
                      <span className="text-[7px] font-bold text-gray-300 uppercase">Reward</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {task.status === "claim" ? (
                    <Button 
                      onClick={() => handleClaim(task.id)}
                      className="h-8 px-4 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-lg shadow-primary/10"
                    >
                      CLAIM
                    </Button>
                  ) : task.status === "claimed" ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-lg text-green-500">
                      <CheckCircle2 size={10} />
                      <span className="text-[8px] font-black uppercase">DONE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-400">
                      <span className="text-[8px] font-black uppercase tracking-wider">LOCKED</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
          <ShieldCheck className="text-amber-500 shrink-0" size={16} />
          <p className="text-[8px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
            Reward distribution is subject to account verification. Any attempt to abuse the reward system will result in permanent account suspension.
          </p>
        </div>
      </div>
    </div>
  );
}
