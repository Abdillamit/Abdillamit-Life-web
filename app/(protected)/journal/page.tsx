"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEntries, type EntryFilters } from "@/lib/hooks/useEntries";
import { EntryCard } from "@/components/journal/EntryCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { useTags } from "@/lib/hooks/useTags";
import { cn } from "@/lib/utils/cn";

export default function JournalPage() {
  const [filters, setFilters] = useState<EntryFilters>({});
  const { entries, loading, error, hasMore, loadMore, loadingMore } = useEntries(filters);
  const { tags: userTags } = useTags();

  function toggleTag(tag: string) {
    setFilters((f) => ({ ...f, tag: f.tag === tag ? undefined : tag }));
  }

  return (
    <div>
      <PageHeader
        title="Журнал"
        subtitle="Каждый день — одна запись о прожитом."
        action={
          <Link href="/journal/new">
            <Button>
              <Plus className="h-4 w-4" /> Новая
            </Button>
          </Link>
        }
      />

      {userTags.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {userTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                filters.tag === tag.name
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface-2 text-muted hover:text-foreground",
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : error ? (
        <EmptyState icon="⚠️" title="Не удалось загрузить" description={error} />
      ) : entries.length === 0 ? (
        <EmptyState
          icon="📝"
          title="Пока пусто"
          description="Создай первую запись, чтобы начать летопись."
          action={
            <Link href="/journal/new">
              <Button>Создать запись</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
          {hasMore && (
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
