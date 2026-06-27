"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useEntries } from "@/lib/hooks/useEntries";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TagBadge } from "@/components/ui/Badge";
import { moodEmoji } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";

export default function HistoryPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const { entries, loading, hasMore, loadMore, loadingMore } = useEntries({
    from: from || undefined,
    to: to || undefined,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.content.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [entries, search]);

  return (
    <div>
      <PageHeader title="История" subtitle="Полный лог всех твоих действий." />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по тексту и тегам…"
            className="pl-9"
          />
        </div>
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-auto"
          aria-label="С"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-auto"
          aria-label="По"
        />
      </div>

      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🗂️" title="Ничего не найдено" description="Попробуй изменить фильтры." />
      ) : (
        <>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {filtered.map((entry) => (
              <Link
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="text-lg">{moodEmoji(entry.mood)}</span>
                <span className="w-24 shrink-0 text-xs text-muted">
                  {formatDate(entry.date, "d MMM yy")}
                </span>
                <span className="flex-1 truncate text-sm text-foreground/90">
                  {entry.content}
                </span>
                <span className="hidden gap-1 sm:flex">
                  {entry.tags.slice(0, 2).map((t) => (
                    <TagBadge key={t} tag={t} />
                  ))}
                </span>
              </Link>
            ))}
          </div>

          {hasMore && !search && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Загрузка…" : "Показать ещё"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
