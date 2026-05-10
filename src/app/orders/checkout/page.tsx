
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import CheckoutClient from "./checkout-client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Order...</p>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
