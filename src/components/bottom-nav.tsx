
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, UserPlus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Orders", icon: ShoppingBag, href: "/orders" },
  { label: "Invite", icon: UserPlus, href: "/invite" },
  { label: "Mine", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto z-50 px-6 pb-6 pt-3 glass-card rounded-t-3xl border-t border-white/10">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive && "bg-primary/10"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
