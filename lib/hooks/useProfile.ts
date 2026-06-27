"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Profile } from "@/types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: Profile }>("/api/profile");
      setProfile(res.data);
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

  return { profile, loading, error, refresh };
}

export async function updateProfile(input: Partial<Profile>) {
  const res = await api<{ data: Profile }>("/api/profile", { method: "PATCH", body: input });
  return res.data;
}
