import Link from "next/link";
import { TagBadge } from "@/components/ui/Badge";
import { moodEmoji } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";
import type { Entry } from "@/types";

export function EntryCard({ entry }: { entry: Entry }) {
  const preview =
    entry.content.length > 180 ? `${entry.content.slice(0, 180)}…` : entry.content;

  return (
    <Link
      href={`/journal/${entry.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/40 hover:bg-surface-2"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{formatDate(entry.date)}</span>
        <span className="text-xl" title={`Настроение: ${entry.mood ?? "—"}`}>
          {moodEmoji(entry.mood)}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{preview}</p>

      {entry.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </Link>
  );
}
