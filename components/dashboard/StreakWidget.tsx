import { Card } from "@/components/ui/Card";

export function StreakWidget({
  current,
  longest,
}: {
  current: number;
  longest: number;
}) {
  return (
    <Card className="flex flex-col justify-between">
      <div className="text-sm font-medium text-muted">Текущий стрик</div>
      <div className="my-2 flex items-baseline gap-2">
        <span className="text-5xl font-bold tracking-tight">{current}</span>
        <span className="text-3xl">🔥</span>
      </div>
      <div className="text-xs text-muted">
        {current === 0
          ? "Сделай запись, чтобы зажечь огонь"
          : `дней подряд · рекорд ${longest}`}
      </div>
    </Card>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="flex flex-col justify-between">
      <div className="text-sm font-medium text-muted">{label}</div>
      <div className="my-2 text-4xl font-bold tracking-tight">{value}</div>
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </Card>
  );
}
