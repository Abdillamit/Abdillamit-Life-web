"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function Fab() {
  return (
    <Link
      href="/journal/new"
      aria-label="Новая запись"
      className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-lg shadow-accent/30 transition-transform active:scale-95 md:hidden"
    >
      <Plus className="h-7 w-7" />
    </Link>
  );
}
