
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
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto z-50 bg-white border-t border-gray-100 px-3 py-1">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] transition-all",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all",
                isActive && "bg-blue-50/50"
              )}>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[7.5px] font-bold uppercase tracking-wider mt-0.5",
                isActive ? "text-primary" : "text-gray-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
