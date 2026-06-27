"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { getEntry, deleteEntry } from "@/lib/hooks/useEntries";
import { EntryForm } from "@/components/journal/EntryForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { TagBadge } from "@/components/ui/Badge";
import { moodEmoji } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";
import type { Entry } from "@/types";

export default function EntryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let active = true;
    getEntry(params.id)
      .then((e) => active && setEntry(e))
      .catch((e) => active && setError((e as Error).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [params.id]);

  async function handleDelete() {
    if (!entry || !confirm("Удалить эту запись?")) return;
    await deleteEntry(entry.id);
    router.push("/journal");
    router.refresh();
  }

  if (loading) return <PageLoader />;
  if (error || !entry)
    return <EmptyState icon="🔍" title="Запись не найдена" description={error ?? undefined} />;

  if (editing) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Редактирование" subtitle={formatDate(entry.date)} />
        <EntryForm entry={entry} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={formatDate(entry.date, "EEEE, d MMMM yyyy")}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" /> Изменить
            </Button>
            <Button variant="danger" size="icon" onClick={handleDelete} aria-label="Удалить">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-3 text-2xl">
        {moodEmoji(entry.mood)}
        {entry.mood != null && (
          <span className="text-sm text-muted">Настроение {entry.mood}/10</span>
        )}
      </div>

      <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
        {entry.content}
      </p>

      {entry.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
