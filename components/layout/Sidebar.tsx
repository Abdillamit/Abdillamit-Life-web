"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/lib/utils/constants";
import { NAV_ICONS } from "./navIcons";
import { useProfile } from "@/lib/hooks/useProfile";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const firstName = profile?.name?.split(" ")[0];

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:bg-surface/40">
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="text-base font-semibold">{firstName ? `${firstName} Life` : "Life"}</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent/15 font-medium text-accent"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {Icon && <Icon className="h-[18px] w-[18px]" />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-muted">
        v0.1{profile?.location ? ` · ${profile.location}` : ""}
      </div>
    </aside>
  );
}
