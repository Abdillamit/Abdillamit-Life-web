"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils/dates";
import type { MoodPoint } from "@/types";

export function MoodChart({ data }: { data: MoodPoint[] }) {
  return (
    <Card>
      <div className="mb-3 text-sm font-medium text-muted">Настроение · 30 дней</div>
      {data.length === 0 ? (
        <div className="py-8">
          <EmptyState icon="📈" title="Нет данных о настроении" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262c" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => formatDate(d, "d.MM")}
              stroke="#9b9ba4"
              fontSize={11}
              tickLine={false}
            />
            <YAxis domain={[1, 10]} stroke="#9b9ba4" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#131316",
                border: "1px solid #26262c",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelFormatter={(d) => formatDate(String(d))}
              formatter={(v) => [`${v}/10`, "Настроение"]}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#14b8a6" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
