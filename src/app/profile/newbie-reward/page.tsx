
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Gift, CheckCircle2, Star, Sparkles, 
  ShieldCheck, Youtube, MessageCircle, Wallet, ShoppingBag, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RewardTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "completed" | "pending";
  icon: any;
}

export default function NewbieReward() {
  const router = useRouter();
  const { toast } = useToast();
  const [allClaimed, setAllClaimed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flexpay_newbie_claimed') === 'true';
    }
    return false;
  });
  
  const [tasks, setTasks] = useState<RewardTask[]>([
    {
      id: "welcome",
      title: "Welcome Bonus",
      description: "Successfully registered",
      reward: 20,
      status: "completed",
      icon: Star
    },
    {
      id: "link-wallet",
      title: "Link Wallet",
      description: "Add UPI withdrawal terminal",
      reward: 30,
      status: "pending",
      icon: Wallet
    },
    {
      id: "join-channel",
      title: "Join Telegram",
      description: "Official community channel",
      reward: 50,
      status: "pending",
      icon: MessageCircle
    },
    {
      id: "watch-tutorial",
      title: "Watch Guide",
      description: "Learn how to earn profit",
      reward: 50,
      status: "pending",
      icon: Youtube
    },
    {
      id: "milestone-1k",
      title: "Trade ₹1K",
      description: "Complete initial buy goal",
      reward: 50,
      status: "pending",
      icon: ShoppingBag
    }
  ]);

  const toggleTaskStatus = (id: string) => {
    if (allClaimed) return;
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
    ));
  };

  const handleClaimAll = () => {
    setAllClaimed(true);
    localStorage.setItem('flexpay_newbie_claimed', 'true');
    
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const bonusOrder = {
      id: "#JACKPOT",
      amount: 0,
      profitPercent: 0,
      bonus: 200,
      status: 'success',
      timestamp: Date.now()
    };
    localStorage.setItem('flexpay_orders', JSON.stringify([bonusOrder, ...history]));

    if (window.navigator.vibrate) window.navigator.vibrate([50, 50]);
    toast({
      title: "Success! 🎉",
      description: "₹200 added to your wallet.",
    });
  };

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const isAllDone = completedCount === tasks.length;
  const totalReward = 200;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1"><ChevronLeft size={20}/></button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Mission Center</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Single page progress</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-8">
        {/* Compact Banner */}
        <div className="bg-primary rounded-[1.8rem] p-5 text-white shadow-lg relative overflow-hidden mb-5">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={12} className="text-amber-300" />
              <span className="text-[8px] font-black uppercase tracking-widest">Newbie Reward</span>
            </div>
            <h2 className="text-2xl font-black">₹{totalReward} Cash</h2>
            
            <div className="mt-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[7px] font-bold uppercase">Mission Progress</span>
                <span className="text-[9px] font-black">{completedCount}/{tasks.length}</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-500" 
                  style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                />
              </div>

              {isAllDone && !allClaimed && (
                <Button 
                  onClick={handleClaimAll}
                  className="w-full mt-3 bg-white text-primary h-9 rounded-lg font-black text-[9px] uppercase tracking-wider"
                >
                  CLAIM NOW
                </Button>
              )}
              {allClaimed && (
                <div className="mt-3 text-center py-2 bg-green-500/20 rounded-lg text-[8px] font-black uppercase">Reward Claimed</div>
              )}
            </div>
          </div>
          <Gift size={100} className="absolute -bottom-6 -right-6 opacity-10 rotate-12" />
        </div>

        {/* Compact Task List */}
        <div className="flex flex-col gap-2">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isDone = task.status === "completed";
            return (
              <button 
                key={task.id} 
                disabled={allClaimed}
                onClick={() => toggleTaskStatus(task.id)}
                className={cn(
                  "bg-white p-3 rounded-xl border border-gray-50 flex items-center justify-between transition-all",
                  isDone ? "opacity-100" : "opacity-90"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                    isDone ? "bg-green-50 text-green-500" : "bg-gray-50 text-gray-400"
                  )}>
                    {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <div className="text-left">
                    <h4 className="text-[10px] font-black text-gray-900 uppercase">{task.title}</h4>
                    <p className="text-[7px] text-gray-400 font-bold uppercase tracking-tight">{task.description}</p>
                  </div>
                </div>
                <div className={cn(
                  "text-[7px] font-black px-2 py-1 rounded-md",
                  isDone ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-300"
                )}>
                  {isDone ? "DONE" : "₹" + task.reward}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex gap-2">
          <ShieldCheck size={14} className="text-amber-500 shrink-0" />
          <p className="text-[7px] font-bold text-amber-700 uppercase leading-snug tracking-tight">
            Verify all tasks with real data to prevent withdrawal issues. Rewards are final once claimed.
          </p>
        </div>
      </div>
    </div>
  );
}
