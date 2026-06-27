"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import type { HeatmapDay } from "@/types";

const WEEKS = 53;

function levelColor(count: number): string {
  if (count <= 0) return "#1c1c21";
  if (count === 1) return "#0f3d36";
  if (count === 2) return "#11705f";
  if (count <= 4) return "#129e84";
  return "#14b8a6";
}

export function ActivityHeatmap({ data }: { data: HeatmapDay[] }) {
  const { cells, monthLabels } = useMemo(() => {
    const map = new Map(data.map((d) => [d.date, d.count]));

    // Build a grid ending today, aligned so each column is a week (Sun..Sat).
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - (WEEKS * 7 - 1));
    // back up to the start of its week (Sunday)
    start.setDate(start.getDate() - start.getDay());

    const cells: { date: string; count: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0, 10);
      cells.push({ date: iso, count: map.get(iso) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
    const monthLabels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    for (let i = 0; i < cells.length; i += 7) {
      const d = new Date(cells[i].date);
      if (d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        monthLabels.push({ col: i / 7, label: months[d.getMonth()] });
      }
    }

    return { cells, monthLabels };
  }, [data]);

  const columns: { date: string; count: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }

  return (
    <Card>
      <div className="mb-3 text-sm font-medium text-muted">Активность за год</div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max">
          <div className="mb-1 flex gap-[3px] pl-1 text-[10px] text-muted">
            {columns.map((_, col) => {
              const label = monthLabels.find((m) => m.col === col)?.label;
              return (
                <div key={col} className="w-[11px]">
                  {label ?? ""}
                </div>
              );
            })}
          </div>
          <div className="flex gap-[3px]">
            {columns.map((week, ci) => (
              <div key={ci} className="flex flex-col gap-[3px]">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    title={`${cell.date}: ${cell.count} ${cell.count === 1 ? "запись" : "записей"}`}
                    className="h-[11px] w-[11px] rounded-[2px]"
                    style={{ backgroundColor: levelColor(cell.count) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted">
        меньше
        {[0, 1, 2, 3, 5].map((c) => (
          <span
            key={c}
            className="h-[11px] w-[11px] rounded-[2px]"
            style={{ backgroundColor: levelColor(c) }}
          />
        ))}
        больше
      </div>
    </Card>
  );
}
