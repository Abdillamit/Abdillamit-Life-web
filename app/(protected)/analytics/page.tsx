"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StreakWidget";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { TagsBreakdown } from "@/components/dashboard/TagsBreakdown";

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

export default function AnalyticsPage() {
  const { summary, heatmap, mood, loading, error } = useAnalytics(90, 365);

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of heatmap) {
      const key = d.date.slice(0, 7); // YYYY-MM
      map.set(key, (map.get(key) ?? 0) + d.count);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([key, count]) => {
        const [, m] = key.split("-");
        return { month: MONTHS[Number(m) - 1], count };
      });
  }, [heatmap]);

  if (loading) return <PageLoader />;
  if (error || !summary)
    return <EmptyState icon="⚠️" title="Не удалось загрузить аналитику" description={error ?? undefined} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Аналитика" subtitle="Картина твоей жизни в цифрах." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Всего записей" value={summary.total_entries} />
        <StatCard
          label="Среднее настроение"
          value={summary.avg_mood != null ? `${summary.avg_mood}/10` : "—"}
        />
        <StatCard label="Текущий стрик" value={`${summary.current_streak} 🔥`} />
        <StatCard label="Рекорд стрика" value={summary.longest_streak} hint="дней подряд" />
      </div>

      <Card>
        <div className="mb-3 text-sm font-medium text-muted">Записей по месяцам</div>
        {byMonth.length === 0 ? (
          <div className="py-8">
            <EmptyState icon="📊" title="Нет данных" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#26262c" />
              <XAxis dataKey="month" stroke="#9b9ba4" fontSize={11} tickLine={false} />
              <YAxis stroke="#9b9ba4" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#131316",
                  border: "1px solid #26262c",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={{ fill: "#ffffff08" }}
                formatter={(v) => [v, "Записей"]}
              />
              <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <MoodChart data={mood.slice(-30)} />
        <TagsBreakdown tags={summary.top_tags} />
      </div>

      <Card>
        <div className="text-sm font-medium text-muted">Самый продуктивный день недели</div>
        <div className="mt-2 text-3xl font-bold">{summary.most_productive_day ?? "—"}</div>
      </Card>
    </div>
  );
}
