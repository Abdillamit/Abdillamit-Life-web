"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Entry } from "@/types";

interface ListResponse {
  data: Entry[];
  count: number;
}

export interface EntryFilters {
  tag?: string;
  mood?: number;
  from?: string;
  to?: string;
}

const PAGE = 20;

export function useEntries(filters: EntryFilters = {}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  const load = useCallback(
    async (offset: number) => {
      const res = await api<ListResponse>("/api/entries", {
        query: { limit: PAGE, offset, ...filters },
      });
      return res;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterKey],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    load(0)
      .then((res) => {
        if (!active) return;
        setEntries(res.data);
        setCount(res.count);
      })
      .catch((e) => active && setError((e as Error).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [load]);

  async function loadMore() {
    if (loadingMore || entries.length >= count) return;
    setLoadingMore(true);
    try {
      const res = await load(entries.length);
      setEntries((prev) => [...prev, ...res.data]);
    } finally {
      setLoadingMore(false);
    }
  }

  const hasMore = entries.length < count;

  return { entries, count, loading, loadingMore, hasMore, error, loadMore };
}

export async function getEntry(id: string) {
  const res = await api<{ data: Entry }>(`/api/entries/${id}`);
  return res.data;
}

export async function createEntry(input: Partial<Entry>) {
  const res = await api<{ data: Entry }>("/api/entries", { method: "POST", body: input });
  return res.data;
}

export async function updateEntry(id: string, input: Partial<Entry>) {
  const res = await api<{ data: Entry }>(`/api/entries/${id}`, { method: "PATCH", body: input });
  return res.data;
}

export async function deleteEntry(id: string) {
  await api<void>(`/api/entries/${id}`, { method: "DELETE" });
}
