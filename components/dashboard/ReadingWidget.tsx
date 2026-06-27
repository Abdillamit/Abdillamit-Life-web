"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useBooks } from "@/lib/hooks/useBooks";
import { Card } from "@/components/ui/Card";

export function ReadingWidget() {
  const { books, loading } = useBooks();

  const stats = useMemo(() => {
    const year = new Date().getFullYear();
    const read = books.filter((b) => b.status === "read");
    const readThisYear = read.filter(
      (b) => b.finished_at && new Date(b.finished_at).getFullYear() === year,
    ).length;
    return {
      readThisYear,
      totalRead: read.length,
      reading: books.filter((b) => b.status === "reading").length,
      wantToRead: books.filter((b) => b.status === "want_to_read").length,
    };
  }, [books]);

  if (loading || books.length === 0) return null;

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">Чтение в {new Date().getFullYear()}</span>
        <Link href="/books" className="text-xs text-accent hover:underline">
          Все книги
        </Link>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">{stats.readThisYear}</span>
        <span className="text-sm text-muted">книг прочитано за год 📚</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span>Сейчас читаю: <b className="text-foreground">{stats.reading}</b></span>
        <span>В планах: <b className="text-foreground">{stats.wantToRead}</b></span>
        <span>Всего прочитано: <b className="text-foreground">{stats.totalRead}</b></span>
      </div>
    </Card>
  );
}
