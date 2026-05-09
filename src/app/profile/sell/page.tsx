
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, ShieldCheck, Wallet, 
  TrendingUp, Power, Clock, AlertCircle, History, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { P2POrder } from "@/lib/p2p-engine";

export default function SellCenter() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<P2POrder | null>(null);
  const [history, setHistory] = useState<P2POrder[]>([]);

  useEffect(() => {
    loadState();
    const handleUpdate = () => loadState();
    window.addEventListener('p2p_order_update', handleUpdate);
    window.addEventListener('flexpay_users_update', handleUpdate);
    return () => {
      window.removeEventListener('p2p_order_update', handleUpdate);
      window.removeEventListener('flexpay_users_update', handleUpdate);
    };
  }, []);

  const loadState = () => {
    const currentUserId = localStorage.getItem('flexpay_user_id');
    if (!currentUserId) return;

    const users = JSON.parse(localStorage.getItem('flexpay_users') || '[]');
    const currentUser = users.find((u: any) => u.uid === currentUserId);
    setUser(currentUser);

    const orders = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    const matched = orders.find((o: P2POrder) => o.sellerId === currentUserId && (o.status === 'pending-payment' || o.status === 'in-review'));
    setActiveOrder(matched || null);
    
    setHistory(orders.filter((o: P2POrder) => o.sellerId === currentUserId));
  };

  const toggleSelling = (checked: boolean) => {
    const currentUserId = localStorage.getItem('flexpay_user_id');
    if (!currentUserId) return;

    const users = JSON.parse(localStorage.getItem('flexpay_users') || '[]');
    const updated = users.map((u: any) => u.uid === currentUserId ? { ...u, isSelling: checked } : u);
    localStorage.setItem('flexpay_users', JSON.stringify(updated));
    setUser({ ...user, isSelling: checked });
    
    toast({
      title: checked ? "Selling Active" : "Selling Paused",
      description: checked ? "You are now online for P2P matching." : "Matching stopped."
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB] pb-24">
      <div className="bg-white px-5 pt-8 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1"><ChevronLeft size={20}/></button>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Sell Center</h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">P2P Node Operator</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
          <span className={cn("text-[9px] font-black uppercase", user?.isSelling ? "text-green-500" : "text-gray-400")}>
            {user?.isSelling ? "Online" : "Offline"}
          </span>
          <Switch checked={user?.isSelling || false} onCheckedChange={toggleSelling} className="scale-75" />
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5">
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[8px] font-bold opacity-60 uppercase tracking-[0.2em] block mb-1">Available Assets</span>
            <h2 className="text-3xl font-black mb-6">₹{user?.balance?.toLocaleString() || 0}</h2>
            
            <div className="bg-white/10 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
              <div>
                <span className="text-[8px] font-bold opacity-50 uppercase block">Locked Assets (Holding)</span>
                <p className="text-base font-black">₹{user?.lockedBalance?.toLocaleString() || 0}</p>
              </div>
              <ShieldCheck size={24} className="text-blue-400" />
            </div>
          </div>
        </div>

        {activeOrder ? (
          <div className="bg-white rounded-[2rem] border border-primary/20 p-5 shadow-lg shadow-primary/5 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900 uppercase">Order Matched</h4>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">{activeOrder.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-primary">₹{activeOrder.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-amber-500" />
                <span className="text-[9px] font-black text-gray-700 uppercase">Waiting for Buyer</span>
              </div>
              <span className="text-[9px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                {activeOrder.status.replace('-', ' ')}
              </span>
            </div>

            <p className="text-[8px] font-bold text-gray-400 text-center uppercase leading-relaxed">
              Funds are temporarily locked. Verification will occur once buyer submits proof.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 p-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
              <Power size={24} />
            </div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Waiting for Match</h4>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">
              Keep the terminal online and at least one UPI account 'Online' to receive orders.
            </p>
          </div>
        )}

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[8px] font-bold text-blue-800 uppercase leading-relaxed">
            Only your 'Online' UPI accounts will be used for P2P matches. Offline accounts are hidden from buyers.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Recent Sell Network</h3>
          {history.length === 0 ? (
            <div className="flex flex-col items-center py-10 opacity-20">
              <History size={32} />
              <p className="text-[9px] font-black mt-2 uppercase">No Logs</p>
            </div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div>
                  <h5 className="text-[10px] font-black text-gray-900 uppercase">{h.id}</h5>
                  <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">₹{h.amount} • {new Date(h.timestamp).toLocaleDateString()}</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider",
                  h.status === 'success' ? "bg-green-50 text-green-600" : 
                  h.status === 'cancelled' ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400"
                )}>
                  {h.status.replace('-', ' ')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
