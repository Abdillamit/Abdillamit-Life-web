"use client";

import { useProfile } from "@/lib/hooks/useProfile";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { daysAlive } from "@/lib/utils/dates";
import { StreakWidget, StatCard } from "@/components/dashboard/StreakWidget";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { MoodChart } from "@/components/dashboard/MoodChart";
import { TagsBreakdown } from "@/components/dashboard/TagsBreakdown";
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { PageLoader } from "@/components/shared/LoadingSpinner";

export default function DashboardPage() {
  const { profile } = useProfile();
  const { summary, heatmap, mood, loading } = useAnalytics();

  const firstName = profile?.name?.split(" ")[0] ?? "друг";
  const days = daysAlive(profile?.birth_date);

  if (loading || !summary) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Привет, {firstName}! 👋
        </h1>
        <p className="mt-1 text-sm text-muted">
          {days != null
            ? `Сегодня день #${days.toLocaleString("ru-RU")} твоей жизни.`
            : "Укажи дату рождения в профиле, чтобы считать дни жизни."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StreakWidget current={summary.current_streak} longest={summary.longest_streak} />
        <StatCard label="Всего записей" value={summary.total_entries} hint="за всё время" />
        <StatCard
          label="Среднее настроение"
          value={summary.avg_mood != null ? `${summary.avg_mood}/10` : "—"}
        />
        <StatCard
          label="Продуктивный день"
          value={summary.most_productive_day ?? "—"}
          hint="чаще всего пишешь"
        />
      </div>

      <ActivityHeatmap data={heatmap} />

      <div className="grid gap-4 lg:grid-cols-2">
        <MoodChart data={mood} />
        <TagsBreakdown tags={summary.top_tags} />
      </div>

      <RecentEntries />
    </div>
  );
}
