"use client";

import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfile } from "@/lib/hooks/useProfile";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const initials = (profile?.name ?? "A")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
      <div className="md:hidden flex items-center gap-2 font-semibold">Abdillamit Life</div>

      <div className="ml-auto flex items-center gap-3">
        <Link href="/journal/new" className="hidden md:block">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Запись
          </Button>
        </Link>

        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent"
        >
          {initials}
        </Link>

        <button
          onClick={() => signOut()}
          className="text-muted transition-colors hover:text-foreground"
          aria-label="Выйти"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
