"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { TimelineEvent } from "@/types";

export function useTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: TimelineEvent[] }>("/api/timeline");
      setEvents(res.data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { events, loading, error, refresh };
}

export async function createEvent(input: Partial<TimelineEvent>) {
  const res = await api<{ data: TimelineEvent }>("/api/timeline", { method: "POST", body: input });
  return res.data;
}

export async function deleteEvent(id: string) {
  await api<void>(`/api/timeline/${id}`, { method: "DELETE" });
}
