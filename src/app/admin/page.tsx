
"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  TrendingUp, Wallet, ShieldCheck, 
  IndianRupee, Smartphone, User, 
  Hash, Eye, ExternalLink, ArrowUpRight, 
  CheckCircle2, Plus, UserPlus, Search, History, CheckCircle, Ban, Copy, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MOCK_USERS } from "@/lib/mock-admin-data";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Orders and stats
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [stats, setStats] = useState({ todayVolume: 0, todayCount: 0, totalVolume: 0, totalCount: 0 });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update tab if URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

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

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(u => 
      u.uid.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.mobile.includes(searchQuery) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const query = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(query) ||
        (o.utr && o.utr.toLowerCase().includes(query)) ||
        (o.txid && o.txid.toLowerCase().includes(query)) ||
        o.amount.toString().includes(query)
      );
    });
  }, [orders, searchQuery]);

  const pendingApprovals = orders.filter(o => o.status === 'in-review').length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} pendingCount={pendingApprovals} />

      <div className="flex-1 ml-72">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">
              {activeTab === "dashboard" ? "System Dashboard" : 
               activeTab === "users" ? "User Management" : 
               activeTab === "approvals" ? "Order Approvals" : "Network Logs"}
            </h2>
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[8px] h-5 px-2 uppercase tracking-widest font-black">
              Production Node
            </Badge>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <Input 
                placeholder="Global Search..." 
                className="w-80 h-11 pl-10 bg-slate-50 border-transparent rounded-2xl text-[11px] font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900">Root Admin</p>
                <div className="flex items-center gap-1 justify-end">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[8px] font-bold text-green-600 uppercase tracking-tighter">Live</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 pb-20 max-w-[1600px] mx-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Today Volume", value: `₹${stats.todayVolume.toLocaleString()}`, sub: `${stats.todayCount} Node Success`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/5" },
                  { label: "Active Nodes", value: "1,248", sub: "99.9% Uptime", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Pending Verification", value: pendingApprovals.toString(), sub: "Awaiting review", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Net Pool", value: `₹${stats.totalVolume.toLocaleString()}`, sub: "Total network liquidity", icon: Wallet, color: "text-green-600", bg: "bg-green-50" },
                ].map((item, i) => (
                  <Card key={i} className="border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</CardTitle>
                      <div className={cn("p-3 rounded-2xl", item.bg, item.color)}>
                        <item.icon size={18} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-slate-900 tracking-tight">{item.value}</div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 flex items-center gap-1.5">
                        <TrendingUp size={12} className="text-green-500" />
                        {item.sub}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/30">
                    <div>
                      <CardTitle className="text-[14px] font-black uppercase tracking-tight">Real-time Terminal Activity</CardTitle>
                      <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-1">Live incoming trade nodes</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {orders.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center opacity-20">
                          <History size={48} />
                          <p className="text-[12px] font-black uppercase mt-4 tracking-widest">No terminal traffic detected</p>
                        </div>
                      ) : (
                        orders.slice(0, 10).map((order) => (
                          <div key={order.id} className="px-8 py-6 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                            <div className="flex items-center gap-5">
                              <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm",
                                order.status === 'success' ? "bg-green-50 border-green-100 text-green-600" :
                                order.status === 'in-review' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                "bg-slate-50 border-slate-100 text-slate-400"
                              )}>
                                <IndianRupee size={20} />
                              </div>
                              <div>
                                <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{order.id}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                  {new Date(order.timestamp).toLocaleString()} • Global Node
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-slate-900">₹{order.amount.toLocaleString()}</p>
                              <Badge className={cn(
                                "text-[8px] h-5 px-2.5 uppercase tracking-tighter border-0 mt-1 shadow-sm",
                                order.status === 'success' ? "bg-green-50 text-green-600" :
                                order.status === 'in-review' ? "bg-amber-50 text-amber-600" :
                                "bg-slate-100 text-slate-400"
                              )}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-8">
                  <Card className="border-slate-200 shadow-xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
                    <CardHeader className="relative z-10 p-8">
                      <CardTitle className="text-[11px] font-black uppercase tracking-widest opacity-50">Node Health</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 px-8 pb-10">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 backdrop-blur-xl shadow-2xl">
                          <ShieldCheck size={28} />
                        </div>
                        <div>
                          <p className="text-xl font-black tracking-tight">Encryption Active</p>
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">AES-512 Secure</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: "Server Load", status: "Nominal", color: "text-green-400" },
                          { label: "Network Ping", status: "12ms", color: "text-white" },
                        ].map((stat, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-3">
                            <span className="opacity-40">{stat.label}</span>
                            <span className={stat.color}>{stat.status}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex justify-between items-center">
                <div className="relative group max-w-xl w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Search by Identity or UID..." 
                    className="h-16 pl-14 bg-white border-slate-200 rounded-3xl text-[13px] font-bold shadow-sm focus:ring-8 focus:ring-primary/5 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="h-16 px-10 rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-primary/20">
                  <UserPlus size={20} className="mr-3" />
                  Manual Registration
                </Button>
              </div>

              <Card className="border-slate-200 shadow-sm rounded-[3rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                        <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredUsers.map((user) => (
                        <tr key={user.uid} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-primary/5 transition-all">
                                <User size={26} />
                              </div>
                              <div>
                                <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{user.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reg. {user.joinedAt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <p className="text-[13px] font-black text-slate-900 tracking-tight">{user.mobile}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Hash size={10} className="text-primary" />
                              <p className="text-[10px] font-bold text-primary tracking-widest">{user.uid}</p>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <p className="text-[16px] font-black text-slate-900">₹{user.balance.toLocaleString()}</p>
                          </td>
                          <td className="px-10 py-8">
                            <Badge className={cn(
                              "text-[8px] h-6 px-3 uppercase tracking-widest border-0 shadow-sm",
                              user.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <Button 
                              variant="outline" 
                              className="h-12 px-8 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                              onClick={() => router.push(`/admin/users/${user.uid}`)}
                            >
                              Manage Node
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-5 duration-500">
              <div className="flex justify-between items-center">
                <div className="relative group max-w-xl w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Search by UTR or ID..." 
                    className="h-16 pl-14 bg-white border-slate-200 rounded-3xl text-[13px] font-bold shadow-sm focus:ring-8 focus:ring-primary/5 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Badge className="h-16 px-8 bg-amber-50 text-amber-600 border-amber-200 uppercase font-black text-[12px] rounded-3xl">
                  {filteredOrders.filter(o => o.status === 'in-review').length} Review Nodes Active
                </Badge>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredOrders.filter(o => o.status === 'in-review').length === 0 ? (
                  <div className="xl:col-span-2 py-40 flex flex-col items-center justify-center opacity-20 text-slate-300">
                    <CheckCircle size={80} />
                    <p className="text-[16px] font-black uppercase mt-6 tracking-widest">Review Terminal Clear</p>
                  </div>
                ) : (
                  filteredOrders.filter(o => o.status === 'in-review').map((order) => (
                    <Card key={order.id} className="border-slate-200 shadow-sm rounded-[3rem] overflow-hidden group hover:shadow-2xl transition-all bg-white">
                      <div className="p-10">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex gap-5">
                            <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 border border-amber-100">
                              <History size={28} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Trade ID</span>
                              <h4 className="text-[18px] font-black text-slate-900">{order.id}</h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Value</span>
                            <p className="text-3xl font-black text-slate-900">₹{order.amount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                          <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Hash (UTR/TXID)</span>
                            <div className="flex items-center justify-between">
                              <code className="text-[14px] font-black text-slate-900 tracking-wider">{order.utr || order.txid || "N/A"}</code>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleCopy(order.utr || order.txid || "", "Hash")}>
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contact</span>
                            <p className="text-[14px] font-black text-slate-900">9876543210</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button 
                            variant="outline"
                            className="flex-1 h-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={18} className="mr-3" />
                            Inspect Proof
                          </Button>
                          <Button 
                            className="flex-[2] h-16 rounded-[1.5rem] bg-green-500 hover:bg-green-600 text-white font-black text-[12px] uppercase tracking-widest shadow-xl shadow-green-100"
                            onClick={() => updateOrderStatus(order.id, 'success')}
                          >
                            <CheckCircle2 size={22} className="mr-3" />
                            Approve Node
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-xl bg-white border-0 rounded-[4rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-12">
            <DialogHeader className="mb-10">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl font-black text-slate-900 uppercase">Proof Verification</DialogTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{selectedOrder?.id}</p>
                </div>
                <Badge className="bg-primary text-white border-0 text-[14px] h-10 px-6 uppercase font-black rounded-2xl shadow-xl shadow-primary/20">
                  ₹{selectedOrder?.amount?.toLocaleString()}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-10">
              <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group relative overflow-hidden">
                <div className="flex flex-col items-center gap-5">
                  <Eye size={64} className="opacity-40" />
                  <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Inspect Media</p>
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-slate-200/50">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Claimed Hash</span>
                    <p className="text-xl font-black text-slate-900 tracking-widest">{selectedOrder?.utr || selectedOrder?.txid || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Wait Duration</span>
                    <p className="text-[14px] font-black text-amber-600">12m 45s</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <Button 
                  variant="outline" 
                  className="flex-1 h-20 rounded-[2rem] border-red-100 text-red-500 font-black text-[12px] uppercase tracking-widest hover:bg-red-50"
                  onClick={() => updateOrderStatus(selectedOrder?.id, 'rejected')}
                >
                  <Ban size={22} className="mr-3" />
                  Reject
                </Button>
                <Button 
                  className="flex-[2] h-20 rounded-[2rem] bg-green-500 hover:bg-green-600 text-white font-black text-[13px] uppercase tracking-widest shadow-2xl shadow-green-100"
                  onClick={() => updateOrderStatus(selectedOrder?.id, 'success')}
                >
                  <CheckCircle2 size={26} className="mr-3" />
                  Verify & Approve
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
