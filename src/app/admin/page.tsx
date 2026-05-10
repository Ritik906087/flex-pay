
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AdminClient from "./admin-client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialising Sentinel Terminal...</p>
      </div>
    }>
      <AdminClient />
    </Suspense>
  );
}
