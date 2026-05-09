
"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  IndianRupee, Users, Search, History, CheckCircle, Ban, Menu, Clock, 
  Maximize2, ZoomIn, ZoomOut, RotateCw, Eye, SmartphoneIcon, AlertCircle
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
  
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    fetchData();
    const orderSubscription = supabase
      .channel('admin_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'p2p_orders' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(orderSubscription); };
  }, []);

  const fetchData = async () => {
    const { data: orderData } = await supabase.from('p2p_orders').select('*, profiles(name, mobile)').order('created_at', { ascending: false });
    const { count: nodeCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    
    if (orderData) {
      setOrders(orderData);
      const totalVolume = orderData.filter(o => o.status === 'success').reduce((acc, o) => acc + o.amount, 0);
      setStats({
        volume: totalVolume,
        nodes: nodeCount || 0,
        review: orderData.filter(o => o.status === 'in-review').length,
        success: orderData.filter(o => o.status === 'success').length
      });
    }
  };

  const handleAction = async (orderId: string, status: 'approve' | 'reject') => {
    if (status === 'approve') {
      await P2PEngine.approveOrder(orderId);
      toast({ title: "Settlement Finalized" });
    } else {
      await P2PEngine.rejectOrder(orderId);
      toast({ variant: "destructive", title: "Order Rejected" });
    }
    setSelectedOrder(null);
  };

  const pendingOrders = orders.filter(o => o.status === 'in-review');

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
            <h2 className="text-[14px] font-black text-slate-900 uppercase">P2P Audit Terminal</h2>
          </div>
          <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <Input placeholder="Search Audit Logs..." className="w-80 h-11 pl-10 bg-slate-50 border-transparent rounded-2xl text-[11px] font-bold" />
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
                        <Eye size={16} className="mr-2" /> INSPECT PROOF
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
        <DialogContent className="max-w-5xl w-[95%] bg-white rounded-[3rem] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="p-8 flex flex-col h-[85vh]">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase text-slate-900">Audit Protocol</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Node Verification</p>
              </div>
              <Badge className="h-12 px-8 text-xl font-black bg-primary rounded-2xl">₹{selectedOrder?.amount}</Badge>
            </div>

            <div className="flex-1 overflow-hidden flex gap-8">
              <div className="flex-[1.2] flex flex-col gap-4">
                 <div className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden flex items-center justify-center">
                    {selectedOrder?.screenshot_url ? (
                      <div className="w-full h-full relative" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transition: 'transform 0.2s' }}>
                        <Image src={selectedOrder.screenshot_url} alt="Proof" fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-300">
                        <Maximize2 size={64} className="mb-4 opacity-50" />
                        <span className="text-[12px] font-black uppercase">No Proof Uploaded</span>
                      </div>
                    )}
                 </div>
                 <div className="h-16 flex items-center justify-center gap-4 bg-slate-50 rounded-2xl">
                    <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}><ZoomOut size={18} /></Button>
                    <span className="text-[11px] font-black text-slate-400">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(3, z + 0.2))}><ZoomIn size={18} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setRotation(r => r + 90)}><RotateCw size={18} /></Button>
                 </div>
              </div>

              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-5">
                   <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Receiver VPA</span>
                      <p className="text-[13px] font-black text-slate-900 uppercase">{selectedOrder?.receiver_terminal?.account_holder_name}</p>
                      <code className="text-[10px] font-bold text-primary">{selectedOrder?.seller_upi}</code>
                   </div>
                   <div className="h-px bg-slate-200" />
                   <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Audit Details</span>
                      <p className="text-[11px] font-black">UTR: {selectedOrder?.utr}</p>
                      <p className="text-[11px] font-black">Time: {new Date(selectedOrder?.created_at).toLocaleString()}</p>
                   </div>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 rounded-2xl text-red-500 font-black uppercase" onClick={() => handleAction(selectedOrder.id, 'reject')}>REJECT</Button>
                  <Button className="h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase" onClick={() => handleAction(selectedOrder.id, 'approve')}>APPROVE</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
