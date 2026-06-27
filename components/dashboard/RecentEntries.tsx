"use client";

import Link from "next/link";
import { useEntries } from "@/lib/hooks/useEntries";
import { EntryCard } from "@/components/journal/EntryCard";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function RecentEntries() {
  const { entries, loading } = useEntries();
  const recent = entries.slice(0, 5);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted">Последние записи</span>
        <Link href="/journal" className="text-xs text-accent hover:underline">
          Все
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <LoadingSpinner />
        </div>
      ) : recent.length === 0 ? (
        <p className="py-4 text-sm text-muted">Записей пока нет.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </Card>
  );
}
