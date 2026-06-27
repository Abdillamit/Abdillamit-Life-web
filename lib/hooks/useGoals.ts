"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Goal } from "@/types";

export function useGoals(status?: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: Goal[] }>("/api/goals", { query: { status } });
      setGoals(res.data);
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

  return { goals, loading, error, refresh };
}

export async function createGoal(input: Partial<Goal>) {
  const res = await api<{ data: Goal }>("/api/goals", { method: "POST", body: input });
  return res.data;
}

export async function updateGoal(id: string, input: Partial<Goal>) {
  const res = await api<{ data: Goal }>(`/api/goals/${id}`, { method: "PATCH", body: input });
  return res.data;
}

export async function deleteGoal(id: string) {
  await api<void>(`/api/goals/${id}`, { method: "DELETE" });
}
