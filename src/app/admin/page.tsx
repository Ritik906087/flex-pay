
"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  IndianRupee, Users, Search, History, CheckCircle, Ban, Menu, Clock, 
  Maximize2, ZoomIn, ZoomOut, RotateCw, Eye, SmartphoneIcon, AlertCircle,
  Download, ExternalLink, RefreshCw, X
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
  const [stats, setStats] = useState({ volume: 0, nodes: 0, review: 0, success: 0 });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchData();
    
    // Subscribe to realtime changes
    const profileSub = supabase
      .channel('admin_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'p2p_orders' }, () => {
        console.log("Realtime Update: Orders changed");
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        console.log("Realtime Update: Profiles changed");
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(profileSub); };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching Admin Data from Supabase...");

      // 1. Fetch Profiles (Nodes) - This is where the recursion error was happening
      const { data: profileData, error: profileError, count: nodeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (profileError) {
        if (profileError.message.includes("recursion")) {
          throw new Error("Database Security Error: Please run the SQL fix in Supabase Editor to clear infinite recursion.");
        }
        throw profileError;
      }

      // 2. Fetch Orders with details
      const { data: orderData, error: orderError } = await supabase
        .from('p2p_orders')
        .select(`
          *,
          buyer:profiles!p2p_orders_buyer_id_fkey(name, mobile),
          seller:profiles!p2p_orders_seller_id_fkey(name, mobile)
        `)
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;

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
      console.error("Fetch Error:", error.message);
      toast({ 
        variant: "destructive", 
        title: "Sync Failed", 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId: string, status: 'approve' | 'reject') => {
    try {
      if (status === 'approve') {
        const { error } = await P2PEngine.approveOrder(orderId);
        if (error) throw error;
        toast({ title: "Order Approved", description: "Funds settled successfully." });
      } else {
        const { error } = await P2PEngine.rejectOrder(orderId);
        if (error) throw error;
        toast({ variant: "destructive", title: "Order Rejected", description: "Funds refunded." });
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
    <div className="flex min-h-screen bg-[#F8FAFC] relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }} 
        pendingCount={pendingOrders.length} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={cn(
        "flex-1 transition-all duration-300 w-full",
        isSidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500">
              <Menu size={20} />
            </Button>
            <h2 className="text-[12px] lg:text-[14px] font-black text-slate-900 uppercase tracking-tighter">Audit Terminal</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
             <Button variant="ghost" size="sm" onClick={fetchData} className="text-slate-400">
               <RefreshCw size={14} className={cn(loading && "animate-spin")} />
             </Button>
             <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <Input placeholder="Search logs..." className="w-64 h-11 pl-10 bg-slate-50 border-transparent rounded-2xl text-[11px] font-bold" />
             </div>
          </div>
        </header>

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
               {[
                 { label: "Volume", value: `₹${stats.volume.toLocaleString()}`, icon: IndianRupee, color: "text-blue-500" },
                 { label: "Nodes", value: stats.nodes.toString(), icon: Users, color: "text-green-500" },
                 { label: "Review", value: stats.review.toString(), icon: Clock, color: "text-amber-500" },
                 { label: "Success", value: stats.success.toString(), icon: CheckCircle, color: "text-emerald-500" },
               ].map((stat, i) => (
                 <Card key={i} className="border-0 shadow-sm rounded-3xl overflow-hidden">
                   <CardContent className="p-4 lg:p-8">
                     <div className="flex justify-between items-start mb-2 lg:mb-4">
                       <div className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center bg-slate-50", stat.color)}>
                         <stat.icon size={20} />
                       </div>
                     </div>
                     <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                     <h3 className="text-sm lg:text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                   </CardContent>
                 </Card>
               ))}
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8">
              {pendingOrders.length === 0 ? (
                <div className="xl:col-span-2 py-40 flex flex-col items-center justify-center opacity-20">
                  <CheckCircle size={80} />
                  <p className="text-[16px] font-black uppercase mt-6 tracking-widest">Audit Clear</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <Card key={order.id} className="border-slate-200 shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
                            <h4 className="text-[14px] lg:text-[16px] font-black text-slate-900">{order.id}</h4>
                         </div>
                         <Badge className="bg-amber-50 text-amber-600">IN REVIEW</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <span className="text-[8px] font-black text-slate-400 uppercase">Amount</span>
                            <p className="text-base lg:text-xl font-black text-slate-900">₹{order.amount}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl overflow-hidden">
                            <span className="text-[8px] font-black text-slate-400 uppercase">UTR</span>
                            <p className="text-[11px] font-black text-primary truncate">{order.utr}</p>
                         </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl font-black uppercase text-[10px]" onClick={() => setSelectedOrder(order)}>
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
              <div>
                <h2 className="text-sm lg:text-xl font-black uppercase text-slate-900">Evidence Audit</h2>
                <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Protocol</p>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                 <Button variant="ghost" size="icon" onClick={() => window.open(selectedOrder?.screenshot_url)} className="text-slate-400 hover:text-primary">
                    <ExternalLink size={18} />
                 </Button>
                 <Badge className="h-10 lg:h-12 px-4 lg:px-8 text-sm lg:text-xl font-black bg-primary rounded-2xl">₹{selectedOrder?.amount}</Badge>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-8">
              <div className="flex-[1.5] min-h-[300px] flex flex-col gap-4">
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

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-xl border border-white/20">
                      <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="h-8 w-8"><ZoomOut size={14} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(5, z + 0.2))} className="h-8 w-8"><ZoomIn size={14} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setRotation(r => r + 90)} className="h-8 w-8"><RotateCw size={14} /></Button>
                      <Button variant="ghost" size="icon" onClick={resetImage} className="h-8 w-8"><Maximize2 size={14} /></Button>
                    </div>
                 </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 lg:gap-6 pb-4">
                <div className="bg-slate-50 p-4 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 space-y-4">
                   <div className="space-y-3">
                      <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Context</h3>
                      <div className="space-y-1">
                        <span className="text-[7px] font-bold text-slate-400 uppercase">Buyer Identity</span>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                           <Users size={12} className="text-primary" />
                           <p className="text-[10px] font-black truncate">{selectedOrder?.buyer?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[7px] font-bold text-slate-400 uppercase">Receiver VPA</span>
                        <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-2">
                           <CheckCircle size={12} className="text-green-500" />
                           <p className="text-[10px] font-black truncate text-primary">{selectedOrder?.seller_upi}</p>
                        </div>
                      </div>
                   </div>

                   <div className="h-px bg-slate-200" />

                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] font-black text-slate-400 uppercase">UTR Ref</span>
                        <span className="text-[9px] font-black text-primary">{selectedOrder?.utr}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3 lg:gap-4">
                  <Button variant="outline" className="h-14 rounded-2xl border-red-100 text-red-500 font-black uppercase text-[10px]" onClick={() => handleAction(selectedOrder.id, 'reject')}>REJECT</Button>
                  <Button className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px]" onClick={() => handleAction(selectedOrder.id, 'approve')}>APPROVE</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
