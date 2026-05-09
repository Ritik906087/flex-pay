
"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, CheckCircle2, Search, 
  TrendingUp, Wallet, ShieldCheck, ChevronRight, 
  ArrowUpRight, ArrowDownRight, Filter, Info, 
  XCircle, Clock, Copy, MoreVertical, Ban, 
  IndianRupee, Smartphone, User, Hash, Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

// --- MOCK DATA FOR PROTOTYPE ---
const MOCK_USERS = [
  { uid: "FLEX123456", mobile: "9876543210", balance: 12500, status: "active", joinedAt: "2024-01-15", upi: "user@upi" },
  { uid: "FLEX772101", mobile: "9988776655", balance: 500, status: "active", joinedAt: "2024-02-10", upi: "alex@oksbi" },
  { uid: "FLEX883202", mobile: "8877665544", balance: 0, status: "restricted", joinedAt: "2024-03-01", upi: "sam@paytm" },
];

export default function AdminPanel() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Modals
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Real-time local storage data
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayVolume: 0, todayCount: 0, totalVolume: 0, totalCount: 0 });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    setOrders(history);

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayOrders = history.filter((o: any) => o.timestamp >= todayStart);
    
    setStats({
      todayVolume: todayOrders.reduce((acc: number, o: any) => acc + o.amount, 0),
      todayCount: todayOrders.length,
      totalVolume: history.reduce((acc: number, o: any) => acc + o.amount, 0),
      totalCount: history.length
    });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  const updateOrderStatus = (id: string, newStatus: 'success' | 'rejected') => {
    const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    localStorage.setItem('flexpay_orders', JSON.stringify(updated));
    setOrders(updated);
    setSelectedOrder(null);
    toast({ 
      title: newStatus === 'success' ? "Order Approved" : "Order Rejected",
      variant: newStatus === 'success' ? "default" : "destructive"
    });
  };

  // --- FILTERS ---
  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => 
      u.uid.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.mobile.includes(searchQuery)
    );
  }, [searchQuery]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const query = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(query) ||
        (o.utr && o.utr.toLowerCase().includes(query)) ||
        o.amount.toString().includes(query)
      );
    });
  }, [orders, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0E17] text-white">
      {/* Premium Header */}
      <div className="bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 px-6 pt-10 pb-4 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="text-primary" size={20} />
              COMMAND CENTER
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">FlexPay Admin v2.5</p>
          </div>
          <Button variant="outline" className="h-8 rounded-lg border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest" onClick={() => router.push('/')}>
            Exit Terminal
          </Button>
        </div>

        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 h-10 bg-slate-900/50 p-1 rounded-xl border border-white/5">
            <TabsTrigger value="dashboard" className="rounded-lg text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
              <LayoutDashboard size={14} className="mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users size={14} className="mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="approvals" className="rounded-lg text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
              <CheckCircle2 size={14} className="mr-2" />
              Approvals
              {orders.filter(o => o.status === 'in-review').length > 0 && (
                <span className="ml-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] animate-pulse">
                  {orders.filter(o => o.status === 'in-review').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 p-6 pb-24 overflow-y-auto no-scrollbar">
        {/* --- DASHBOARD TAB --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-white/5 rounded-[1.8rem] p-5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Today's Volume</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">₹{stats.todayVolume.toLocaleString()}</span>
                  <span className="text-[10px] text-green-400 font-bold">+{stats.todayCount}</span>
                </div>
              </div>
              <div className="bg-slate-900/40 border border-white/5 rounded-[1.8rem] p-5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Lifetime Volume</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-primary">₹{stats.totalVolume.toLocaleString()}</span>
                </div>
                <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold tracking-tight">Total {stats.totalCount} Orders</p>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Network Traffic</h3>
                <TrendingUp size={14} className="text-primary" />
              </div>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center border",
                        order.status === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : 
                        order.status === 'in-review' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                        "bg-slate-800 border-white/5 text-slate-400"
                      )}>
                        <IndianRupee size={16} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white">{order.id}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • UPI+
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-white">₹{order.amount.toLocaleString()}</p>
                      <Badge variant="outline" className="text-[7px] h-4 uppercase tracking-tighter border-white/10 text-slate-400">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <Input 
                placeholder="Search UID or Mobile..." 
                className="bg-slate-900/50 border-white/5 rounded-2xl h-12 pl-12 text-[12px] font-black placeholder:text-slate-600 focus:bg-slate-900/80 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.uid} className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5">
                      <User size={20} className="text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-black text-white">{user.mobile}</h4>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{user.uid}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] font-black text-primary">₹{user.balance.toLocaleString()}</p>
                      <span className={cn(
                        "text-[7px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md",
                        user.status === 'active' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {user.status}
                      </span>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10"
                      onClick={() => setSelectedUser(user)}
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- APPROVALS TAB --- */}
        {activeTab === "approvals" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <Input 
                placeholder="Search UTR, ID or Amount..." 
                className="bg-slate-900/50 border-white/5 rounded-2xl h-12 pl-12 text-[12px] font-black placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              {filteredOrders.filter(o => o.status === 'in-review').length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <CheckCircle2 size={40} />
                  <p className="text-[10px] font-black mt-3 uppercase tracking-widest">Clear Queue</p>
                </div>
              )}
              {filteredOrders.filter(o => o.status === 'in-review').map((order) => (
                <div key={order.id} className="bg-slate-900/60 border border-white/10 rounded-[1.8rem] p-5 shadow-sm active:bg-slate-900/80 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Order ID</span>
                      <h4 className="text-[12px] font-black text-white">{order.id}</h4>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[7px] uppercase tracking-widest">Pending Review</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-5 bg-[#0A0E17]/40 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[7px] font-bold text-slate-500 uppercase block mb-1">Amount</span>
                      <p className="text-[13px] font-black text-white">₹{order.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[7px] font-bold text-slate-500 uppercase block mb-1">UTR / TXID</span>
                      <p className="text-[10px] font-black text-primary tracking-widest truncate">{order.utr || order.txid || "N/A"}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-11 rounded-xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.15em] hover:bg-white/90"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Review Order
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL: USER DETAILS --- */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-[400px] rounded-[2.5rem] p-8 shadow-2xl no-scrollbar overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-primary mb-4 border border-white/5">
              <User size={32} />
            </div>
            <DialogTitle className="text-center text-[18px] font-black uppercase tracking-tight">User Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[7px] font-bold text-slate-500 uppercase block mb-1">Main Balance</span>
                <p className="text-base font-black text-primary">₹{selectedUser?.balance?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                <span className="text-[7px] font-bold text-slate-500 uppercase block mb-1">Status</span>
                <p className={cn("text-[10px] font-black uppercase", selectedUser?.status === 'active' ? "text-green-500" : "text-red-500")}>
                  {selectedUser?.status}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-10 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-green-400 hover:bg-green-500/10">
                + ADD FUNDS
              </Button>
              <Button className="h-10 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10">
                - SUB FUNDS
              </Button>
            </div>

            {/* Data Rows */}
            <div className="space-y-3 bg-[#0A0E17]/40 p-4 rounded-2xl border border-white/5">
              {[
                { label: "Mobile", value: selectedUser?.mobile, icon: Smartphone },
                { label: "UID", value: selectedUser?.uid, icon: Hash },
                { label: "Linked UPI", value: selectedUser?.upi, icon: Wallet },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex items-center gap-2.5">
                    <row.icon size={12} className="text-slate-600" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase">{row.label}</span>
                  </div>
                  <button onClick={() => handleCopy(row.value, row.label)} className="text-[10px] font-black text-slate-300 flex items-center gap-1.5 active:text-primary transition-colors">
                    {row.value}
                    <Copy size={10} className="opacity-30 group-hover:opacity-100" />
                  </button>
                </div>
              ))}
            </div>

            {/* Logs Preview */}
            <div className="space-y-2">
              <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Recent History</h5>
              <div className="bg-[#0A0E17]/60 rounded-xl p-3 max-h-32 overflow-y-auto no-scrollbar space-y-2 border border-white/5">
                {orders.filter(o => o.mobile === selectedUser?.mobile || o.id.includes('ORD')).slice(0, 3).map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-[9px] border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="font-bold text-slate-400">{log.id}</span>
                    <span className={cn("font-black", log.status === 'success' ? "text-green-500" : "text-amber-500")}>₹{log.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button className="w-full h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                RESTRICT ACCOUNT
              </Button>
              <Button variant="ghost" className="w-full text-slate-500 text-[9px] font-black uppercase tracking-widest" onClick={() => setSelectedUser(null)}>
                Close Terminal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: ORDER REVIEW --- */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-w-[430px] rounded-t-[2.5rem] fixed bottom-0 top-auto translate-y-0 translate-x-[-50%] p-8 shadow-2xl no-scrollbar overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="flex justify-between items-center px-1">
              <div>
                <DialogTitle className="text-[16px] font-black uppercase tracking-tight">Review Order</DialogTitle>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{selectedOrder?.id}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/20 text-[8px] px-2 py-0.5 uppercase">₹{selectedOrder?.amount}</Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Screenshot Area */}
            <div className="relative aspect-[9/16] max-h-72 w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/5 group">
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-600">
                <Eye size={40} className="opacity-20" />
                <span className="absolute bottom-4 text-[8px] font-bold uppercase tracking-widest">Customer Screenshot</span>
              </div>
              {/* Image would go here: <Image src={selectedOrder?.proofUrl} fill className="object-cover" /> */}
            </div>

            {/* Comparison Data */}
            <div className="space-y-3">
              <div className="bg-[#0A0E17]/60 p-5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[7px] font-bold text-slate-500 uppercase block mb-1">Provided UTR</span>
                    <button onClick={() => handleCopy(selectedOrder?.utr || selectedOrder?.txid || "", "UTR")} className="text-[14px] font-black text-primary tracking-widest flex items-center gap-2">
                      {selectedOrder?.utr || selectedOrder?.txid || "N/A"}
                      <Copy size={12} className="opacity-40" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-[7px] font-bold text-slate-500 uppercase block mb-1">Time Elapsed</span>
                    <p className="text-[11px] font-black text-white">4m 12s</p>
                  </div>
                </div>

                <div className="h-px bg-white/5"></div>

                <div>
                  <span className="text-[7px] font-bold text-slate-500 uppercase block mb-1">Receiver (Merchant)</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tight">flexpay@upi (FLEXPAY MERCHANT LTD)</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex gap-3">
                <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[8px] font-bold text-amber-700 uppercase leading-relaxed tracking-tight">
                  Verify the UTR in merchant statement before approving. Double transfers are not refundable.
                </p>
              </div>
            </div>

            {/* Action Bottoms */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="destructive"
                className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-900/10"
                onClick={() => updateOrderStatus(selectedOrder?.id, 'rejected')}
              >
                <Ban size={16} className="mr-2" />
                Reject
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-green-900/10"
                onClick={() => updateOrderStatus(selectedOrder?.id, 'success')}
              >
                <CheckCircle2 size={16} className="mr-2" />
                Approve Order
              </Button>
            </div>
            
            <Button variant="ghost" className="w-full text-slate-500 text-[9px] font-black uppercase tracking-widest mt-2" onClick={() => setSelectedOrder(null)}>
              Return to Queue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
