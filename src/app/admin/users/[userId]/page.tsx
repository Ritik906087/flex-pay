
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Smartphone, User, Hash, ShieldCheck, 
  TrendingUp, CreditCard, History, Plus, Ban, 
  ChevronLeft, Copy, Search, Filter, Menu, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch profile
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

      // Fetch user specific orders
      const { data: orderData, error: oError } = await supabase
        .from('p2p_orders')
        .select('*')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (oError) throw oError;
      setOrders(orderData || []);

    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4">Node Identity Not Found</h1>
          <Button onClick={() => router.push('/admin')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar 
        activeTab="users" 
        onTabChange={(tab) => router.push(`/admin?tab=${tab}`)} 
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
            <button 
              onClick={() => router.push('/admin?tab=users')}
              className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">
              Manage Node: {user.name}
            </h2>
          </div>
          <Badge className={cn(
            "h-8 px-6 text-[10px] font-black uppercase tracking-widest border-0 shadow-lg",
            user.status === 'active' ? "bg-green-500 text-white" : "bg-red-500 text-white"
          )}>
            Node {user.status}
          </Badge>
        </header>

        <main className="p-10 max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[400px] space-y-8">
              <Card className="border-slate-200 shadow-sm rounded-[3rem] overflow-hidden bg-white p-10">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-200 shadow-inner mb-6 relative group overflow-hidden">
                    <User size={48} className="group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{user.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Hash size={12} className="text-primary" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">Liquid Assets</span>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-black text-primary tracking-tight">₹{Number(user.balance || 0).toLocaleString()}</p>
                      <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                        <TrendingUp size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Mobile", value: user.mobile, icon: Smartphone },
                      { label: "Locked", value: `₹${Number(user.locked_balance || 0).toLocaleString()}`, icon: Ban },
                      { label: "UID", value: user.id.slice(0, 8).toUpperCase(), icon: Hash },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2.5 text-slate-400">
                          <row.icon size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">{row.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-700">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex-1">
              <Tabs defaultValue="linked" className="w-full">
                <TabsList className="flex w-full bg-white h-16 p-2 rounded-[1.5rem] border border-slate-100 mb-8 shadow-sm">
                  <TabsTrigger value="linked" className="flex-1 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                    <CreditCard size={16} className="mr-2" />
                    Terminals ({user.linked_accounts?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                    <History size={16} className="mr-2" />
                    Network Logs ({orders.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="linked" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.linked_accounts?.map((acc: any, i: number) => (
                      <Card key={i} className="border-slate-100 p-6 rounded-[2rem] flex items-center justify-between shadow-sm bg-white">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded-xl overflow-hidden border border-slate-50 p-1 bg-slate-50">
                            {acc.logo && <Image src={acc.logo} alt={acc.app_name} fill className="object-contain p-1" />}
                          </div>
                          <div>
                            <p className="text-[12px] font-black text-slate-900 uppercase">{acc.app_name}</p>
                            <code className="text-[10px] font-bold text-primary block mt-0.5">{acc.upi}</code>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest mt-1 inline-block",
                              acc.is_online ? "text-green-500" : "text-slate-300"
                            )}>
                              {acc.is_online ? "Online" : "Offline"}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(acc.upi, "UPI ID")}>
                          <Copy size={14} className="text-slate-300" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 space-y-4">
                   {orders.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center opacity-20 border-2 border-dashed rounded-[3rem]">
                        <History size={48} />
                        <p className="text-[12px] font-black uppercase mt-4 tracking-widest">No Trade Data</p>
                      </div>
                   ) : (
                      orders.map((order, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                order.status === 'success' ? "bg-green-50 text-green-500" : "bg-slate-50 text-slate-400"
                              )}>
                                <History size={18} />
                              </div>
                              <div>
                                 <h4 className="text-[12px] font-black uppercase">{order.id}</h4>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">
                                   {new Date(order.created_at).toLocaleDateString()} • {order.buyer_id === userId ? "BUY" : "SELL"}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[14px] font-black">₹{order.amount}</p>
                              <Badge className={cn(
                                "text-[8px] font-black uppercase px-2 h-5 border-0",
                                order.status === 'success' ? "bg-green-500" : "bg-slate-200 text-slate-600"
                              )}>
                                {order.status}
                              </Badge>
                           </div>
                        </div>
                      ))
                   )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
