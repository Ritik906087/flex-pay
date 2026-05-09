
"use client"

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  TrendingUp, Wallet, ShieldCheck, 
  IndianRupee, User, Users,
  Hash, Eye, ArrowUpRight, 
  CheckCircle2, Search, History, CheckCircle, Ban, Copy, Menu, Clock, Maximize2,
  ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, X, ChevronRight, ChevronLeft, CreditCard
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
import { MOCK_USERS } from "@/lib/mock-admin-data";
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

      {/* Verification Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl w-[95%] bg-white rounded-[3rem] p-0 overflow-hidden">
          <div className="p-10 space-y-8">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-black uppercase">P2P Verification Suite</DialogTitle>
              <Badge className="h-10 px-6 text-lg font-black bg-primary">₹{selectedOrder?.amount}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                <Maximize2 size={48} />
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Seller Node</span>
                    <p className="font-black text-slate-900">{selectedOrder?.sellerName}</p>
                    <code className="text-[10px] text-primary">{selectedOrder?.sellerUpi}</code>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase block">UTR Provided</span>
                    <p className="font-black text-slate-900 tracking-widest">{selectedOrder?.utr}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 rounded-2xl border-red-100 text-red-500 font-black uppercase" onClick={() => updateStatus(selectedOrder!.id, 'reject')}>REJECT</Button>
                  <Button className="h-16 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black uppercase" onClick={() => updateStatus(selectedOrder!.id, 'approve')}>APPROVE</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
