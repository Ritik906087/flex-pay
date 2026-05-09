
"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, CheckCircle2, Search, 
  TrendingUp, Wallet, ShieldCheck, ChevronRight, 
  Copy, Ban, IndianRupee, Smartphone, User, 
  Hash, Eye, ExternalLink, ArrowUpRight, 
  ArrowDownRight, MoreVertical, CreditCard,
  History, Settings, LogOut, CheckCircle
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
import Image from "next/image";

// --- MOCK DATA FOR PROTOTYPE ---
const MOCK_USERS = [
  { 
    uid: "FLEX123456", 
    mobile: "9876543210", 
    balance: 12500, 
    status: "active", 
    joinedAt: "2024-01-15", 
    name: "Aryan Sharma",
    linkedAccounts: [
      { appName: "Paytm", upi: "aryan@paytm", mobile: "9876543210", logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(5).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDUpLnBuZyIsImlhdCI6MTc3NTE0ODYzMiwiZXhwIjoxODA2Njg0NjMyfQ.QXSbgSLV3ULTcV3ss9Co9ZMe1oj3tb9bR_OP8xY-Nds" },
      { appName: "PhonePe", upi: "9876543210@ybl", mobile: "9876543210", logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(4).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDQpLnBuZyIsImlhdCI6MTc3NTE0ODYyMSwiZXhwIjoxODA2Njg0NjIxfQ.b_cMHhiCw52krGt2edtt1k5C1Keo8uGJwYIWpe6vZVo" }
    ]
  },
  { 
    uid: "FLEX772101", 
    mobile: "9988776655", 
    balance: 500, 
    status: "active", 
    joinedAt: "2024-02-10", 
    name: "Priya Patel",
    linkedAccounts: [
      { appName: "MobiKwik", upi: "priya@mbk", mobile: "9988776655", logo: "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDEpLnBuZyIsImlhdCI6MTc3NTE0ODU3MywiZXhwIjoxODA2Njg0NTczfQ.m8Z7gn5FV-0ss58kTEUZ833u8Wv_bFun3YZeZtyIa9s" }
    ]
  },
];

export default function AdminPanel() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Modals
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Real-time data
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayVolume: 0, todayCount: 0, totalVolume: 0, totalCount: 0 });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
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
        o.amount.toString().includes(query)
      );
    });
  }, [orders, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Navigation (Desktop) */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">Admin Panel</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">v2.5 PRO</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Overview", icon: LayoutDashboard },
              { id: "users", label: "User Directory", icon: Users },
              { id: "approvals", label: "Approvals", icon: CheckCircle2, badge: orders.filter(o => o.status === 'in-review').length },
              { id: "history", label: "Transaction History", icon: History },
              { id: "settings", label: "System Config", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black",
                    activeTab === item.id ? "bg-white text-primary" : "bg-red-500 text-white"
                  )}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-12" onClick={() => router.push('/')}>
            <LogOut size={18} />
            <span className="text-[11px] font-black uppercase tracking-wider">Exit Terminal</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {activeTab === "dashboard" ? "Network Status" : activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <div className="h-5 w-px bg-slate-200"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <Input 
                placeholder="Quick search..." 
                className="w-64 h-10 pl-9 bg-slate-50 border-transparent rounded-xl text-[11px] font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900">Administrator</p>
                <Badge variant="outline" className="text-[7px] h-4 bg-green-50 text-green-600 border-green-200 uppercase tracking-tighter">System Online</Badge>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 pb-12">
          {/* --- DASHBOARD TAB --- */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Today Volume", value: `₹${stats.todayVolume.toLocaleString()}`, sub: `+${stats.todayCount} transactions`, icon: IndianRupee, color: "text-primary" },
                  { label: "Active Users", value: "1,248", sub: "24 new today", icon: Users, color: "text-blue-600" },
                  { label: "Pending Review", value: orders.filter(o => o.status === 'in-review').length.toString(), sub: "Needs action", icon: CheckCircle2, color: "text-amber-600" },
                  { label: "Total Revenue", value: `₹${stats.totalVolume.toLocaleString()}`, sub: "Lifetime net", icon: Wallet, color: "text-green-600" },
                ].map((item, i) => (
                  <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-3xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{item.label}</CardTitle>
                      <div className={cn("p-2 rounded-xl bg-slate-50", item.color)}>
                        <item.icon size={16} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-black text-slate-900">{item.value}</div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-1">
                        <TrendingUp size={10} className="text-green-500" />
                        {item.sub}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-sm font-black uppercase tracking-tight">Real-time Traffic</CardTitle>
                        <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-0.5">Live network purchase orders</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase">View All Logs</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {orders.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20">
                          <History size={40} />
                          <p className="text-[10px] font-black uppercase mt-3 tracking-widest">No active traffic</p>
                        </div>
                      ) : (
                        orders.slice(0, 8).map((order) => (
                          <div key={order.id} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50/80 transition-all">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-11 h-11 rounded-2xl flex items-center justify-center border",
                                order.status === 'success' ? "bg-green-50 border-green-100 text-green-600" :
                                order.status === 'in-review' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                "bg-slate-50 border-slate-100 text-slate-400"
                              )}>
                                <IndianRupee size={18} />
                              </div>
                              <div>
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{order.id}</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                  {new Date(order.timestamp).toLocaleTimeString()} • UPI Node
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-slate-900">₹{order.amount.toLocaleString()}</p>
                              <Badge className={cn(
                                "text-[7px] h-4 uppercase tracking-tighter border-0",
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

                <div className="space-y-6">
                  <Card className="border-slate-200 shadow-sm rounded-[2rem] bg-slate-900 text-white overflow-hidden relative">
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-60">System Security</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 backdrop-blur-md">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-black tracking-tight">Network Secured</p>
                          <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">SSL Enabled • AES-256</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                          <span className="opacity-50">API Status</span>
                          <span className="text-green-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> Healthy</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                          <span className="opacity-50">Node Uptime</span>
                          <span>99.98%</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-primary/20 rounded-full blur-[40px]"></div>
                  </Card>

                  <Card className="border-slate-200 shadow-sm rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-sm font-black uppercase tracking-tight">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-16 flex-col gap-1.5 rounded-2xl border-slate-100 hover:bg-slate-50 transition-all">
                        <Plus size={16} className="text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Add User</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col gap-1.5 rounded-2xl border-slate-100 hover:bg-slate-50 transition-all">
                        <Smartphone size={16} className="text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Broadcast</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col gap-1.5 rounded-2xl border-slate-100 hover:bg-slate-50 transition-all">
                        <CreditCard size={16} className="text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Payments</span>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col gap-1.5 rounded-2xl border-slate-100 hover:bg-slate-50 transition-all">
                        <Ban size={16} className="text-red-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Blacklist</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* --- USERS TAB --- */}
          {activeTab === "users" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div className="relative group max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    placeholder="Search by name, UID or mobile..." 
                    className="h-14 pl-12 bg-white border-slate-200 rounded-2xl text-[12px] font-bold shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/10">
                  <UserPlus size={18} className="mr-2" />
                  Register New Node
                </Button>
              </div>

              <Card className="border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/80 border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Member Identity</th>
                          <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile / UID</th>
                          <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Balance</th>
                          <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                          <tr key={user.uid} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                                  <User size={22} />
                                </div>
                                <div>
                                  <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{user.name}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Joined {user.joinedAt}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-0.5">
                                <p className="text-[11px] font-black text-slate-900 tracking-tight">{user.mobile}</p>
                                <p className="text-[9px] font-bold text-primary tracking-widest">{user.uid}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-[13px] font-black text-slate-900">₹{user.balance.toLocaleString()}</p>
                            </td>
                            <td className="px-8 py-6">
                              <Badge className={cn(
                                "text-[7px] h-5 px-2 uppercase tracking-widest border-0",
                                user.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              )}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:text-white hover:border-primary transition-all"
                                onClick={() => setSelectedUser(user)}
                              >
                                <ChevronRight size={18} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* --- APPROVALS TAB --- */}
          {activeTab === "approvals" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Review Queue</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {filteredOrders.filter(o => o.status === 'in-review').length} orders pending verification
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200">Export CSV</Button>
                  <Button variant="outline" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200" onClick={loadData}>Refresh Queue</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOrders.filter(o => o.status === 'in-review').length === 0 ? (
                  <div className="lg:col-span-2 py-32 flex flex-col items-center justify-center opacity-20">
                    <CheckCircle size={60} />
                    <p className="text-[12px] font-black uppercase mt-4 tracking-[0.2em]">Queue Clean • All Clear</p>
                  </div>
                ) : (
                  filteredOrders.filter(o => o.status === 'in-review').map((order) => (
                    <Card key={order.id} className="border-slate-200 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all">
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-4">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
                              <History size={24} />
                            </div>
                            <div>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-0.5">Purchase Order</span>
                              <h4 className="text-[14px] font-black text-slate-900 tracking-tight">{order.id}</h4>
                              <p className="text-[9px] font-bold text-primary mt-1 flex items-center gap-1.5 uppercase">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                                Waiting Review
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Value</span>
                            <p className="text-2xl font-black text-slate-900">₹{order.amount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Submitted UTR</span>
                            <div className="flex items-center justify-between">
                              <code className="text-[12px] font-black text-slate-900 tracking-widest">{order.utr || order.txid || "N/A"}</code>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/10" onClick={() => handleCopy(order.utr || order.txid || "", "UTR")}>
                                <Copy size={12} />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Network Node</span>
                            <div className="flex items-center gap-2">
                              <Smartphone size={12} className="text-slate-400" />
                              <span className="text-[10px] font-black text-slate-900 uppercase">9876543210</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} className="mr-2" />
                            Examine Proof
                          </Button>
                          <Button 
                            className="flex-[2] h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-green-200"
                            onClick={() => updateOrderStatus(order.id, 'success')}
                          >
                            <CheckCircle2 size={18} className="mr-2" />
                            Approve Now
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

      {/* --- MODAL: USER DETAILS (REDESIGNED) --- */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl bg-white border-0 rounded-[3rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-10">
            <DialogHeader className="mb-10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                  <User size={40} />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">{selectedUser?.name}</DialogTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">UID: {selectedUser?.uid}</p>
                </div>
              </div>
              <Badge className={cn(
                "h-7 px-4 text-[9px] font-black uppercase tracking-widest border-0",
                selectedUser?.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                Account {selectedUser?.status}
              </Badge>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                {/* Stats Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Main Balance</span>
                    <p className="text-2xl font-black text-primary">₹{selectedUser?.balance?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Total Income</span>
                    <p className="text-2xl font-black text-green-600">₹4,250</p>
                  </div>
                </div>

                {/* Linked Accounts Section (As requested) */}
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={14} className="text-primary" />
                    Linked UPI Terminals
                  </h5>
                  <div className="space-y-3">
                    {selectedUser?.linkedAccounts?.map((acc: any, i: number) => (
                      <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 relative rounded-xl overflow-hidden border border-slate-50">
                            <Image src={acc.logo} alt={acc.appName} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase">{acc.appName}</p>
                            <p className="text-[9px] font-bold text-slate-400 tracking-tight">{acc.upi}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-primary" onClick={() => handleCopy(acc.upi, "UPI ID")}>
                          <Copy size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* User Info Rows */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
                  {[
                    { label: "Phone Number", value: selectedUser?.mobile, icon: Smartphone },
                    { label: "User ID Hash", value: selectedUser?.uid, icon: Hash },
                    { label: "Node Access", value: "Verified Terminal", icon: ShieldCheck },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl text-white/50">
                          <row.icon size={14} />
                        </div>
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{row.label}</span>
                      </div>
                      <span className="text-[11px] font-black tracking-wider">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest">
                      <TrendingUp size={16} className="mr-2" />
                      Add Funds
                    </Button>
                    <Button variant="outline" className="h-14 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest">
                      <Ban size={16} className="mr-2 text-red-500" />
                      Restrict
                    </Button>
                  </div>
                  <Button variant="ghost" className="h-10 text-[9px] font-black text-slate-400 uppercase tracking-widest" onClick={() => setSelectedUser(null)}>
                    Dismiss Terminal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: ORDER REVIEW (LIGHT THEME) --- */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md bg-white border-0 rounded-[3rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-10">
            <DialogHeader className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Proof Inspection</DialogTitle>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Order #{selectedOrder?.id}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-0 text-[11px] h-8 px-4 uppercase font-black">₹{selectedOrder?.amount}</Badge>
              </div>
            </DialogHeader>

            <div className="space-y-8">
              {/* Screenshot Preview Area */}
              <div className="aspect-[3/4] bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group relative overflow-hidden">
                <div className="flex flex-col items-center gap-3 opacity-40 group-hover:opacity-60 transition-all">
                  <Eye size={48} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Click to enlarge</p>
                </div>
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="rounded-full bg-white text-slate-900 font-black text-[9px] uppercase tracking-widest h-9 px-6">
                    <ExternalLink size={14} className="mr-2" /> Open Proof
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Customer UTR</span>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-black text-slate-900 tracking-[0.1em]">{selectedOrder?.utr || selectedOrder?.txid || "N/A"}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleCopy(selectedOrder?.utr || selectedOrder?.txid || "", "UTR")}>
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Elapsed</span>
                    <p className="text-[11px] font-black text-slate-900">12m 45s</p>
                  </div>
                </div>
                
                <div className="h-px bg-slate-200"></div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase">Verification Tip</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Confirm receipt in 'flexpay@upi' statement</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-16 rounded-2xl border-red-100 bg-red-50/50 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all"
                  onClick={() => updateOrderStatus(selectedOrder?.id, 'rejected')}
                >
                  <Ban size={18} className="mr-2" />
                  Reject
                </Button>
                <Button 
                  className="flex-[2] h-16 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-green-200"
                  onClick={() => updateOrderStatus(selectedOrder?.id, 'success')}
                >
                  <CheckCircle2 size={20} className="mr-2" />
                  Approve Order
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserPlus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  )
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
