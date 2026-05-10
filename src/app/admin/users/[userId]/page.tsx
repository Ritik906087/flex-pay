
"use client"

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Smartphone, User, Hash, ShieldCheck, 
  TrendingUp, CreditCard, History, Plus, Ban, 
  ChevronLeft, Copy, Search, Filter, Menu, RefreshCw, 
  SmartphoneIcon, Wallet, Activity, ChevronRight,
  Settings2, PlusCircle, MinusCircle, Equal
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
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logSearch, setLogSearch] = useState("");
  
  // Balance Management State
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<'add' | 'sub' | 'set'>('add');
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log(`Admin: Fetching full audit data for node ${userId}`);
      
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

      const { data: orderData, error: oError } = await supabase
        .from('p2p_orders')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (oError) throw oError;
      setOrders(orderData || []);

    } catch (error: any) {
      console.error("Audit Fetch Error:", error.message);
      toast({ variant: "destructive", title: "Audit Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceUpdate = async () => {
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount < 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive numeric value." });
      return;
    }

    try {
      setIsUpdatingBalance(true);
      
      // Step 1: Get latest balance directly from DB to avoid stale state
      const { data: currentData, error: fetchError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const currentBalance = Number(currentData.balance || 0);
      let newBalance = currentBalance;

      if (adjustType === 'add') {
        newBalance = currentBalance + amount;
      } else if (adjustType === 'sub') {
        newBalance = Math.max(0, currentBalance - amount);
      } else if (adjustType === 'set') {
        newBalance = amount;
      }

      console.log(`Admin DB Sync: Updating ${userId} from ${currentBalance} to ${newBalance}`);

      // Step 2: Perform update
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Step 3: Local Sync
      setUser((prev: any) => ({ ...prev, balance: newBalance }));
      
      toast({ 
        title: "Success", 
        description: `Balance updated to ₹${newBalance.toLocaleString()}.` 
      });
      
      setIsBalanceDialogOpen(false);
      setAdjustAmount("");
      
      // Verification fetch
      fetchUserData();

    } catch (error: any) {
      console.error("Balance Update Error:", error);
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  const filteredLogs = useMemo(() => {
    if (!logSearch) return orders;
    const q = logSearch.toLowerCase();
    return orders.filter(o => 
      o.id.toLowerCase().includes(q) || 
      (o.utr && o.utr.toLowerCase().includes(q)) || 
      o.amount.toString().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  }, [orders, logSearch]);

  if (loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="relative">
          <RefreshCw className="animate-spin text-primary" size={48} />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse"></div>
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing Identity Audit...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border border-slate-100 max-w-sm">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Ban size={40} />
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase mb-2">Node Not Found</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">The requested protocol identity does not exist in the registry.</p>
          <Button onClick={() => router.push('/admin')} className="w-full rounded-2xl h-12 font-black uppercase tracking-widest bg-slate-900">Return to Terminal</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <AdminSidebar 
        activeTab="users" 
        onTabChange={(tab) => router.push(`/admin?tab=${tab}`)} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:gap-6">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 lg:hidden">
               <Menu size={20} />
            </Button>
            <button 
              onClick={() => router.push('/admin?tab=users')}
              className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-primary transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">
                Identity Audit: <span className="text-primary">{user.name}</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Badge className={cn(
                "h-8 px-4 lg:px-6 text-[8px] lg:text-[10px] font-black uppercase tracking-widest border-0 shadow-lg hidden sm:flex",
                user.status === 'active' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-red-500 text-white shadow-red-500/20"
              )}>
                {user.status} NODE
             </Badge>
             <Button variant="ghost" size="icon" onClick={fetchUserData} className="rounded-xl h-10 w-10 bg-slate-50 border border-slate-100">
                <RefreshCw size={14} className={cn(loading && "animate-spin")} />
             </Button>
          </div>
        </header>

        <main className="p-4 lg:p-10 max-w-[1600px] w-full mx-auto space-y-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Profile Summary Column */}
            <aside className="w-full xl:w-[450px] space-y-8 shrink-0">
              <Card className="border-0 shadow-sm rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden bg-white p-8 lg:p-12 relative">
                <div className="absolute top-0 right-0 p-8">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 border border-slate-100">
                      <ShieldCheck size={24} />
                   </div>
                </div>

                <div className="flex flex-col items-center text-center mb-10 mt-4">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] lg:rounded-[3.5rem] bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-white shadow-xl flex items-center justify-center text-slate-200 mb-6 group relative overflow-hidden">
                    <User size={56} className="group-hover:scale-110 transition-transform duration-500 text-slate-300" />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{user.name || 'ANONYMOUS NODE'}</h3>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                    <Hash size={12} className="text-primary" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{user.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block">Liquid Balance</span>
                          <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                                <Settings2 size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-[2rem] p-8 bg-white border-0 shadow-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase text-slate-900 flex items-center gap-3">
                                  <Wallet className="text-primary" /> Manage Assets
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                                  Manually adjust liquidity for node: {user.id.slice(0, 8).toUpperCase()}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="py-6 space-y-6">
                                <div className="grid grid-cols-3 gap-3">
                                  {[
                                    { id: 'add', label: 'ADD', icon: PlusCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                    { id: 'sub', label: 'DEDUCT', icon: MinusCircle, color: 'text-red-500', bg: 'bg-red-50' },
                                    { id: 'set', label: 'SET', icon: Equal, color: 'text-blue-500', bg: 'bg-blue-50' },
                                  ].map((type) => (
                                    <button
                                      key={type.id}
                                      onClick={() => setAdjustType(type.id as any)}
                                      className={cn(
                                        "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
                                        adjustType === type.id 
                                          ? "border-primary bg-primary/5 shadow-inner" 
                                          : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                                      )}
                                    >
                                      <type.icon size={20} className={cn("mb-2", adjustType === type.id ? "text-primary" : type.color)} />
                                      <span className="text-[8px] font-black uppercase">{type.label}</span>
                                    </button>
                                  ))}
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Adjustment Amount (₹)</label>
                                  <Input 
                                    type="number" 
                                    placeholder="Enter amount..." 
                                    value={adjustAmount}
                                    onChange={(e) => setAdjustAmount(e.target.value)}
                                    className="h-14 bg-slate-50 border-slate-100 rounded-2xl text-lg font-black focus:bg-white transition-all px-6"
                                  />
                                </div>
                              </div>

                              <DialogFooter className="flex-col sm:flex-row gap-3">
                                <Button variant="ghost" onClick={() => setIsBalanceDialogOpen(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest flex-1">CANCEL</Button>
                                <Button 
                                  onClick={handleBalanceUpdate} 
                                  disabled={isUpdatingBalance}
                                  className="rounded-xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest flex-[2] h-12 shadow-xl shadow-slate-900/20"
                                >
                                  {isUpdatingBalance ? <RefreshCw className="animate-spin mr-2" size={14} /> : null}
                                  EXECUTE PROTOCOL
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                       </div>
                       <div className="flex items-center justify-between">
                          <p className="text-3xl lg:text-4xl font-black tracking-tighter">₹{Number(user.balance || 0).toLocaleString()}</p>
                          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <TrendingUp size={18} className="text-emerald-400" />
                          </div>
                       </div>
                    </div>
                    <Wallet size={120} className="absolute -bottom-6 -right-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: "Phone Identifier", value: user.mobile, icon: Smartphone, color: "text-blue-500" },
                      { label: "Locked Assets", value: `₹${Number(user.locked_balance || 0).toLocaleString()}`, icon: Ban, color: "text-red-500" },
                      { label: "Registered At", value: new Date(user.created_at).toLocaleDateString(), icon: Activity, color: "text-amber-500" },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 text-slate-400">
                          <row.icon size={16} className={row.color} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{row.label}</span>
                        </div>
                        <span className="text-[11px] font-black text-slate-900 tracking-tight">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </aside>

            {/* Main Tabs Column */}
            <div className="flex-1 space-y-6">
              <Tabs defaultValue="linked" className="w-full">
                <TabsList className="w-full bg-white h-16 p-2 rounded-[2rem] border border-slate-100 mb-8 shadow-sm flex">
                  <TabsTrigger value="linked" className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20">
                    <CreditCard size={16} className="mr-2 hidden sm:block" />
                    Terminal Registry ({user.linked_accounts?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20">
                    <History size={16} className="mr-2 hidden sm:block" />
                    Network Logs ({orders.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="linked" className="mt-0 space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {user.linked_accounts?.length === 0 ? (
                       <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 opacity-30">
                          <Plus size={48} className="mb-4" />
                          <p className="text-[11px] font-black uppercase tracking-widest">No Terminal Registered</p>
                       </div>
                    ) : (
                      user.linked_accounts?.map((acc: any, i: number) => (
                        <Card key={i} className="border-0 p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-between shadow-sm bg-white hover:shadow-md transition-all group">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 relative rounded-2xl overflow-hidden border border-slate-100 p-2 bg-slate-50 group-hover:scale-105 transition-transform">
                              {acc.logo ? (
                                <Image src={acc.logo} alt={acc.app_name} fill className="object-contain p-1" unoptimized />
                              ) : (
                                <SmartphoneIcon className="w-full h-full text-slate-200" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{acc.app_name}</p>
                                <Badge className={cn(
                                  "h-5 px-2 text-[7px] font-black uppercase border-0",
                                  acc.is_online ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                )}>{acc.is_online ? "Live" : "Idle"}</Badge>
                              </div>
                              <code className="text-[10px] font-black text-primary block mt-1 tracking-wider">{acc.upi}</code>
                              <span className="text-[8px] font-bold text-gray-400 uppercase block mt-0.5">{acc.account_holder_name || 'Verification Pending'}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(acc.upi, "UPI ID")} className="h-10 w-10 rounded-xl text-slate-300 hover:text-primary hover:bg-primary/5">
                            <Copy size={14} />
                          </Button>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 space-y-6 animate-in fade-in duration-500">
                   <div className="bg-white p-4 lg:p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1 group">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                         <Input 
                            placeholder="Audit logs by ID, UTR, or Amount..." 
                            className="h-14 pl-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white text-[11px] font-bold uppercase transition-all"
                            value={logSearch}
                            onChange={(e) => setLogSearch(e.target.value)}
                         />
                      </div>
                      <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-slate-50 border-slate-100 text-slate-500 font-black uppercase text-[10px] tracking-widest hidden sm:flex">
                         <Filter size={16} className="mr-2" /> Filter Registry
                      </Button>
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      {filteredLogs.length === 0 ? (
                         <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 opacity-20">
                            <Activity size={64} />
                            <p className="text-[14px] font-black uppercase mt-4 tracking-[0.3em]">No Network Logs</p>
                         </div>
                      ) : (
                         filteredLogs.map((order, i) => (
                           <Card key={i} className="bg-white p-6 lg:p-8 rounded-[2rem] border-0 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-all gap-4">
                              <div className="flex items-center gap-5">
                                 <div className={cn(
                                   "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                   order.status === 'success' ? "bg-emerald-50 text-emerald-500" : 
                                   order.status === 'in-review' ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-400"
                                 )}>
                                   <History size={20} />
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-3">
                                      <h4 className="text-[13px] font-black uppercase tracking-tighter text-slate-900">{order.id}</h4>
                                      <Badge variant="outline" className="text-[8px] font-black border-slate-100 h-5 px-2">{order.buyer_id === userId ? "BUYER" : "SELLER"}</Badge>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                      {new Date(order.created_at).toLocaleString()} {order.utr ? `• UTR: ${order.utr}` : ''}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12 pl-16 sm:pl-0">
                                 <div className="text-right">
                                    <p className="text-lg lg:text-xl font-black text-slate-900 tracking-tighter">₹{Number(order.amount).toLocaleString()}</p>
                                    <span className={cn(
                                      "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block",
                                      order.status === 'success' ? "text-emerald-500 bg-emerald-50" : "text-slate-400 bg-slate-100"
                                    )}>{order.status}</span>
                                 </div>
                                 <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-primary">
                                    <ChevronRight size={18} />
                                 </Button>
                              </div>
                           </Card>
                         ))
                      )}
                   </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
