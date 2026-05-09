
"use client"

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Smartphone, User, Hash, ShieldCheck, 
  TrendingUp, CreditCard, History, Plus, Ban, 
  ChevronLeft, Copy, Search, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AdminSidebar } from "@/components/admin-sidebar";
import { MOCK_USERS } from "@/lib/mock-admin-data";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params.userId as string;

  const user = useMemo(() => MOCK_USERS.find(u => u.uid === userId), [userId]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('flexpay_orders') || '[]');
    setOrders(history);
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard.` });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4">Node Identity Not Found</h1>
          <Button onClick={() => router.push('/admin')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar activeTab="users" onTabChange={(tab) => router.push(`/admin?tab=${tab}`)} />

      <div className="flex-1 ml-72">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
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
            {/* Sidebar Profile Info */}
            <div className="w-full lg:w-[400px] space-y-8">
              <Card className="border-slate-200 shadow-sm rounded-[3rem] overflow-hidden bg-white p-10">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border-4 border-white flex items-center justify-center text-slate-200 shadow-2xl mb-6 relative group overflow-hidden">
                    <User size={64} className="group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{user.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Hash size={12} className="text-primary" />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{user.uid}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">Liquid Assets</span>
                    <div className="flex items-center justify-between">
                      <p className="text-4xl font-black text-primary tracking-tight">₹{user.balance?.toLocaleString()}</p>
                      <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-inner">
                        <TrendingUp size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-2">Node Credentials</h5>
                    {[
                      { label: "Phone", value: user.mobile, icon: Smartphone },
                      { label: "Identity", value: user.uid, icon: Hash },
                      { label: "Status", value: "Level 1 Node", icon: ShieldCheck },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3 text-slate-400">
                          <row.icon size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{row.label}</span>
                        </div>
                        <span className="text-[11px] font-black text-slate-700">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-6">
                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20">
                      <Plus size={18} className="mr-3" />
                      Edit Balance
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 font-black text-[11px] uppercase tracking-widest transition-all">
                      <Ban size={18} className="mr-3" />
                      Suspend Node
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Tabs Area */}
            <div className="flex-1">
              <Tabs defaultValue="linked" className="w-full">
                <TabsList className="flex w-full bg-white h-16 p-2 rounded-[1.5rem] border border-slate-100 mb-8 shadow-sm">
                  <TabsTrigger value="linked" className="flex-1 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <CreditCard size={18} className="mr-3" />
                    Linked Terminals
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <History size={18} className="mr-3" />
                    Trade Network Logs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="linked" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.linkedAccounts?.map((acc: any, i: number) => (
                      <Card key={i} className="border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between shadow-sm hover:border-primary/20 transition-all group bg-white">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner p-2 bg-slate-50">
                            <Image src={acc.logo} alt={acc.appName} fill className="object-contain p-2" />
                          </div>
                          <div>
                            <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{acc.appName}</p>
                            <code className="text-[11px] font-bold text-slate-400 tracking-wider block mt-1">{acc.upi}</code>
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified VPA</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-slate-300 hover:text-primary transition-all" onClick={() => handleCopy(acc.upi, "UPI ID")}>
                          <Copy size={18} />
                        </Button>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative flex-1 group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input 
                        placeholder="Search logs by ID, UTR, or Amount..." 
                        className="h-14 pl-14 bg-white border-slate-100 rounded-2xl text-[12px] font-bold focus:ring-4 focus:ring-primary/5 shadow-sm"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-100 font-black text-[10px] uppercase tracking-widest">
                      <Filter size={18} className="mr-2" />
                      Advanced Filters
                    </Button>
                  </div>
                  
                  <Card className="border-slate-100 rounded-[2.5rem] p-10 bg-slate-50/30 border-dashed border-2">
                    <div className="flex flex-col items-center justify-center py-24 opacity-20 text-slate-900">
                      <History size={64} />
                      <p className="text-[14px] font-black uppercase mt-6 tracking-[0.4em]">Historical Data Clear</p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
