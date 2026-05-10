
"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  IndianRupee, Users, Search, History, CheckCircle, Ban, Menu, Clock, 
  Maximize2, ZoomIn, ZoomOut, RotateCw, Eye, SmartphoneIcon, AlertCircle,
  Download, ExternalLink, RefreshCw
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    
    // Subscribe to realtime order updates
    const orderSubscription = supabase
      .channel('admin_orders_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'p2p_orders' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(orderSubscription); };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Orders with Buyer/Seller info
      const { data: orderData, error: orderError } = await supabase
        .from('p2p_orders')
        .select(`
          *,
          buyer:profiles!buyer_id(name, mobile),
          seller:profiles!seller_id(name, mobile)
        `)
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;

      // Fetch Node Count
      const { count: nodeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

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
        toast({ variant: "destructive", title: "Order Rejected", description: "Funds refunded to seller." });
      }
      setSelectedOrder(null);
      fetchData();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'in-review');

  // Evidence Modal Controls
  const resetImage = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        pendingCount={pendingOrders.length} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={cn("flex-1 transition-all duration-300", isSidebarOpen ? "ml-72" : "ml-0")}>
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center gap-5">
            {!isSidebarOpen && <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></Button>}
            <h2 className="text-[14px] font-black text-slate-900 uppercase">Audit Terminal</h2>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={fetchData} className="text-slate-400">
               <RefreshCw size={14} className={cn(loading && "animate-spin")} />
             </Button>
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <Input placeholder="Search logs..." className="w-64 h-11 pl-10 bg-slate-50 border-transparent rounded-2xl text-[11px] font-bold" />
             </div>
          </div>
        </header>

        <main className="p-10 max-w-[1600px] mx-auto">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[
                 { label: "Total Volume", value: `₹${stats.volume.toLocaleString()}`, icon: IndianRupee, color: "text-blue-500" },
                 { label: "Active Nodes", value: stats.nodes.toString(), icon: Users, color: "text-green-500" },
                 { label: "Review Queue", value: stats.review.toString(), icon: Clock, color: "text-amber-500" },
                 { label: "Successful", value: stats.success.toString(), icon: CheckCircle, color: "text-emerald-500" },
               ].map((stat, i) => (
                 <Card key={i} className="border-0 shadow-sm rounded-3xl">
                   <CardContent className="p-8">
                     <div className="flex justify-between items-start mb-4">
                       <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50", stat.color)}>
                         <stat.icon size={24} />
                       </div>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                     <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                   </CardContent>
                 </Card>
               ))}
            </div>
          )}

          {activeTab === "approvals" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {pendingOrders.length === 0 ? (
                <div className="xl:col-span-2 py-40 flex flex-col items-center justify-center opacity-20">
                  <CheckCircle size={80} />
                  <p className="text-[16px] font-black uppercase mt-6 tracking-widest">Audit Clear</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <Card key={order.id} className="border-slate-200 shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</span>
                            <h4 className="text-[16px] font-black text-slate-900">{order.id}</h4>
                         </div>
                         <Badge className="bg-amber-50 text-amber-600">IN REVIEW</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <span className="text-[8px] font-black text-slate-400 uppercase">Amount</span>
                            <p className="text-xl font-black text-slate-900">₹{order.amount}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <span className="text-[8px] font-black text-slate-400 uppercase">UTR</span>
                            <p className="text-[12px] font-black text-primary truncate">{order.utr}</p>
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

      {/* New Evidence Modal Audit Suite */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-5xl w-[95%] bg-white rounded-[3rem] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="p-8 flex flex-col h-[85vh]">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase text-slate-900">Evidence Audit</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Verification Protocol</p>
              </div>
              <div className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" onClick={() => window.open(selectedOrder?.screenshot_url)} className="text-slate-400 hover:text-primary">
                    <ExternalLink size={18} />
                 </Button>
                 <Badge className="h-12 px-8 text-xl font-black bg-primary rounded-2xl">₹{selectedOrder?.amount}</Badge>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex gap-8">
              {/* Image Preview Container */}
              <div className="flex-[1.5] flex flex-col gap-4">
                 <div className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex items-center justify-center cursor-move">
                    {selectedOrder?.screenshot_url ? (
                      <div 
                        className="w-full h-full relative" 
                        style={{ 
                          transform: `scale(${zoom}) rotate(${rotation}deg) translate(${offset.x}px, ${offset.y}px)`, 
                          transition: isDragging ? 'none' : 'transform 0.2s' 
                        }}
                        onMouseDown={(e) => setIsDragging(true)}
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
                        <AlertCircle size={64} className="mb-4 opacity-50" />
                        <span className="text-[12px] font-black uppercase">No Proof Uploaded</span>
                      </div>
                    )}

                    {/* Image Controls - Floating */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/20">
                      <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="h-9 w-9"><ZoomOut size={16} /></Button>
                      <span className="text-[10px] font-black w-10 text-center">{Math.round(zoom * 100)}%</span>
                      <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(5, z + 0.2))} className="h-9 w-9"><ZoomIn size={16} /></Button>
                      <div className="w-px h-4 bg-slate-200 mx-1" />
                      <Button variant="ghost" size="icon" onClick={() => setRotation(r => r + 90)} className="h-9 w-9"><RotateCw size={16} /></Button>
                      <Button variant="ghost" size="icon" onClick={resetImage} className="h-9 w-9"><Maximize2 size={16} /></Button>
                    </div>
                 </div>
              </div>

              {/* Order Data Panel */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Context</h3>
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Buyer VPA / App</span>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100">
                           <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                             <Users size={14} />
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-[11px] font-black truncate">{selectedOrder?.buyer?.name || 'Unknown Buyer'}</p>
                              <code className="text-[9px] text-slate-400">{selectedOrder?.buyer?.mobile}</code>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Receiver VPA</span>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100">
                           <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                             <CheckCircle size={14} />
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-[11px] font-black truncate">{selectedOrder?.receiver_terminal?.account_holder_name}</p>
                              <code className="text-[9px] text-primary">{selectedOrder?.seller_upi}</code>
                           </div>
                        </div>
                      </div>
                   </div>

                   <div className="h-px bg-slate-200" />

                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Reference (UTR)</span>
                        <span className="text-[10px] font-black text-primary">{selectedOrder?.utr}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Match Timestamp</span>
                        <span className="text-[10px] font-black text-slate-700">{new Date(selectedOrder?.created_at).toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 font-black uppercase text-[11px]" onClick={() => handleAction(selectedOrder.id, 'reject')}>REJECT</Button>
                  <Button className="h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[11px] shadow-lg shadow-emerald-500/20" onClick={() => handleAction(selectedOrder.id, 'approve')}>APPROVE</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
