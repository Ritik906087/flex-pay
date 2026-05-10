
"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  IndianRupee, Users, Search, History, CheckCircle, Ban, Menu, Clock, 
  Maximize2, ZoomIn, ZoomOut, RotateCw, Eye, SmartphoneIcon, AlertCircle,
  Download, ExternalLink, RefreshCw, X, TrendingUp, ShieldCheck, ShieldAlert,
  Globe, Fingerprint, Activity, Terminal, Loader2
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

function AdminPanelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ volume: 0, nodes: 0, review: 0, risk: 0 });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      setAllUsers(profileData || []);

      const { data: orderData } = await supabase
        .from('p2p_orders')
        .select('*')
        .order('created_at', { ascending: false });

      setOrders(orderData || []);

      const { data: securityData } = await supabase
        .from('security_events')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setSecurityLogs(securityData || []);
        
      const successOrders = (orderData || []).filter(o => o.status === 'success');
      const totalVolume = successOrders.reduce((acc, o) => acc + Number(o.amount), 0);
      const highRiskEvents = (securityData || []).filter(e => e.risk_score > 60).length;
        
      setStats({
        volume: totalVolume,
        nodes: profileData?.length || 0,
        review: (orderData || []).filter(o => o.status === 'in-review').length,
        risk: highRiskEvents
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSecurity = useMemo(() => {
    if (!globalSearch) return securityLogs;
    const q = globalSearch.toLowerCase();
    return securityLogs.filter(l => 
      l.ip_address?.includes(q) || 
      l.profiles?.name?.toLowerCase().includes(q) ||
      l.details?.network?.isp?.toLowerCase().includes(q)
    );
  }, [securityLogs, globalSearch]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] relative overflow-x-hidden">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}/>
      )}

      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
          router.push(`/admin?tab=${tab}`);
        }} 
        pendingCount={orders.filter(o => o.status === 'in-review').length} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className={cn("flex-1 transition-all duration-300 w-full min-h-screen flex flex-col", isSidebarOpen ? "lg:ml-72" : "ml-0")}>
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h2 className="text-[12px] lg:text-[14px] font-black text-slate-900 uppercase tracking-tighter">Sentinel Terminal</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
             <Button variant="ghost" size="sm" onClick={fetchData} className="text-slate-400 h-10 w-10 rounded-xl bg-slate-50 border border-slate-100">
               <RefreshCw size={14} className={cn(loading && "animate-spin")} />
             </Button>
             <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <Input 
                  placeholder="Audit IPs, Names, Devices..." 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-64 h-11 pl-10 bg-slate-50 border-transparent rounded-2xl text-[11px] font-bold focus:bg-white transition-all" 
                />
             </div>
          </div>
        </header>

        <main className="p-4 lg:p-10 max-w-[1600px] w-full mx-auto flex-1">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                 {[
                   { label: "Net Volume", value: `₹${stats.volume.toLocaleString()}`, icon: IndianRupee, color: "text-blue-500", bg: "bg-blue-50" },
                   { label: "Total Nodes", value: stats.nodes.toString(), icon: Users, color: "text-primary", bg: "bg-blue-50/50" },
                   { label: "Audit Queue", value: stats.review.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                   { label: "Risk Alerts", value: stats.risk.toString(), icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50" },
                 ].map((stat, i) => (
                   <Card key={i} className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
                     <CardContent className="p-4 lg:p-8">
                       <div className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                         <stat.icon size={20} />
                       </div>
                       <span className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                       <h3 className="text-sm lg:text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                     </CardContent>
                   </Card>
                 ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card className="xl:col-span-2 border-0 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                   <div className="p-6 lg:p-8 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-[10px] lg:text-sm font-black uppercase tracking-widest text-slate-900">Live Security Feed</h3>
                      <Badge variant="outline" className="text-[8px] font-black uppercase text-red-500 border-red-100">REALTIME PROTECT</Badge>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-4">User / Node</th>
                            <th className="px-8 py-4">Intelligence</th>
                            <th className="px-8 py-4">Risk Level</th>
                            <th className="px-8 py-4 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredSecurity.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Activity size={14}/></div>
                                  <div>
                                    <p className="text-[11px] font-black text-slate-900">{log.profiles?.name || 'Unknown'}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">{log.ip_address}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1.5">
                                    <Globe size={12} className="text-blue-500" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase">{log.details?.network?.isp?.slice(0, 15)}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Fingerprint size={12} className="text-primary" />
                                    <span className="text-[10px] font-black text-slate-600">{log.details?.fingerprintId?.slice(0, 8)}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <Badge className={cn(
                                  "text-[8px] font-black uppercase border-0 h-6 px-3",
                                  log.risk_score > 60 ? "bg-red-50 text-red-600" : 
                                  log.risk_score > 30 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                  {log.risk_score > 60 ? 'HIGH RISK' : log.risk_score > 30 ? 'SUSPICIOUS' : 'SECURE'}
                                </Badge>
                              </td>
                              <td className="px-8 py-5 text-right text-[10px] font-bold text-slate-400">
                                {new Date(log.created_at).toLocaleTimeString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </Card>

                <Card className="border-0 shadow-sm rounded-[2.5rem] bg-slate-900 text-white overflow-hidden p-8 flex flex-col justify-between">
                   <div>
                      <div className="flex justify-between items-start mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center"><ShieldCheck size={28}/></div>
                        <Badge className="bg-emerald-500 text-white border-0 font-black">ACTIVE</Badge>
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Sentinel<br/>Guard v4.2</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Continuous device intelligence and proxy detection active across all nodes.
                      </p>
                   </div>
                   <div className="space-y-4">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Multi-Account Detection</span>
                        <p className="text-sm font-black">7 Suspected Collusions</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">VPN Blocks (24h)</span>
                        <p className="text-sm font-black">128 Unauthorized IPs</p>
                      </div>
                   </div>
                </Card>
              </div>
            </div>
          )}
          
          {activeTab === "users" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allUsers.map((u) => (
                <Card key={u.id} className="border-0 shadow-sm rounded-[2rem] bg-white overflow-hidden p-6 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <Users size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-black text-slate-900 uppercase truncate">{u.name || 'Anonymous Node'}</h4>
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
                      <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">ID Hash</span>
                      <p className="text-[11px] font-black text-primary uppercase">{u.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <Button onClick={() => router.push(`/admin/users/${u.id}`)} className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[9px] tracking-widest">Audit Profile</Button>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Sentinel Terminal...</p>
      </div>
    }>
      <AdminPanelContent />
    </Suspense>
  );
}
