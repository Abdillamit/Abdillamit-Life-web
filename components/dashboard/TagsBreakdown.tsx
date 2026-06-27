"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { TAG_COLORS, TAG_LABELS } from "@/lib/utils/constants";

export function TagsBreakdown({ tags }: { tags: { tag: string; count: number }[] }) {
  const data = tags.map((t) => ({
    name: TAG_LABELS[t.tag] ?? t.tag,
    value: t.count,
    color: TAG_COLORS[t.tag] ?? "#9b9ba4",
  }));

  return (
    <Card>
      <div className="mb-3 text-sm font-medium text-muted">Категории</div>
      {data.length === 0 ? (
        <div className="py-8">
          <EmptyState icon="🏷️" title="Нет тегов" />
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={180}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#131316",
                  border: "1px solid #26262c",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="flex-1 space-y-1.5 text-sm">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-foreground/90">{d.name}</span>
                <span className="ml-auto text-muted">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
