
"use client"

import { useRouter } from "next/navigation";
import { ChevronLeft, Headphones, MessageCircle, Mail, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Support() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => router.back()} className="p-1.5 -ml-1.5 active:scale-90 transition-transform">
          <ChevronLeft size={20} className="text-gray-900" />
        </button>
        <div>
          <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">Customer Support</h1>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Help Center</p>
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 pb-10 space-y-6">
        {/* Banner */}
        <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-1">How can we help?</h2>
            <p className="text-[10px] opacity-80 uppercase font-bold tracking-tight mb-6">Our team is available 24/7 for you</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-blue-300" />
                <span className="text-[9px] font-bold">Fast Response</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-blue-300" />
                <span className="text-[9px] font-bold">Secure Support</span>
              </div>
            </div>
          </div>
          <Headphones size={120} className="absolute -bottom-4 -right-4 opacity-10 -rotate-12" />
        </div>

        {/* Support Channels */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Connect with us</h3>
          
          <div className="grid gap-3">
            <button className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm active:bg-gray-50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0088cc]/10 rounded-xl flex items-center justify-center text-[#0088cc]">
                  <MessageCircle size={24} />
                </div>
                <div className="text-left">
                  <h4 className="text-[12px] font-black text-gray-900 uppercase">Official Telegram</h4>
                  <p className="text-[9px] text-gray-400 font-bold mt-0.5">@flexpay_official_support</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
            </button>

            <button className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm active:bg-gray-50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <h4 className="text-[12px] font-black text-gray-900 uppercase">Email Support</h4>
                  <p className="text-[9px] text-gray-400 font-bold mt-0.5">support@flexpay.app</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* FAQs Section Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h4 className="text-[11px] font-black text-gray-900 uppercase mb-4">Common Issues</h4>
          <div className="space-y-4">
            {[
              "Why is my payment under review?",
              "How to withdraw commission?",
              "My bank account is not linking",
              "What is Level 2 earnings?"
            ].map((q, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-[10px] font-medium text-gray-600">{q}</span>
                <ChevronRight size={12} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
