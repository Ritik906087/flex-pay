
"use client"

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Smartphone, User, Hash, ShieldCheck, 
  TrendingUp, CreditCard, History, Plus, Ban, 
  ChevronLeft, Copy, Search, Filter, Menu, RefreshCw, 
  SmartphoneIcon, Wallet, Activity, ChevronRight,
  Settings2, PlusCircle, MinusCircle, Equal, IndianRupee, MessageSquare, AlertTriangle
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
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logSearch, setLogSearch] = useState("");
  
  // Balance Management State
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustType, setAdjustType] = useState<'add' | 'sub' | 'set'>('add');
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch user profile and linked terminals
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select(`
          *,
          linked_accounts (*)
        `)
        .eq('id', userId)
        .single();

      if (pError) throw pError;
      setUser(profile);

      // Fetch P2P activity
      const { data: orderData, error: oError } = await supabase
        .from('p2p_orders')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (oError) throw oError;
      setOrders(orderData || []);

      // Fetch Admin Adjustments Logs
      const { data: logData, error: lError } = await supabase
        .from('admin_balance_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (lError) {
        console.error("Admin logs fetch error:", lError.message);
      } else {
        setAdminLogs(logData || []);
      }

    } catch (error: any) {
      toast({ variant: "destructive", title: "Audit Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceUpdate = async () => {
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive numeric value." });
      return;
    }

    if (!adjustReason.trim()) {
      toast({ variant: "destructive", title: "Reason Required", description: "Please explain why this change is being made." });
      return;
    }

    try {
      setIsUpdatingBalance(true);
      
      // Get admin ID if available from Supabase session
      const { data: { user: adminAuthUser } } = await supabase.auth.getUser();
      const adminId = adminAuthUser?.id || null; // Fallback to null for bypass login

      // Use RPC for guaranteed balance and log atomic update
      const { error: rpcError } = await supabase.rpc('admin_adjust_balance_v2', {
        p_user_id: userId,
        p_admin_id: adminId,
        p_amount: amount,
        p_type: adjustType,
        p_reason: adjustReason
      });

      if (rpcError) throw rpcError;

      toast({ 
        title: "Protocol Success", 
        description: "Assets modified for node " + userId.slice(0, 8).toUpperCase()
      });
      
      setIsBalanceDialogOpen(false);
      setAdjustAmount("");
      setAdjustReason("");
      
      // Artificial delay to ensure DB propagation before re-fetch
      setTimeout(() => fetchUserData(), 500);

    } catch (error: any) {
      console.error("RPC Error:", error.message);
      toast({ variant: "destructive", title: "System Overload", description: error.message });
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: label + " copied to clipboard." });
  };

  // Combine both P2P and Admin logs for history tab
  const combinedLogs = useMemo(() => {
    const all = [
      ...orders.map(o => ({ ...o, entryType: 'p2p' })),
      ...adminLogs.map(l => ({ ...l, entryType: 'admin', id: "LOG-" + l.id.slice(0, 8), amount: l.amount, status: 'manual' }))
    ];
    
    // Sort by date
    all.sort((a, b) => new Date(b.created_at || b.timestamp).getTime() - new Date(a.created_at || a.timestamp).getTime());

    if (!logSearch) return all;
    const q = logSearch.toLowerCase();
    return all.filter(o => 
      o.id.toLowerCase().includes(q) || 
      (o.utr && o.utr.toLowerCase().includes(q)) || 
      (o.reason && o.reason.toLowerCase().includes(q)) ||
      o.amount.toString().includes(q)
    );
  }, [orders, adminLogs, logSearch]);

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <RefreshCw className="animate-spin text-primary mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Local Terminals...</p>
      </div>
    );
  }

  const userBalance = Number(user?.balance || 0);
  const lockedBalance = Number(user?.locked_balance || 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar 
        activeTab="users" 
        onTabChange={(tab) => router.push("/admin?tab=" + tab)} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden"><Menu size={20}/></Button>
             <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><ChevronLeft size={20}/></button>
             <h2 className="text-[12px] font-black uppercase tracking-tighter hidden sm:block">Identity Audit: <span className="text-primary">{user?.name}</span></h2>
          </div>
          <div className="flex items-center gap-3">
             <Badge className={cn("h-8 px-4 text-[9px] font-black uppercase", user?.status === 'active' ? "bg-emerald-500" : "bg-red-500")}>{user?.status} NODE</Badge>
             <Button variant="ghost" size="icon" onClick={fetchUserData} className="rounded-xl border border-slate-100"><RefreshCw size={14} className={loading ? "animate-spin" : ""}/></Button>
          </div>
        </header>

        <main className="p-4 lg:p-10 max-w-[1600px] w-full mx-auto flex flex-col xl:flex-row gap-8">
          <aside className="w-full xl:w-[400px] space-y-6">
            <Card className="border-0 shadow-sm rounded-[2.5rem] bg-white p-8">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100 shadow-inner">
                  <User size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">{user?.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {user?.id.slice(0, 8).toUpperCase()}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Liquid Balance</span>
                  <p className="text-3xl font-black mb-6">₹{userBalance.toLocaleString()}</p>
                  
                  <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest h-14 rounded-2xl shadow-xl shadow-black/10">
                        <Settings2 size={16} className="mr-2" /> MANAGE ASSETS
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md rounded-[2rem] p-8 border-0">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase flex items-center gap-3"><Wallet className="text-primary"/> Wallet Control</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold uppercase text-slate-400">Node Asset Modification Protocol</DialogDescription>
                      </DialogHeader>
                      <div className="py-6 space-y-6">
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'add', label: 'ADD', icon: PlusCircle, color: 'text-emerald-500' },
                            { id: 'sub', label: 'DEDUCT', icon: MinusCircle, color: 'text-red-500' },
                            { id: 'set', label: 'SET', icon: Equal, color: 'text-blue-500' },
                          ].map(t => (
                            <button key={t.id} onClick={() => setAdjustType(t.id as any)} className={cn("p-4 rounded-2xl border transition-all flex flex-col items-center gap-2", adjustType === t.id ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50")}>
                              <t.icon size={20} className={adjustType === t.id ? "text-primary" : t.color} />
                              <span className="text-[8px] font-black uppercase">{t.label}</span>
                            </button>
                          ))}
                        </div>
                        
                        <div className="space-y-3">
                           <div className="relative">
                             <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                             <Input type="number" placeholder="0.00" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} className="h-14 pl-10 bg-slate-50 border-0 rounded-2xl text-lg font-black"/>
                           </div>
                           
                           <div className="relative">
                             <MessageSquare className="absolute left-4 top-4 text-slate-400" size={16} />
                             <textarea 
                               placeholder="Audit reason for this change..." 
                               value={adjustReason}
                               onChange={e => setAdjustReason(e.target.value)}
                               className="w-full min-h-[100px] bg-slate-50 border-0 rounded-2xl p-4 pl-10 text-[11px] font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                             />
                           </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleBalanceUpdate} disabled={isUpdatingBalance || !adjustAmount || !adjustReason} className="w-full h-14 bg-slate-900 hover:bg-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl">
                          {isUpdatingBalance ? <RefreshCw className="animate-spin mr-2" size={14}/> : <ShieldCheck className="mr-2" size={14}/>} COMMIT CHANGES
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Wallet size={120} className="absolute -bottom-6 -right-6 opacity-10 rotate-12" />
                </div>

                <div className="space-y-2">
                   {[
                     { label: "Mobile", value: user?.mobile, icon: Smartphone },
                     { label: "Locked", value: "₹" + lockedBalance.toLocaleString(), icon: Ban },
                     { label: "Registered", value: new Date(user?.created_at).toLocaleDateString(), icon: Activity },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400">
                          <item.icon size={14} />
                          <span className="text-[8px] font-black uppercase">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-900">{item.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            </Card>
          </aside>

          <div className="flex-1 space-y-6">
             <Tabs defaultValue="linked" className="w-full">
                <TabsList className="w-full bg-white h-16 p-2 rounded-[2rem] border border-slate-100 shadow-sm">
                   <TabsTrigger value="linked" className="flex-1 rounded-2xl text-[10px] font-black uppercase">Terminals ({user?.linked_accounts?.length || 0})</TabsTrigger>
                   <TabsTrigger value="history" className="flex-1 rounded-2xl text-[10px] font-black uppercase">Audit History ({combinedLogs.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="linked" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                   {user?.linked_accounts?.length === 0 ? (
                     <div className="col-span-full py-20 text-center opacity-30 bg-white rounded-[2rem] border-2 border-dashed border-slate-200"><p className="text-[10px] font-black uppercase">No Linked Terminals</p></div>
                   ) : (
                     user?.linked_accounts?.map((acc: any, i: number) => (
                       <Card key={i} className="border-0 p-6 rounded-[2rem] bg-white shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100">
                               {acc.logo ? <Image src={acc.logo} alt="" width={40} height={40} className="object-contain" unoptimized /> : <SmartphoneIcon className="text-slate-200" />}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <span className="text-[12px] font-black text-slate-900 uppercase">{acc.app_name}</span>
                                  <div className={cn("w-1.5 h-1.5 rounded-full", acc.is_online ? "bg-emerald-500" : "bg-slate-300")} />
                               </div>
                               <code className="text-[10px] font-black text-primary block mt-0.5">{acc.upi}</code>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(acc.upi, "UPI")} className="text-slate-300"><Copy size={14}/></Button>
                       </Card>
                     ))
                   )}
                </TabsContent>

                <TabsContent value="history" className="mt-6 space-y-4">
                   <div className="bg-white p-4 rounded-[1.8rem] border border-slate-100 shadow-sm flex gap-4">
                      <div className="relative flex-1">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <Input placeholder="Search History, Reasons, UTR..." value={logSearch} onChange={e => setLogSearch(e.target.value)} className="h-12 pl-10 bg-slate-50 border-0 rounded-xl text-[11px] font-bold uppercase"/>
                      </div>
                   </div>
                   <div className="grid gap-3">
                      {combinedLogs.map((o, i) => (
                        <Card key={i} className={cn(
                          "border-0 p-5 rounded-[1.8rem] bg-white shadow-sm flex items-center justify-between",
                          o.entryType === 'admin' ? "border-l-4 border-amber-400" : ""
                        )}>
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center", 
                                o.status === 'success' ? "bg-emerald-50 text-emerald-500" : 
                                o.entryType === 'admin' ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"
                              )}>
                                 {o.entryType === 'admin' ? <ShieldCheck size={18} /> : <History size={18} />}
                              </div>
                              <div className="max-w-[300px]">
                                 <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-black uppercase tracking-tight">{o.id}</span>
                                    {o.entryType === 'admin' && <Badge className="text-[7px] bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">ADMIN ADJ</Badge>}
                                 </div>
                                 <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5 truncate">
                                    {new Date(o.created_at || o.timestamp).toLocaleString()} {o.utr ? " • UTR: " + o.utr : ""}
                                    {o.reason && <span className="text-slate-900 block mt-1 normal-case italic">Reason: {o.reason}</span>}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className={cn(
                                "text-lg font-black",
                                o.type === 'sub' ? "text-red-500" : o.type === 'add' ? "text-emerald-500" : "text-slate-900"
                              )}>
                                {o.type === 'sub' ? '-' : o.type === 'add' ? '+' : ''}₹{o.amount.toLocaleString()}
                              </p>
                              <Badge variant="outline" className={cn(
                                "text-[7px] font-black border-slate-100 h-5 px-2 uppercase",
                                o.status === 'success' ? "text-emerald-500" : "text-slate-400"
                              )}>{o.status}</Badge>
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

