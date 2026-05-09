
"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  TrendingUp, Wallet, ShieldCheck, 
  IndianRupee, User, Users,
  Hash, Eye, ArrowUpRight, 
  CheckCircle2, Search, History, CheckCircle, Ban, Copy, Menu, Clock, Maximize2
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
import Image from "next/image";

const APP_LOGOS = {
  Paytm: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(5).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDUpLnBuZyIsImlhdCI6MTc3NTE0ODYzMiwiZXhwIjoxODA2Njg0NjMyfQ.QXSbgSLV3ULTcV3ss9Co9ZMe1oj3tb9bR_OP8xY-Nds",
  PhonePe: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(4).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDQpLnBuZyIsImlhdCI6MTc3NTE0ODYyMSwiZXhwIjoxODA2Njg0NjIxfQ.b_cMHhiCw52krGt2edtt1k5C1Keo8uGJwYIWpe6vZVo",
  MobiKwik: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDEpLnBuZyIsImlhdCI6MTc3NTE0ODU3MywiZXhwIjoxODA2Njg0NTczfQ.m8Z7gn5FV-0ss58kTEUZ833u8Wv_bFun3YZeZtyIa9s",
  Freecharge: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDMpLnBuZyIsImlhdCI6MTc3NTE0ODYwOSwiZXhwIjoxODA2Njg0NjA5fQ.pus8pOlgEXCFb2pjIzNsVtU9DxnIxEeaVaeR3TuIQPc"
};

export default function AdminPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [stats, setStats] = useState({ todayVolume: 0, todayCount: 0, totalVolume: 0, totalCount: 0 });

  useEffect(() => {
    const existingOrders = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    if (existingOrders.length === 0) {
      const now = Date.now();
      const demoOrders = [
        { 
          id: "#ORD55201", 
          amount: 5000, 
          profitPercent: 6, 
          bonus: 5, 
          status: 'in-review', 
          utr: '884210992341', 
          timestamp: now - 120000,
          userName: "Aryan Sharma",
          userMobile: "9876543210",
          buyerMethod: { appName: "PhonePe", upi: "aryan@ybl", logo: APP_LOGOS.PhonePe },
          receiver: { appName: "MobiKwik", upi: "flexpay@upi", logo: APP_LOGOS.MobiKwik }
        },
        { 
          id: "#ORD55202", 
          amount: 1500, 
          profitPercent: 6, 
          bonus: 5, 
          status: 'in-review', 
          utr: '772109448211', 
          timestamp: now - 300000,
          userName: "Priya Patel",
          userMobile: "9988776655",
          buyerMethod: { appName: "Paytm", upi: "priya@paytm", logo: APP_LOGOS.Paytm },
          receiver: { appName: "PhonePe", upi: "flexpay@upi", logo: APP_LOGOS.PhonePe }
        },
        { 
          id: "#ORD55203", 
          amount: 12000, 
          profitPercent: 6, 
          bonus: 5, 
          status: 'success', 
          utr: '992104423188', 
          timestamp: now - 3600000,
          userName: "Vikram Singh",
          userMobile: "9123456789",
          buyerMethod: { appName: "MobiKwik", upi: "vikram@mbk", logo: APP_LOGOS.MobiKwik },
          receiver: { appName: "Paytm", upi: "flexpay@upi", logo: APP_LOGOS.Paytm }
        }
      ];
      localStorage.setItem('flexpay_orders', JSON.stringify(demoOrders));
    }
    
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

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
        o.amount.toString().includes(query) ||
        (o.userName && o.userName.toLowerCase().includes(query))
      );
    });
  }, [orders, searchQuery]);

  const pendingApprovalsCount = orders.filter(o => o.status === 'in-review').length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        pendingCount={pendingApprovalsCount} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "ml-72" : "ml-0"
      )}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-slate-600 mr-2">
                <Menu size={20} />
              </Button>
            )}
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
          </div>
        </header>

        <main className="p-10 pb-20 max-w-[1600px] mx-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Today Volume", value: `₹${stats.todayVolume.toLocaleString()}`, sub: `${stats.todayCount} Node Success`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/5" },
                  { label: "Active Nodes", value: MOCK_USERS.length.toString(), sub: "99.9% Uptime", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Pending Verification", value: pendingApprovalsCount.toString(), sub: "Awaiting review", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
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
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <div className="relative group max-w-xl w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Search by Identity or Mobile..." 
                    className="h-16 pl-14 bg-white border-slate-200 rounded-3xl text-[13px] font-bold shadow-sm focus:ring-8 focus:ring-primary/5 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <div className="relative group max-w-xl w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Search by UTR, ID, or Mobile..." 
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
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Hash (UTR)</span>
                            <code className="text-[14px] font-black text-slate-900 tracking-wider">{order.utr || "N/A"}</code>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">User</span>
                            <p className="text-[12px] font-black text-slate-900 uppercase">{order.userName || "Aryan Sharma"}</p>
                          </div>
                        </div>

                        <Button 
                          className="w-full h-16 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest shadow-xl shadow-primary/5"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={18} className="mr-3" />
                          Inspect Proof
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Verification Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl bg-white border-0 rounded-[3rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-10">
            <DialogHeader className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Proof Verification</DialogTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedOrder?.id} • Node Process</p>
                </div>
                <Badge className="bg-primary text-white text-[16px] h-10 px-6 font-black rounded-2xl">
                  ₹{selectedOrder?.amount?.toLocaleString()}
                </Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column - Evidence */}
              <div className="space-y-4">
                <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 relative group overflow-hidden">
                  <div className="flex flex-col items-center gap-4 text-center px-6">
                    <Maximize2 size={48} className="opacity-20" />
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-40">Verification Evidence</p>
                  </div>
                  {/* Overlay for hover preview */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                      className="bg-white text-slate-900 hover:bg-white/90 rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest"
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      View Full Image
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Maximize2 size={16} className="mr-2" />
                  View Full Image
                </Button>
              </div>

              {/* Right Column - Audit Trails */}
              <div className="space-y-6 flex flex-col h-full">
                {/* Receiver Info */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Receiver Terminal</h5>
                  <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-white border border-slate-200 p-1.5 shadow-sm">
                      {selectedOrder?.receiver?.logo && (
                        <Image src={selectedOrder.receiver.logo} alt="Receiver" fill className="object-contain" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{selectedOrder?.receiver?.appName || "Merchant Node"}</p>
                      <p className="text-[10px] font-bold text-primary tracking-widest">{selectedOrder?.receiver?.upi || "flexpay@upi"}</p>
                    </div>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Buyer Payment Method</h5>
                  <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-white border border-slate-200 p-1.5 shadow-sm">
                      {selectedOrder?.buyerMethod?.logo && (
                        <Image src={selectedOrder.buyerMethod.logo} alt="Buyer" fill className="object-contain" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{selectedOrder?.buyerMethod?.appName || "Payment App"}</p>
                      <p className="text-[10px] font-bold text-slate-500 tracking-widest">{selectedOrder?.buyerMethod?.upi || "user@upi"}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Metadata */}
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction UTR</span>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-black text-slate-900 tracking-widest">{selectedOrder?.utr}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => handleCopy(selectedOrder?.utr, "UTR")}>
                        <Copy size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Process Time</span>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={12} />
                      <p className="text-[11px] font-black uppercase tracking-widest">{new Date(selectedOrder?.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 rounded-2xl border-red-100 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50"
                    onClick={() => updateOrderStatus(selectedOrder?.id, 'rejected')}
                  >
                    <Ban size={20} className="mr-3" />
                    Reject
                  </Button>
                  <Button 
                    className="h-16 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-[12px] uppercase tracking-widest shadow-xl shadow-green-100"
                    onClick={() => updateOrderStatus(selectedOrder?.id, 'success')}
                  >
                    <CheckCircle2 size={22} className="mr-3" />
                    Verify & Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Image Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] bg-slate-950 border-0 p-0 flex flex-col rounded-[2rem] overflow-hidden">
          <DialogHeader className="p-6 bg-slate-900 flex flex-row items-center justify-between">
            <DialogTitle className="text-white text-[14px] font-black uppercase tracking-widest">Verification Proof Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-slate-900 relative p-10 flex items-center justify-center">
             <div className="flex flex-col items-center gap-6 opacity-30 text-white">
               <Maximize2 size={120} />
               <p className="text-lg font-black uppercase tracking-[0.5em]">Sandbox Preview Restricted</p>
             </div>
          </div>
          <div className="p-6 bg-slate-900 border-t border-white/5 flex justify-end">
            <Button 
              className="bg-white text-slate-900 hover:bg-white/90 rounded-xl h-12 px-10 font-black text-[11px] uppercase tracking-widest"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
