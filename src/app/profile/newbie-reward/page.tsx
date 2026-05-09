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
  const [allClaimed, setAllClaimed] = useState(false);
  
  const [tasks, setTasks] = useState<RewardTask[]>([
    {
      id: "welcome",
      title: "Welcome Bonus",
      description: "Successfully registered on FlexPay",
      reward: 20,
      status: "completed",
      icon: Star
    },
    {
      id: "link-wallet",
      title: "Link Wallet",
      description: "Link MobiKwik or Freecharge account",
      reward: 30,
      status: "pending",
      icon: Wallet
    },
    {
      id: "join-channel",
      title: "Join Channel",
      description: "Join our official Telegram for updates",
      reward: 50,
      status: "pending",
      icon: MessageCircle
    },
    {
      id: "watch-tutorial",
      title: "Watch Tutorial",
      description: "Watch full video on how to earn",
      reward: 50,
      status: "pending",
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

  const toggleTaskStatus = (id: string) => {
    if (allClaimed) return;
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
    ));
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const handleClaimAll = () => {
    setAllClaimed(true);
    if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
    toast({
      title: "Jackpot Claimed! 🎉",
      description: "₹200 bonus has been added to your main balance.",
    });
  };

  const completedCount = tasks.filter(t => t.status === "completed").length;
  const isAllDone = completedCount === tasks.length;
  const totalReward = 200;

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
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Complete all for ₹{totalReward}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-10 overflow-y-auto no-scrollbar">
        {/* Banner with Consolidated Claim */}
        <div className="bg-primary rounded-[2.2rem] p-7 text-white shadow-xl shadow-primary/20 relative overflow-hidden mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-amber-300" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Newbie Jackpot</span>
            </div>
            <h2 className="text-3xl font-black mb-1">₹{totalReward} Reward</h2>
            <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase tracking-tight max-w-[200px]">
              Complete all tasks below to unlock your cash bonus
            </p>
            
            <div className="mt-6 bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-bold uppercase tracking-wider">Overall Mission Progress</span>
                <span className="text-[10px] font-black">{completedCount}/{tasks.length} Done</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-700 ease-out" 
                  style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                />
              </div>

              {isAllDone && !allClaimed && (
                <Button 
                  onClick={handleClaimAll}
                  className="w-full mt-4 bg-white text-primary hover:bg-gray-50 h-11 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] shadow-xl animate-bounce"
                >
                  CLAIM ₹{totalReward} BONUS
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              )}

              {allClaimed && (
                <div className="w-full mt-4 bg-green-500/30 text-white h-11 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 border border-white/20">
                  <CheckCircle2 size={14} />
                  REWARD CLAIMED
                </div>
              )}
            </div>
          </div>
          <Gift size={150} className="absolute -bottom-10 -right-10 opacity-10 -rotate-12" />
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Newbie Missions</h3>
          
          <div className="flex flex-col gap-3">
            {tasks.map((task) => {
              const Icon = task.icon;
              const isDone = task.status === "completed";
              return (
                <button 
                  key={task.id} 
                  disabled={allClaimed}
                  onClick={() => toggleTaskStatus(task.id)}
                  className={cn(
                    "bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group transition-all text-left",
                    isDone ? "bg-white" : "active:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center transition-all border shadow-sm",
                      isDone ? "bg-green-50 border-green-100 text-green-500" : "bg-gray-50 border-gray-100 text-gray-400"
                    )}>
                      {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{task.title}</h4>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{task.description}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={cn(
                          "text-[10px] font-black transition-colors",
                          isDone ? "text-green-600" : "text-primary"
                        )}>+₹{task.reward}</span>
                        <span className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">Bonus Pool</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    {isDone ? (
                      <div className="bg-green-50 text-green-500 px-3 py-1.5 rounded-lg border border-green-100">
                        <span className="text-[8px] font-black uppercase tracking-widest">COMPLETED</span>
                      </div>
                    ) : (
                      <div className="bg-gray-50 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-[8px] font-black uppercase tracking-widest">PENDING</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-10 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
          <ShieldCheck className="text-amber-500 shrink-0" size={16} />
          <p className="text-[8px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
            Accounts must be linked with valid credentials. All rewards are credited to the commission balance 
            once the total mission goal of ₹200 is reached and claimed.
          </p>
        </div>
      </div>
    </div>
  );
}
