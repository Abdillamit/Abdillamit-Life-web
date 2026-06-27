"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AnalyticsSummary, HeatmapDay, MoodPoint } from "@/types";

export function useAnalytics(moodDays = 30, heatmapDays = 365) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([]);
  const [mood, setMood] = useState<MoodPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api<{ data: AnalyticsSummary }>("/api/analytics/summary"),
      api<{ data: HeatmapDay[] }>("/api/analytics/heatmap", { query: { days: heatmapDays } }),
      api<{ data: MoodPoint[] }>("/api/analytics/mood", { query: { days: moodDays } }),
    ])
      .then(([s, h, m]) => {
        if (!active) return;
        setSummary(s.data);
        setHeatmap(h.data);
        setMood(m.data);
        setError(null);
      })
      .catch((e) => active && setError((e as Error).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [moodDays, heatmapDays]);

  return { summary, heatmap, mood, loading, error };
}
