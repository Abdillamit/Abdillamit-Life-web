"use client";

import { Trash2 } from "lucide-react";
import { EVENT_TYPES } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";
import type { TimelineEvent as TEvent } from "@/types";

export function TimelineEvent({
  event,
  onDelete,
}: {
  event: TEvent;
  onDelete: (id: string) => void;
}) {
  const meta = EVENT_TYPES.find((t) => t.value === event.event_type);
  const icon = event.icon ?? meta?.icon ?? "•";

  return (
    <div className="relative pl-10">
      <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-sm">
        {icon}
      </span>

      <div className="group rounded-xl border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted">{formatDate(event.event_date)}</div>
            <h3 className="mt-0.5 font-medium text-foreground">{event.title}</h3>
          </div>
          {meta && <span className="text-xs text-accent">{meta.label}</span>}
        </div>
        {event.description && (
          <p className="mt-2 text-sm text-foreground/80">{event.description}</p>
        )}
        <button
          onClick={() => onDelete(event.id)}
          className="mt-2 hidden text-xs text-muted hover:text-red-400 group-hover:inline-flex"
        >
          <Trash2 className="mr-1 h-3 w-3" /> удалить
        </button>
      </div>
    </div>
  );
}
