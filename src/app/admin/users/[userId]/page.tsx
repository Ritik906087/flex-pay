
"use client"

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Smartphone, User, Hash, ShieldCheck, 
  TrendingUp, CreditCard, History, Plus, Ban, 
  ChevronLeft, Copy, Search, Filter, Menu, RefreshCw, 
  SmartphoneIcon, Wallet, Activity, ChevronRight,
  Settings2, PlusCircle, MinusCircle, Equal, IndianRupee, MessageSquare, AlertTriangle,
  Fingerprint, Globe, Cpu, HardDrive, Monitor, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AdminSidebar } from "@/components/admin-sidebar";
import { supabase } from "@/lib/supabase";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params.userId as string;

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  const [securityIntel, setSecurityIntel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logSearch, setLogSearch] = useState("");
  
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustType, setAdjustType] = useState<'add' | 'sub' | 'set'>('add');
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      setUser(profile);

      const { data: accounts } = await supabase.from('linked_accounts').select('*').eq('user_id', userId);
      setLinkedAccounts(accounts || []);

      const { data: orderData } = await supabase.from('p2p_orders').select('*').or(`buyer_id.eq.${userId},seller_id.eq.${userId}`).order('created_at', { ascending: false });
      setOrders(orderData || []);

      const { data: logData } = await supabase.from('admin_balance_logs').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      setAdminLogs(logData || []);

      // Fetch Security Intel
      const { data: security } = await supabase.from('security_events').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      setSecurityIntel(security || []);

    } catch (error: any) {
      toast({ variant: "destructive", title: "Audit Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleBalanceUpdate = async () => {
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (!adjustReason.trim()) return;

    try {
      setIsUpdatingBalance(true);
      const { data: { user: adminAuthUser } } = await supabase.auth.getUser();
      
      const { error: rpcError } = await supabase.rpc('admin_adjust_balance_v2', {
        p_user_id: userId,
        p_amount: amount,
        p_type: adjustType,
        p_reason: adjustReason,
        p_admin_id: adminAuthUser?.id || null
      });

      if (rpcError) throw rpcError;
      toast({ title: "Asset Updated", description: "Ledger updated successfully." });
      setIsBalanceDialogOpen(false);
      fetchUserData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  const combinedLogs = useMemo(() => {
    const all = [
      ...orders.map(o => ({ ...o, entryType: 'p2p', timestamp: o.created_at })),
      ...adminLogs.map(l => ({ ...l, entryType: 'admin', id: "ADJ-" + l.id.slice(0, 8).toUpperCase(), amount: Number(l.amount), status: 'COMPLETE', type: l.type, timestamp: l.created_at, remark: l.reason }))
    ];
    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (!logSearch) return all;
    const q = logSearch.toLowerCase();
    return all.filter(o => o.id.toLowerCase().includes(q) || (o.remark && o.remark.toLowerCase().includes(q)) || (o.reason && o.reason.toLowerCase().includes(q)));
  }, [orders, adminLogs, logSearch]);

  const latestIntel = securityIntel[0]?.details;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar activeTab="users" onTabChange={(tab) => router.push("/admin?tab=" + tab)} isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={cn("flex-1 transition-all duration-300 min-h-screen flex flex-col", isSidebarOpen ? "lg:ml-72" : "ml-0")}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden"><Menu size={20}/></Button>
             <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary"><ChevronLeft size={20}/></button>
             <h2 className="text-[12px] font-black uppercase tracking-tighter sm:block">Identity Intelligence: <span className="text-primary">{user?.name}</span></h2>
          </div>
          <div className="flex items-center gap-3">
             <Badge className={cn("h-8 px-4 text-[9px] font-black uppercase", user?.status === 'active' ? "bg-emerald-500" : "bg-red-500")}>{user?.status} Node</Badge>
             <Button variant="ghost" size="icon" onClick={fetchUserData} className="rounded-xl border border-slate-100"><RefreshCw size={14} className={loading ? "animate-spin" : ""}/></Button>
          </div>
        </header>

        <main className="p-4 lg:p-10 max-w-[1600px] w-full mx-auto flex flex-col xl:flex-row gap-8">
          <aside className="w-full xl:w-[400px] space-y-6">
            <Card className="border-0 shadow-sm rounded-[2.5rem] bg-white p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-inner">
                  <User size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">{user?.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {user?.id.slice(0, 8).toUpperCase()}</p>
              </div>

              {latestIntel && (
                <div className={cn(
                  "mb-8 p-6 rounded-[2rem] border flex flex-col items-center gap-3",
                  latestIntel.riskLevel === 'high-risk' ? "bg-red-50 border-red-100 text-red-600" :
                  latestIntel.riskLevel === 'suspicious' ? "bg-amber-50 border-amber-100 text-amber-600" :
                  "bg-emerald-50 border-emerald-100 text-emerald-600"
                )}>
                  <ShieldAlert size={32} />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest">Risk Score: {latestIntel.riskScore}</p>
                    <p className="text-xl font-black uppercase tracking-tighter">{latestIntel.riskLevel}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Liquid Balance</span>
                  <p className="text-3xl font-black mb-6">₹{Number(user?.balance || 0).toLocaleString()}</p>
                  
                  <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl shadow-xl shadow-black/10">
                        <Settings2 size={16} className="mr-2" /> ADJUST ASSETS
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md rounded-[2rem] p-8 border-0">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase flex items-center gap-3"><Wallet className="text-primary"/> Wallet Control</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Node Asset Modification Protocol</DialogDescription>
                      </DialogHeader>
                      <div className="py-6 space-y-6">
                        <div className="grid grid-cols-3 gap-3">
                          {['add', 'sub', 'set'].map(t => (
                            <button key={t} onClick={() => setAdjustType(t as any)} className={cn("p-4 rounded-2xl border transition-all flex flex-col items-center gap-2", adjustType === t ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50")}>
                               <span className="text-[8px] font-black uppercase">{t}</span>
                            </button>
                          ))}
                        </div>
                        <div className="space-y-3">
                           <Input type="number" placeholder="0.00" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} className="h-14 bg-slate-50 border-0 rounded-2xl text-lg font-black"/>
                           <textarea placeholder="Audit reason..." value={adjustReason} onChange={e => setAdjustReason(e.target.value)} className="w-full min-h-[100px] bg-slate-50 border-0 rounded-2xl p-4 text-[11px] font-bold resize-none" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleBalanceUpdate} disabled={isUpdatingBalance} className="w-full h-14 bg-slate-900 hover:bg-black font-black uppercase text-[10px] tracking-widest rounded-2xl">
                          {isUpdatingBalance ? <RefreshCw className="animate-spin mr-2" size={14}/> : <ShieldCheck className="mr-2" size={14}/>} COMMIT CHANGES
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          </aside>

          <div className="flex-1 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "IP Location", value: latestIntel?.network?.city || 'Unknown', icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "ISP Provider", value: latestIntel?.network?.isp?.slice(0, 15) || 'Unknown', icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
                  { label: "Device Fingerprint", value: latestIntel?.fingerprintId?.slice(0, 10) || 'Unknown', icon: Fingerprint, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "VPN Status", value: latestIntel?.network?.vpn ? 'DETECTED' : 'SECURE', icon: ShieldCheck, color: latestIntel?.network?.vpn ? "text-red-500" : "text-emerald-500", bg: latestIntel?.network?.vpn ? "bg-red-50" : "bg-emerald-50" },
                ].map((item, i) => (
                  <Card key={i} className="border-0 shadow-sm rounded-3xl p-5 bg-white">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-4", item.bg, item.color)}>
                      <item.icon size={18} />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                    <p className="text-[12px] font-black text-slate-900 truncate mt-0.5">{item.value}</p>
                  </Card>
                ))}
             </div>

             <Tabs defaultValue="intel" className="w-full">
                <TabsList className="w-full bg-white h-16 p-2 rounded-[2rem] border border-slate-100 shadow-sm">
                   <TabsTrigger value="intel" className="flex-1 rounded-2xl text-[10px] font-black uppercase">Device Intel</TabsTrigger>
                   <TabsTrigger value="linked" className="flex-1 rounded-2xl text-[10px] font-black uppercase">Terminals ({linkedAccounts.length})</TabsTrigger>
                   <TabsTrigger value="history" className="flex-1 rounded-2xl text-[10px] font-black uppercase">Audit Logs ({combinedLogs.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="intel" className="mt-6 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-0 p-8 rounded-[2.5rem] bg-white shadow-sm space-y-6">
                         <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><Cpu size={16} className="text-primary" /> Hardware Signals</h4>
                         <div className="space-y-4">
                            {[
                              { label: "Operating System", value: latestIntel?.device?.os, icon: Monitor },
                              { label: "CPU Cores", value: latestIntel?.device?.cores, icon: Cpu },
                              { label: "RAM Estimate", value: `${latestIntel?.device?.ram} GB`, icon: HardDrive },
                              { label: "Resolution", value: latestIntel?.device?.resolution, icon: Monitor },
                            ].map((s, i) => (
                              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{s.label}</span>
                                <span className="text-[11px] font-black text-slate-900">{s.value || 'N/A'}</span>
                              </div>
                            ))}
                         </div>
                      </Card>
                      <Card className="border-0 p-8 rounded-[2.5rem] bg-white shadow-sm space-y-6">
                         <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2"><Globe size={16} className="text-primary" /> Network Signals</h4>
                         <div className="space-y-4">
                            {[
                              { label: "Public IP", value: latestIntel?.network?.ip },
                              { label: "ISP / Carrier", value: latestIntel?.network?.isp },
                              { label: "Country / State", value: `${latestIntel?.network?.country}, ${latestIntel?.network?.region}` },
                              { label: "Proxy / TOR", value: latestIntel?.network?.proxy || latestIntel?.network?.tor ? 'DETECTED' : 'NONE' },
                            ].map((s, i) => (
                              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{s.label}</span>
                                <span className="text-[11px] font-black text-slate-900 truncate ml-4">{s.value || 'N/A'}</span>
                              </div>
                            ))}
                         </div>
                      </Card>
                   </div>
                </TabsContent>

                <TabsContent value="linked" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                   {linkedAccounts.map((acc: any, i: number) => (
                     <Card key={i} className="border-0 p-6 rounded-[2rem] bg-white shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center p-2.5 border border-slate-100">
                               {acc.logo ? <Image src={acc.logo} alt="" width={44} height={44} className="object-contain" unoptimized /> : <SmartphoneIcon className="text-slate-200" />}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-black text-slate-900 uppercase">{acc.app_name}</span>
                                  <div className={cn("w-2 h-2 rounded-full", acc.is_online ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                               </div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{acc.is_online ? 'Terminal Online' : 'Terminal Offline'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                           <div className="col-span-2">
                              <span className="text-[7px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Virtual Payment Address</span>
                              <p className="text-[12px] font-black text-primary tracking-tight">{acc.upi}</p>
                           </div>
                        </div>
                     </Card>
                   ))}
                </TabsContent>

                <TabsContent value="history" className="mt-6 space-y-4">
                   <div className="grid gap-3 pb-10">
                      {combinedLogs.map((o, i) => (
                        <Card key={i} className={cn("border-0 p-5 rounded-[1.8rem] bg-white shadow-sm flex items-center justify-between border-l-4", o.entryType === 'admin' ? "border-amber-400" : "border-primary")}>
                           <div className="flex items-center gap-4 overflow-hidden">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", o.status === 'success' || o.status === 'COMPLETE' ? "bg-emerald-50 text-emerald-500" : o.entryType === 'admin' ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500")}>
                                 {o.entryType === 'admin' ? <ShieldCheck size={18} /> : <History size={18} />}
                              </div>
                              <div className="min-w-0">
                                 <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[12px] font-black uppercase tracking-tight truncate">{o.id}</span>
                                    {o.entryType === 'admin' && <Badge className="text-[7px] bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 h-4 uppercase">ADMIN ADJUST</Badge>}
                                 </div>
                                 <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5 truncate">{new Date(o.timestamp).toLocaleString()} {o.utr ? " • UTR: " + o.utr : ""}</p>
                                 {(o.remark || o.reason) && <p className="mt-1 text-[9px] font-bold text-slate-600 leading-tight italic truncate">"{o.remark || o.reason}"</p>}
                              </div>
                           </div>
                           <div className="text-right shrink-0 ml-4">
                              <p className={cn("text-lg font-black", o.type === 'sub' || (o.entryType === 'p2p' && o.status === 'rejected') ? "text-red-500" : o.type === 'add' || o.status === 'success' ? "text-emerald-500" : "text-slate-900")}>
                                {o.type === 'sub' ? '-' : o.type === 'add' ? '+' : ''}₹{Number(o.amount).toLocaleString()}
                              </p>
                              <Badge variant="outline" className={cn("text-[7px] font-black border-slate-100 h-5 px-2 uppercase", o.status === 'success' || o.status === 'COMPLETE' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400")}>{o.status}</Badge>
                           </div>
                        </Card>
                      ))}
                   </div>
                </TabsContent>
             </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
