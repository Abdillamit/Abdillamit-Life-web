"use client";

import { useMemo } from "react";
import { TimelineEvent } from "./TimelineEvent";
import type { TimelineEvent as TEvent } from "@/types";

export function TimelineView({
  events,
  onDelete,
}: {
  events: TEvent[];
  onDelete: (id: string) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, TEvent[]>();
    for (const e of events) {
      const year = e.event_date.slice(0, 4);
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(e);
    }
    return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [events]);

  return (
    <div className="space-y-8">
      {grouped.map(([year, items]) => (
        <section key={year}>
          <h2 className="mb-4 text-lg font-semibold text-accent">{year}</h2>
          <div className="relative space-y-4 before:absolute before:left-4 before:top-2 before:h-full before:w-px before:bg-border">
            {items.map((event) => (
              <TimelineEvent key={event.id} event={event} onDelete={onDelete} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
