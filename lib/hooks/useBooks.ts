"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Book } from "@/types";

export function useBooks(status?: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: Book[] }>("/api/books", { query: { status } });
      setBooks(res.data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { books, loading, error, refresh };
}

export async function createBook(input: Partial<Book>) {
  const res = await api<{ data: Book }>("/api/books", { method: "POST", body: input });
  return res.data;
}

export async function updateBook(id: string, input: Partial<Book>) {
  const res = await api<{ data: Book }>(`/api/books/${id}`, { method: "PATCH", body: input });
  return res.data;
}

export async function deleteBook(id: string) {
  await api<void>(`/api/books/${id}`, { method: "DELETE" });
}
