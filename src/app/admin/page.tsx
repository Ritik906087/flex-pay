
"use client"

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  IndianRupee, Users, Search, History, CheckCircle, Ban, Menu, Clock, 
  Maximize2, ZoomIn, ZoomOut, RotateCw, Eye, SmartphoneIcon, AlertCircle,
  Download, ExternalLink, RefreshCw, X, TrendingUp, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin-sidebar";
import { supabase } from "@/lib/supabase";
import { P2PEngine } from "@/lib/p2p-engine";
import Image from "next/image";

export default function AdminPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ volume: 0, nodes: 0, review: 0, success: 0 });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Admin: Initializing Sync...");

      // 1. Fetch Stats: Total Node Count
      const { count: nodeCount, error: nodeError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (nodeError) console.error("Admin: Profiles Fetch Error", nodeError);

      // 2. Fetch All Profiles for the Users list
      const { data: profileData, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pError) console.error("Admin: Profiles List Error", pError);
      if (profileData) setAllUsers(profileData);

      // 3. Fetch Orders with details
      // Note: Using a simpler query first to avoid join issues if RLS is tricky
      const { data: orderData, error: orderError } = await supabase
        .from('p2p_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderError) {
        console.error("Admin: Orders Fetch Error", orderError);
        throw orderError;
      }

      console.log(`Admin: Successfully fetched ${orderData?.length || 0} orders and ${nodeCount || 0} nodes.`);

      if (orderData) {
        setOrders(orderData);
        const successOrders = orderData.filter(o => o.status === 'success');
        const totalVolume = successOrders.reduce((acc, o) => acc + Number(o.amount), 0);
        
        setStats({
          volume: totalVolume,
          nodes: nodeCount || 0,
          review: orderData.filter(o => o.status === 'in-review').length,
          success: successOrders.length
        });
      }
    } catch (error: any) {
      console.error("Admin Sync Critical Failure:", error.message);
      toast({ 
        variant: "destructive", 
        title: "Sync Failed", 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
    
    // Subscribe to realtime changes
    const adminChannel = supabase
      .channel('admin_live_feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'p2p_orders' }, (payload) => {
        console.log("Realtime: Order change detected", payload);
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        console.log("Realtime: Profile change detected", payload);
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(adminChannel); };
  }, [fetchData]);

  const handleAction = async (orderId: string, status: 'approve' | 'reject') => {
    try {
      if (status === 'approve') {
        const { error } = await P2PEngine.approveOrder(orderId);
        if (error) throw error;
        toast({ title: "Approved", description: "Order settled successfully." });
      } else {
        const { error } = await P2PEngine.rejectOrder(orderId);
        if (error) throw error;
        toast({ variant: "destructive", title: "Rejected", description: "Funds returned to seller." });
      }
      setSelectedOrder(null);
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Action Failed", description: error.message });
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'in-review');

  const resetImage = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] relative overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
          router.push(`/admin?tab=${tab}`);
        }} 
        pendingCount={pendingOrders.length} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={cn(
        "flex-1 transition-all duration-300 w-full min-h-screen flex flex-col",
        isSidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h2 className="text-[12px] lg:text-[14px] font-black text-slate-900 uppercase tracking-tighter hidden sm:block">Control Center</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
             <Button variant="ghost" size="sm" onClick={fetchData} className="text-slate-400 h-10 w-10 rounded-xl bg-slate-50 border border-slate-100">
               <RefreshCw size={14} className={cn(loading && "animate-spin")} />
             </Button>
             <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <Input placeholder="Search system..." className="w-64 h-11 pl-10 bg-slate-50 border-transparent rounded-2xl text-[11px] font-bold focus:bg-white transition-all" />
             </div>
          </div>
        </header>

        <main className="p-4 lg:p-10 max-w-[1600px] w-full mx-auto flex-1">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                 {[
                   { label: "Gross Volume", value: `₹${stats.volume.toLocaleString()}`, icon: IndianRupee, color: "text-blue-500", bg: "bg-blue-50" },
                   { label: "Active Nodes", value: stats.nodes.toString(), icon: Users, color: "text-primary", bg: "bg-blue-50/50" },
                   { label: "Review Queue", value: stats.review.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                   { label: "Settled", value: stats.success.toString(), icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
                 ].map((stat, i) => (
                   <Card key={i} className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                     <CardContent className="p-5 lg:p-8">
                       <div className="flex justify-between items-start mb-3 lg:mb-5">
                         <div className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                           <stat.icon size={20} />
                         </div>
                       </div>
                       <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                       <h3 className="text-base lg:text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                     </CardContent>
                   </Card>
                 ))}
              </div>

              <Card className="border-0 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Recent Terminal Activity</h3>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-primary">View Full Logs</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-8 py-4">Transaction ID</th>
                          <th className="px-8 py-4">Amount</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4">Timestamp</th>
                          <th className="px-8 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center opacity-30">
                              <History size={40} className="mx-auto mb-3" />
                              <p className="text-[10px] font-black uppercase tracking-widest">No terminal data synchronized</p>
                            </td>
                          </tr>
                        ) : (
                          orders.slice(0, 10).map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-5">
                                <span className="text-[11px] font-black text-slate-900">{order.id}</span>
                              </td>
                              <td className="px-8 py-5">
                                <span className="text-[11px] font-black text-slate-900">₹{order.amount}</span>
                              </td>
                              <td className="px-8 py-5">
                                <Badge className={cn(
                                  "text-[8px] font-black uppercase border-0 h-6 px-3",
                                  order.status === 'success' ? "bg-emerald-50 text-emerald-600" :
                                  order.status === 'in-review' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"
                                )}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="px-8 py-5 text-[10px] font-bold text-slate-400">
                                {new Date(order.created_at).toLocaleString()}
                              </td>
                              <td className="px-8 py-5 text-right">
                                <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(order); setActiveTab('approvals'); }} className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary">
                                  <Eye size={14} />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {allUsers.length === 0 ? (
                <div className="col-span-full py-40 flex flex-col items-center justify-center opacity-20">
                  <Users size={80} />
                  <p className="text-[16px] font-black uppercase mt-6 tracking-widest">No Nodes Detected</p>
                </div>
              ) : (
                allUsers.map((u) => (
                  <Card key={u.id} className="border-0 shadow-sm rounded-[2rem] bg-white overflow-hidden p-6 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                        <Users size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-black text-slate-900 uppercase truncate">{u.name || 'Anonymous'}</h4>
                        <p className="text-[10px] font-bold text-slate-400 tracking-tight">{u.mobile}</p>
                      </div>
                      <Badge className={cn(
                        "h-6 px-3 text-[8px] font-black uppercase border-0",
                        u.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      )}>{u.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Balance</span>
                        <p className="text-[14px] font-black text-slate-900">₹{u.balance}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Locked</span>
                        <p className="text-[14px] font-black text-slate-900">₹{u.locked_balance}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => router.push(`/admin/users/${u.id}`)}
                      className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[9px] tracking-widest"
                    >
                      Audit Identity
                    </Button>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8">
              {pendingOrders.length === 0 ? (
                <div className="xl:col-span-2 py-40 flex flex-col items-center justify-center opacity-20">
                  <CheckCircle size={80} className="text-emerald-500" />
                  <p className="text-[16px] font-black uppercase mt-6 tracking-widest text-slate-400">Review Queue Clear</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <Card key={order.id} className="border-slate-200 shadow-sm rounded-[2rem] bg-white overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 lg:p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</span>
                            <h4 className="text-[14px] lg:text-[16px] font-black text-slate-900">{order.id}</h4>
                         </div>
                         <Badge className="bg-amber-50 text-amber-600 h-8 px-4 font-black text-[9px]">AWAITING AUDIT</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Requested Settlement</span>
                            <p className="text-lg lg:text-2xl font-black text-slate-900">₹{order.amount}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 overflow-hidden">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1 block">UTR Reference</span>
                            <p className="text-[11px] font-black text-primary truncate tracking-wider">{order.utr}</p>
                         </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90" onClick={() => setSelectedOrder(order)}>
                        <Eye size={16} className="mr-2" /> INSPECT EVIDENCE
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-5xl w-[98%] lg:w-[95%] bg-white rounded-[2rem] lg:rounded-[3rem] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="p-4 lg:p-8 flex flex-col h-[90vh] lg:h-[85vh]">
            <div className="flex justify-between items-center mb-4 lg:mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-sm lg:text-xl font-black uppercase text-slate-900">Evidence Audit</h2>
                  <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Protocol</p>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                 <Button variant="ghost" size="icon" onClick={() => selectedOrder?.screenshot_url && window.open(selectedOrder.screenshot_url)} className="text-slate-400 hover:text-primary h-10 w-10 bg-slate-50 rounded-xl">
                    <ExternalLink size={18} />
                 </Button>
                 <Badge className="h-10 lg:h-12 px-4 lg:px-8 text-sm lg:text-xl font-black bg-primary rounded-2xl border-0 shadow-lg shadow-primary/20">₹{selectedOrder?.amount}</Badge>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-8 no-scrollbar">
              <div className="flex-[1.5] min-h-[400px] flex flex-col gap-4">
                 <div className="flex-1 bg-slate-50 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex items-center justify-center">
                    {selectedOrder?.screenshot_url ? (
                      <div 
                        className="w-full h-full relative" 
                        style={{ 
                          transform: `scale(${zoom}) rotate(${rotation}deg) translate(${offset.x}px, ${offset.y}px)`, 
                          transition: isDragging ? 'none' : 'transform 0.2s' 
                        }}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseMove={(e) => {
                          if (isDragging) {
                            setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
                          }
                        }}
                      >
                        <Image src={selectedOrder.screenshot_url} alt="Proof" fill className="object-contain" priority unoptimized />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-300">
                        <AlertCircle size={48} className="mb-4 opacity-50" />
                        <span className="text-[10px] font-black uppercase">No Proof Uploaded</span>
                      </div>
                    )}

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20">
                      <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="h-10 w-10 hover:bg-white"><ZoomOut size={16} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(5, z + 0.2))} className="h-10 w-10 hover:bg-white"><ZoomIn size={16} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setRotation(r => r + 90)} className="h-10 w-10 hover:bg-white"><RotateCw size={16} /></Button>
                      <Button variant="ghost" size="icon" onClick={resetImage} className="h-10 w-10 hover:bg-white"><Maximize2 size={16} /></Button>
                    </div>
                 </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 lg:gap-6 pb-4">
                <div className="bg-slate-50 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 space-y-6">
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Context</h3>
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Buyer Reference</span>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                           <Users size={14} className="text-primary" />
                           <p className="text-[11px] font-black truncate">{selectedOrder?.buyer_id || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Merchant Terminal</span>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                           <TrendingUp size={14} className="text-emerald-500" />
                           <p className="text-[11px] font-black truncate text-primary">{selectedOrder?.seller_upi}</p>
                        </div>
                      </div>
                   </div>

                   <div className="h-px bg-slate-200" />

                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase">UTR Number</span>
                        <span className="text-[11px] font-black text-primary tracking-widest">{selectedOrder?.utr}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 rounded-2xl border-red-100 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50" onClick={() => handleAction(selectedOrder.id, 'reject')}>REJECT</Button>
                  <Button className="h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20" onClick={() => handleAction(selectedOrder.id, 'approve')}>APPROVE</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
