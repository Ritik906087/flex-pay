
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, ChevronLeft, Trophy, Target, 
  IndianRupee, ArrowUpRight, UserCheck, Search, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data with Levels
const MOCK_REFERRALS = [
  { uid: "FLEX772101", registeredAt: "2024-03-20", totalPurchase: 1250, status: "completed", level: "L1" },
  { uid: "FLEX772102", registeredAt: "2024-03-19", totalPurchase: 500, status: "pending", level: "L1" },
  { uid: "FLEX772103", registeredAt: "2024-03-18", totalPurchase: 2500, status: "completed", level: "L1" },
  { uid: "FLEX772201", registeredAt: "2024-03-18", totalPurchase: 3000, status: "completed", level: "L2" },
  { uid: "FLEX772202", registeredAt: "2024-03-17", totalPurchase: 1100, status: "completed", level: "L2" },
  { uid: "FLEX772106", registeredAt: "2024-03-15", totalPurchase: 950, status: "pending", level: "L1" },
];

export default function MyTeam() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevel, setActiveLevel] = useState("L1");

  const l1Referrals = MOCK_REFERRALS.filter(r => r.level === "L1");
  const l2Referrals = MOCK_REFERRALS.filter(r => r.level === "L2");

  const completedL1Targets = l1Referrals.filter(r => r.totalPurchase >= 1000).length;
  
  // Commission calculation
  const l1Comm = l1Referrals.reduce((acc, r) => acc + (r.totalPurchase * 0.003), 0);
  const l2Comm = l2Referrals.reduce((acc, r) => acc + (r.totalPurchase * 0.002), 0);
  const milestoneEarnings = completedL1Targets * 100;
  const totalEarnings = l1Comm + l2Comm + milestoneEarnings;

  const filteredReferrals = MOCK_REFERRALS.filter(r => 
    r.level === activeLevel && 
    r.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-gray-900" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Team Center</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Commission & Network</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5 pb-10 overflow-y-auto no-scrollbar">
        {/* Earnings Card */}
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[8px] font-bold opacity-70 uppercase tracking-[0.2em] block mb-1">Total Team Commission</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">₹{totalEarnings.toFixed(2)}</span>
                  <ArrowUpRight size={14} className="text-green-300" />
                </div>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <IndianRupee size={18} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
                <span className="text-[8px] font-bold opacity-60 uppercase tracking-wider block">L1 Comm (0.3%)</span>
                <p className="text-base font-black mt-0.5">₹{l1Comm.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 border border-white/5 backdrop-blur-sm">
                <span className="text-[8px] font-bold opacity-60 uppercase tracking-wider block">L2 Comm (0.2%)</span>
                <p className="text-base font-black mt-0.5">₹{l2Comm.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-[40px]"></div>
        </div>

        {/* Level Tabs */}
        <Tabs defaultValue="L1" onValueChange={setActiveLevel} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl h-11 p-1">
            <TabsTrigger value="L1" className="rounded-lg text-[9px] font-black uppercase data-[state=active]:bg-white">Level 1</TabsTrigger>
            <TabsTrigger value="L2" className="rounded-lg text-[9px] font-black uppercase data-[state=active]:bg-white">Level 2</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Milestone Tracker - Only for L1 */}
        {activeLevel === "L1" ? (
          <div className="bg-white p-5 rounded-[1.8rem] border border-gray-100 shadow-sm mb-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-gray-900 uppercase">L1 Bonus Milestone</h3>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">₹100 Per Complete (1K+)</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-gray-500 uppercase">Progress (Target: 10)</span>
                <span className="text-[10px] font-black text-primary">{completedL1Targets}/10</span>
              </div>
              <Progress value={(completedL1Targets / 10) * 100} className="h-2 bg-gray-100" />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50/50 p-5 rounded-[1.8rem] border border-dashed border-gray-200 mb-6 flex items-center gap-3 animate-in fade-in duration-300">
            <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase">Milestone Status</h3>
              <p className="text-[8px] font-bold text-red-400 uppercase tracking-widest">Not eligible for Level 2</p>
            </div>
          </div>
        )}

        {/* Team List */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{activeLevel} Members</h3>
            <span className="text-[8px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase">
              {activeLevel === 'L1' ? '0.3% Comm' : '0.2% Comm'}
            </span>
          </div>
          
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
              <Search size={14} />
            </div>
            <Input 
              placeholder="Search UID..." 
              className="h-11 bg-white border-gray-100 rounded-xl pl-10 text-[11px] font-bold placeholder:font-medium transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredReferrals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-20">
                <Users size={32} />
                <p className="text-[9px] font-black mt-2 uppercase">No members</p>
              </div>
            ) : (
              filteredReferrals.map((referral, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center border transition-colors",
                      referral.status === 'completed' 
                        ? "bg-green-50 border-green-100 text-green-500" 
                        : "bg-gray-50 border-gray-100 text-gray-400"
                    )}>
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-gray-900">{referral.uid}</h4>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tight">Level {referral.level} • Joined {referral.registeredAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tight block",
                      referral.status === 'completed' ? "text-green-600" : "text-gray-400"
                    )}>
                      ₹{referral.totalPurchase.toLocaleString()}
                    </span>
                    <span className={cn(
                      "text-[7px] font-bold uppercase tracking-widest",
                      referral.status === 'completed' ? "text-green-400" : "text-gray-300"
                    )}>
                      {referral.status === 'completed' ? "Complete" : "Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
