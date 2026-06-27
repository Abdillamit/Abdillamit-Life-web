"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Tag } from "@/types";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: Tag[] }>("/api/tags");
      setTags(res.data);
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

  return { tags, loading, error, refresh };
}

export async function createTag(input: { name: string; color?: string }) {
  const res = await api<{ data: Tag }>("/api/tags", { method: "POST", body: input });
  return res.data;
}

export async function updateTag(id: string, input: Partial<Pick<Tag, "name" | "color">>) {
  const res = await api<{ data: Tag }>(`/api/tags/${id}`, { method: "PATCH", body: input });
  return res.data;
}

export async function deleteTag(id: string) {
  await api<void>(`/api/tags/${id}`, { method: "DELETE" });
}
