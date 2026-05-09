
"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, CheckCircle2, Search, 
  TrendingUp, Wallet, ShieldCheck, ChevronRight, 
  Copy, Ban, IndianRupee, Smartphone, User, 
  Hash, Eye, ExternalLink, ArrowUpRight, 
  ArrowDownRight, MoreVertical, CreditCard,
  History, Settings, LogOut, CheckCircle, Plus, UserPlus,
  Trash2, Filter
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
  const [userSearchQuery, setUserSearchQuery] = useState("");
  
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
        (o.txid && o.txid.toLowerCase().includes(query)) ||
        o.amount.toString().includes(query)
      );
    });
  }, [orders, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- PERMANENT SIDEBAR NAVIGATION --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-[13px] font-black text-slate-900 tracking-tight uppercase">Admin Terminal</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Control</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "System Overview", icon: LayoutDashboard },
              { id: "users", label: "User Directory", icon: Users },
              { id: "approvals", label: "Review Queue", icon: CheckCircle2, badge: orders.filter(o => o.status === 'in-review').length },
              { id: "history", label: "Trade Logs", icon: History },
              { id: "settings", label: "Configurations", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                  activeTab === item.id 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={cn(
                    "transition-colors",
                    activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-primary"
                  )} />
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

        <div className="mt-auto p-8 border-t border-slate-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl h-12" 
            onClick={() => router.push('/')}
          >
            <LogOut size={18} />
            <span className="text-[11px] font-black uppercase tracking-wider">Exit Terminal</span>
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 ml-72">
        {/* Top Header Bar */}
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
                placeholder="Global Terminal Search..." 
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
          {/* --- DASHBOARD VIEW --- */}
          {activeTab === "dashboard" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Today Volume", value: `₹${stats.todayVolume.toLocaleString()}`, sub: `${stats.todayCount} Node Success`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/5" },
                  { label: "Active Nodes", value: "1,248", sub: "99.9% Uptime", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Pending Verification", value: orders.filter(o => o.status === 'in-review').length.toString(), sub: "Awaiting review", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
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

              {/* Main Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between bg-slate-50/30">
                    <div>
                      <CardTitle className="text-[14px] font-black uppercase tracking-tight">Real-time Terminal Activity</CardTitle>
                      <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-1">Live incoming trade nodes</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest border-slate-200">Export Logs</Button>
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
                                "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-all",
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

                {/* Right Sidebar Widgets */}
                <div className="space-y-8">
                  <Card className="border-slate-200 shadow-xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
                    <CardHeader className="relative z-10 p-8">
                      <CardTitle className="text-[11px] font-black uppercase tracking-widest opacity-50">Node Health Terminal</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 px-8 pb-10">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 backdrop-blur-xl shadow-2xl">
                          <ShieldCheck size={28} />
                        </div>
                        <div>
                          <p className="text-xl font-black tracking-tight">Encryption Active</p>
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">AES-512 End-to-End</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: "Server Load", status: "Nominal", color: "text-green-400" },
                          { label: "Active Nodes", status: "1,248 Nodes", color: "text-white" },
                          { label: "Network Ping", status: "12ms", color: "text-white" },
                        ].map((stat, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-3">
                            <span className="opacity-40">{stat.label}</span>
                            <span className={stat.color}>{stat.status}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]"></div>
                  </Card>

                  <Card className="border-slate-200 shadow-sm rounded-[2.5rem] p-4">
                    <CardHeader className="px-4 pt-4 pb-6">
                      <CardTitle className="text-[13px] font-black uppercase tracking-tight">Quick Terminal Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Register Node", icon: UserPlus, color: "text-primary" },
                        { label: "Sync API", icon: Smartphone, color: "text-blue-500" },
                        { label: "Node Payouts", icon: CreditCard, color: "text-amber-500" },
                        { label: "Global Lock", icon: Ban, color: "text-red-500" },
                      ].map((action, i) => (
                        <Button key={i} variant="outline" className="h-24 flex-col gap-3 rounded-3xl border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all shadow-sm">
                          <action.icon size={20} className={action.color} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{action.label}</span>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* --- USERS VIEW --- */}
          {activeTab === "users" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex justify-between items-center">
                <div className="relative group max-w-xl w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Search UID, Mobile, or Member Name..." 
                    className="h-16 pl-14 bg-white border-slate-200 rounded-3xl text-[13px] font-bold shadow-sm focus:ring-8 focus:ring-primary/5 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="h-16 px-10 rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all">
                  <UserPlus size={20} className="mr-3" />
                  Manual Node Registration
                </Button>
              </div>

              <Card className="border-slate-200 shadow-sm rounded-[3rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Identity</th>
                          <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact / UID</th>
                          <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Liquid Balance</th>
                          <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Status</th>
                          <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                          <tr key={user.uid} className="group hover:bg-slate-50/50 transition-all">
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-[1.5rem] bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                                  <User size={26} />
                                </div>
                                <div>
                                  <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{user.name}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reg. {user.joinedAt}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="space-y-1">
                                <p className="text-[13px] font-black text-slate-900 tracking-tight">{user.mobile}</p>
                                <div className="flex items-center gap-1.5">
                                  <Hash size={10} className="text-primary" />
                                  <p className="text-[10px] font-bold text-primary tracking-widest">{user.uid}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-2">
                                <p className="text-[16px] font-black text-slate-900">₹{user.balance.toLocaleString()}</p>
                                <ArrowUpRight size={14} className="text-green-500" />
                              </div>
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
                                className="h-12 px-8 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                View Detailed Node
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

          {/* --- APPROVALS VIEW --- */}
          {activeTab === "approvals" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-5 duration-500">
              <div className="flex justify-between items-center">
                <div className="relative group max-w-xl w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input 
                    placeholder="Global Filter by UTR, Amount, UID..." 
                    className="h-16 pl-14 bg-white border-slate-200 rounded-3xl text-[13px] font-bold shadow-sm focus:ring-8 focus:ring-primary/5 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="h-16 px-8 rounded-3xl font-black text-[11px] uppercase tracking-widest border-slate-200">
                    <Filter size={18} className="mr-2" />
                    Advanced Filters
                  </Button>
                  <Badge className="h-16 px-8 bg-amber-50 text-amber-600 border-amber-200 uppercase font-black text-[12px] rounded-3xl shadow-sm">
                    {filteredOrders.filter(o => o.status === 'in-review').length} Verification Nodes Active
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredOrders.filter(o => o.status === 'in-review').length === 0 ? (
                  <div className="xl:col-span-2 py-40 flex flex-col items-center justify-center opacity-20">
                    <CheckCircle size={80} />
                    <p className="text-[16px] font-black uppercase mt-6 tracking-[0.3em]">Review Terminal Clear</p>
                  </div>
                ) : (
                  filteredOrders.filter(o => o.status === 'in-review').map((order) => (
                    <Card key={order.id} className="border-slate-200 shadow-sm rounded-[3rem] overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all bg-white">
                      <div className="p-10">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex gap-5">
                            <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 border border-amber-100 shadow-inner">
                              <History size={28} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-1">Trade Instance</span>
                              <h4 className="text-[18px] font-black text-slate-900 tracking-tight">{order.id}</h4>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Awaiting Proof Verification</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-1">Asset Value</span>
                            <p className="text-3xl font-black text-slate-900">₹{order.amount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                          <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Claimed Hash (UTR/TXID)</span>
                            <div className="flex items-center justify-between">
                              <code className="text-[14px] font-black text-slate-900 tracking-[0.15em]">{order.utr || order.txid || "N/A"}</code>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => handleCopy(order.utr || order.txid || "", "Hash")}>
                                <Copy size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Node Member Contact</span>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                <Smartphone size={14} />
                              </div>
                              <span className="text-[12px] font-black text-slate-900 tracking-wider">9876543210</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button 
                            variant="outline"
                            className="flex-1 h-16 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={18} className="mr-3" />
                            Inspect Proof
                          </Button>
                          <Button 
                            className="flex-[2] h-16 rounded-[1.5rem] bg-green-500 hover:bg-green-600 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-green-200 border-0"
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

      {/* --- MODAL: USER DETAILS (MODERN SLIDE-IN STYLE) --- */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-6xl bg-white border-0 rounded-[4rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>User Node Management: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex h-[85vh]">
            {/* Sidebar Profile Info */}
            <div className="w-[400px] bg-slate-50 border-r border-slate-100 p-12 flex flex-col shadow-inner">
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white border-4 border-white flex items-center justify-center text-slate-200 shadow-2xl mb-6 group relative overflow-hidden">
                  <User size={64} className="group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{selectedUser?.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Hash size={12} className="text-primary" />
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{selectedUser?.uid}</p>
                </div>
                <Badge className={cn(
                  "h-8 px-6 text-[10px] font-black uppercase tracking-widest border-0 shadow-lg",
                  selectedUser?.status === 'active' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}>
                  Node {selectedUser?.status}
                </Badge>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">Liquid Capital</span>
                  <div className="flex items-center justify-between">
                    <p className="text-4xl font-black text-primary tracking-tight">₹{selectedUser?.balance?.toLocaleString()}</p>
                    <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-inner">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-2">Network Credentials</h5>
                  {[
                    { label: "Phone Terminal", value: selectedUser?.mobile, icon: Smartphone },
                    { label: "Identity Hash", value: selectedUser?.uid, icon: Hash },
                    { label: "Verification", value: "Level 2 VIP", icon: ShieldCheck },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-4 bg-white/50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 text-slate-400">
                        <row.icon size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{row.label}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-700">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto grid grid-cols-1 gap-4 pt-10">
                <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20">
                  <Plus size={18} className="mr-3" />
                  Adjust Balance
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 font-black text-[11px] uppercase tracking-widest transition-all">
                  <Ban size={18} className="mr-3" />
                  Suspend Access
                </Button>
              </div>
            </div>

            {/* Detailed Analytics/History Area */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-12 flex-1 overflow-y-auto no-scrollbar">
                <Tabs defaultValue="linked" className="w-full">
                  <TabsList className="flex w-full bg-slate-50/50 h-16 p-2 rounded-[1.5rem] border border-slate-100 mb-10">
                    <TabsTrigger value="linked" className="flex-1 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all">
                      <CreditCard size={18} className="mr-3" />
                      Linked Terminal VPA
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all">
                      <History size={18} className="mr-3" />
                      Trade Log History
                    </TabsTrigger>
                    <TabsTrigger value="node-payouts" className="flex-1 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-primary transition-all">
                      <TrendingUp size={18} className="mr-3" />
                      Node Payouts
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="linked" className="mt-0 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {selectedUser?.linkedAccounts?.map((acc: any, i: number) => (
                        <Card key={i} className="border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl shadow-slate-100/50 hover:border-primary/20 hover:-translate-y-1 transition-all group bg-white">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner p-2 bg-slate-50">
                              <Image src={acc.logo} alt={acc.appName} fill className="object-contain p-2" />
                            </div>
                            <div>
                              <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{acc.appName}</p>
                              <code className="text-[11px] font-bold text-slate-400 tracking-wider block mt-1">{acc.upi}</code>
                              <div className="flex items-center gap-1.5 mt-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified Hub</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-12 w-12 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all" onClick={() => handleCopy(acc.upi, "UPI ID")}>
                            <Copy size={18} />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-0 space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input 
                          placeholder="Search trade logs by Hash, Value, or Status..." 
                          className="h-14 pl-14 bg-slate-50 border-slate-100 rounded-2xl text-[12px] font-bold transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 shadow-inner"
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-100 font-black text-[10px] uppercase tracking-widest">
                        <Filter size={18} className="mr-2" />
                        Sort Logs
                      </Button>
                    </div>
                    
                    <Card className="border-slate-100 rounded-[2.5rem] p-10 bg-slate-50/30 border-dashed border-2">
                      <div className="flex flex-col items-center justify-center py-20 opacity-20 text-slate-900">
                        <History size={64} />
                        <p className="text-[14px] font-black uppercase mt-6 tracking-[0.4em]">Node History Empty</p>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="p-12 border-t border-slate-100 flex justify-end bg-slate-50/20">
                <Button variant="ghost" className="h-14 px-10 rounded-2xl font-black text-[12px] uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all" onClick={() => setSelectedUser(null)}>
                  Exit Management View
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL: ORDER PROOF INSPECTION --- */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-xl bg-white border-0 rounded-[4rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-12">
            <DialogHeader className="mb-10">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Proof Verification</DialogTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Order Terminal: {selectedOrder?.id}</p>
                </div>
                <Badge className="bg-primary text-white border-0 text-[14px] h-10 px-6 uppercase font-black rounded-2xl shadow-xl shadow-primary/20">
                  ₹{selectedOrder?.amount?.toLocaleString()}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-10">
              {/* Receipt Area */}
              <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 group relative overflow-hidden shadow-inner">
                <div className="flex flex-col items-center gap-5 group-hover:scale-110 transition-all duration-500">
                  <Eye size={64} className="opacity-40" />
                  <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-40">Inspect Receipt</p>
                </div>
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <Button variant="secondary" className="rounded-2xl bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest h-14 px-10 shadow-2xl border-0">
                    <ExternalLink size={18} className="mr-3" /> 
                    View Source Media
                  </Button>
                </div>
              </div>

              {/* Order Context Card */}
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
                <div className="flex justify-between items-center pb-6 border-b border-slate-200/50">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-2">Member Claimed UTR</span>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-black text-slate-900 tracking-[0.15em]">{selectedOrder?.utr || selectedOrder?.txid || "N/A"}</p>
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-primary hover:bg-primary/5 rounded-xl" onClick={() => handleCopy(selectedOrder?.utr || selectedOrder?.txid || "", "Hash")}>
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] block mb-2">Wait Duration</span>
                    <p className="text-[14px] font-black text-amber-600">12m 45s</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm shadow-slate-100">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-slate-900 uppercase">Automated Verification Hub</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Receipt Source: flexpay@upi statement logs</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6">
                <Button 
                  variant="outline" 
                  className="flex-1 h-20 rounded-[2rem] border-red-100 bg-red-50/30 text-red-500 font-black text-[12px] uppercase tracking-[0.25em] hover:bg-red-50 transition-all border-2"
                  onClick={() => updateOrderStatus(selectedOrder?.id, 'rejected')}
                >
                  <Ban size={22} className="mr-3" />
                  Reject
                </Button>
                <Button 
                  className="flex-[2] h-20 rounded-[2rem] bg-green-500 hover:bg-green-600 text-white font-black text-[13px] uppercase tracking-[0.25em] shadow-2xl shadow-green-200 border-0 transition-all active:scale-[0.98]"
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
