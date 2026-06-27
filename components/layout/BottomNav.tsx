"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/utils/constants";
import { NAV_ICONS } from "./navIcons";
import { cn } from "@/lib/utils/cn";

// Show the five most important destinations on mobile.
const MOBILE_ITEMS = NAV_ITEMS.filter((i) =>
  ["/dashboard", "/journal", "/books", "/analytics", "/profile"].includes(i.href),
);

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur md:hidden">
      {MOBILE_ITEMS.map((item) => {
        const Icon = NAV_ICONS[item.icon];
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px]",
              active ? "text-accent" : "text-muted",
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
