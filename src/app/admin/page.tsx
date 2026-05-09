
"use client"

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  TrendingUp, Wallet, ShieldCheck, 
  IndianRupee, User, Users,
  Hash, Eye, ArrowUpRight, 
  CheckCircle2, Search, History, CheckCircle, Ban, Copy, Menu, Clock, Maximize2,
  ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, X, ChevronRight, ChevronLeft, CreditCard,
  AlertCircle, Smartphone, Check, SmartphoneIcon, RefreshCw
} from "lucide-react";
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
import { AdminSidebar } from "@/components/admin-sidebar";
import { P2PEngine, P2POrder } from "@/lib/p2p-engine";
import Image from "next/image";

export default function AdminPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [orders, setOrders] = useState<P2POrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<P2POrder | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    window.addEventListener('p2p_order_update', loadData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('p2p_order_update', loadData);
    };
  }, []);

  const loadData = () => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    setOrders(history);
  };

  const updateStatus = (orderId: string, status: 'approve' | 'reject') => {
    if (status === 'approve') {
      P2PEngine.approveOrder(orderId);
      toast({ title: "Order Approved", description: "Seller balance finalized." });
    } else {
      P2PEngine.cancelOrder(orderId, "Admin Rejected");
      toast({ variant: "destructive", title: "Order Rejected", description: "Seller balance refunded." });
    }
    setSelectedOrder(null);
    setIsPreviewOpen(false);
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
                 { label: "Total Volume", value: "₹0", icon: IndianRupee, color: "text-blue-500" },
                 { label: "Active Nodes", value: "0", icon: Users, color: "text-green-500" },
                 { label: "Review Queue", value: pendingOrders.length.toString(), icon: Clock, color: "text-amber-500" },
                 { label: "Successful", value: orders.filter(o => o.status === 'success').length.toString(), icon: CheckCircle, color: "text-emerald-500" },
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
            <div className="space-y-10 animate-in fade-in duration-500">
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
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                              <h4 className="text-[16px] font-black text-slate-900">{order.id}</h4>
                           </div>
                           <Badge className="bg-amber-50 text-amber-600 border-amber-200">IN REVIEW</Badge>
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
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => { setSelectedOrder(null); setIsPreviewOpen(false); }}>
        <DialogContent className="max-w-4xl w-[95%] bg-white rounded-[3rem] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="p-8 flex flex-col h-[85vh]">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase text-slate-900">Audit Protocol</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Verification Node</p>
              </div>
              <Badge className="h-12 px-8 text-xl font-black bg-primary rounded-2xl">₹{selectedOrder?.amount}</Badge>
            </div>

            <div className="flex-1 overflow-hidden flex gap-8">
              <div className="flex-[1.2] flex flex-col gap-4">
                 <div className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group overflow-hidden shadow-inner flex items-center justify-center">
                    {selectedOrder?.screenshot ? (
                      <div className="w-full h-full relative" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)`, transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                        <Image src={selectedOrder.screenshot} alt="Proof" fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-300">
                        <Maximize2 size={64} className="mb-4 opacity-50" />
                        <span className="text-[12px] font-black uppercase tracking-widest">No Image Asset</span>
                      </div>
                    )}
                 </div>
                 
                 <div className="h-16 shrink-0 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-4 px-6 shadow-sm">
                    <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="hover:bg-slate-50"><ZoomOut size={18} /></Button>
                    <span className="text-[11px] font-black text-slate-400 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
                    <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="hover:bg-slate-50"><ZoomIn size={18} /></Button>
                    <div className="w-px h-6 bg-slate-100 mx-2" />
                    <Button variant="ghost" size="icon" onClick={() => setRotation(r => r + 90)} className="hover:bg-slate-50"><RotateCw size={18} /></Button>
                 </div>
              </div>

              <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Audit Logs</h4>
                  
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-5">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1.5">Receiver Node</span>
                      <div className="flex items-center gap-3">
                         {selectedOrder?.receiverTerminal?.logo && (
                           <div className="w-10 h-10 relative rounded-xl overflow-hidden border border-white shadow-sm bg-white p-1.5">
                              <Image src={selectedOrder.receiverTerminal.logo} alt="Bank" fill className="object-contain" />
                           </div>
                         )}
                         <div>
                            <p className="text-[13px] font-black text-slate-900 leading-tight uppercase">{selectedOrder?.receiverTerminal?.name || selectedOrder?.sellerName}</p>
                            <code className="text-[10px] font-bold text-primary tracking-wide">{selectedOrder?.receiverTerminal?.upi || selectedOrder?.sellerUpi}</code>
                         </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-200/50" />

                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1.5">Buyer Signature</span>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-white shadow-sm flex items-center justify-center text-slate-400">
                            <SmartphoneIcon size={20} />
                         </div>
                         <div>
                            <p className="text-[13px] font-black text-slate-900 leading-tight uppercase">External VPA</p>
                            <code className="text-[10px] font-bold text-slate-400 tracking-widest">{selectedOrder?.utr}</code>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl flex gap-3">
                    <AlertCircle size={16} className="text-amber-500 shrink-0" />
                    <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">
                      Confirm UTR matches bank statement before processing settlement. This action is final.
                    </p>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 font-black uppercase text-[11px] transition-all" onClick={() => updateStatus(selectedOrder!.id, 'reject')}>ABORT SETTLE</Button>
                  <Button className="h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[11px] shadow-xl shadow-emerald-200 transition-all" onClick={() => updateStatus(selectedOrder!.id, 'approve')}>FINALIZE SETTLE</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
