
"use client"

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        {children}
      </main>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-0 md:p-4">
      <div className="relative w-full max-w-[430px] h-[100dvh] bg-background overflow-hidden flex flex-col shadow-2xl md:rounded-[3rem] md:border-[12px] md:border-white overflow-hidden">
        <main className="flex-1 overflow-y-auto no-scrollbar pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
