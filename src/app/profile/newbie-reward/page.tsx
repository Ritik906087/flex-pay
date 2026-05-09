"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Gift, CheckCircle2, Star, Sparkles, 
  ShieldCheck, Youtube, MessageCircle, Wallet, ShoppingBag 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RewardTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "claim" | "claimed" | "pending";
  icon: any;
}

export default function NewbieReward() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<RewardTask[]>([
    {
      id: "welcome",
      title: "Welcome Bonus",
      description: "Successfully registered on FlexPay",
      reward: 20,
      status: "claimed",
      icon: Star
    },
    {
      id: "link-wallet",
      title: "Link Wallet",
      description: "Link MobiKwik or Freecharge account",
      reward: 30,
      status: "claim",
      icon: Wallet
    },
    {
      id: "join-channel",
      title: "Join Channel",
      description: "Join our official Telegram for updates",
      reward: 50,
      status: "claim",
      icon: MessageCircle
    },
    {
      id: "watch-tutorial",
      title: "Watch Tutorial",
      description: "Watch full video on how to earn",
      reward: 50,
      status: "claim",
      icon: Youtube
    },
    {
      id: "milestone-1k",
      title: "Buy ₹1,000 Milestone",
      description: "Buy ₹1,000 amount value of orders",
      reward: 50,
      status: "pending",
      icon: ShoppingBag
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

  const totalClaimed = tasks
    .filter(t => t.status === "claimed")
    .reduce((acc, curr) => acc + curr.reward, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Mission Center</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Complete all for ₹200</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-10 overflow-y-auto no-scrollbar">
        {/* Banner */}
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-amber-300" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Newbie Jackpot</span>
            </div>
            <h2 className="text-3xl font-black mb-1">₹200 Reward</h2>
            <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase tracking-tight">
              Link MobiKwik/Freecharge and complete tasks to unlock full reward
            </p>
            
            <div className="mt-5 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[8px] font-bold uppercase">Progress</span>
                <span className="text-[10px] font-black">₹{totalClaimed}/₹200</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-500" 
                  style={{ width: `${(totalClaimed / 200) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <Gift size={120} className="absolute -bottom-8 -right-8 opacity-10 -rotate-12" />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Today's Tasks</h3>
          
          <div className="flex flex-col gap-3">
            {tasks.map((task) => {
              const Icon = task.icon;
              return (
                <div key={task.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group active:bg-gray-50 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm border",
                      task.status === "claimed" ? "bg-green-50 border-green-100 text-green-500" : 
                      task.status === "claim" ? "bg-blue-50 border-blue-100 text-blue-500" : "bg-gray-50 border-gray-100 text-gray-300"
                    )}>
                      {task.status === "claimed" ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{task.title}</h4>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{task.description}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] font-black text-primary">+₹{task.reward}</span>
                        <span className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">Bonus</span>
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
              );
            })}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
          <ShieldCheck className="text-amber-500 shrink-0" size={16} />
          <p className="text-[8px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
            Accounts must be linked with valid MobiKwik or Freecharge credentials. 
            All rewards are credited to the commission balance and require verification.
          </p>
        </div>
      </div>
    </div>
  );
}
