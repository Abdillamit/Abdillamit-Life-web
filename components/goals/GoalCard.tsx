"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GOAL_STATUS_LABELS } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/dates";
import type { Goal } from "@/types";

const STATUS_COLOR: Record<string, string> = {
  active: "#14b8a6",
  completed: "#22c55e",
  paused: "#f59e0b",
  abandoned: "#9b9ba4",
};

function CircularProgress({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#26262c" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="#14b8a6"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-all duration-500"
      />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90"
        fill="#ededed"
        fontSize="14"
        fontWeight="600"
        transform="rotate(90 32 32)"
      >
        {value}%
      </text>
    </svg>
  );
}

export function GoalCard({
  goal,
  onUpdate,
  onDelete,
}: {
  goal: Goal;
  onUpdate: (id: string, patch: Partial<Goal>) => void;
  onDelete: (id: string) => void;
}) {
  const [progress, setProgress] = useState(goal.progress);

  function commit(value: number) {
    setProgress(value);
    onUpdate(goal.id, {
      progress: value,
      status: value >= 100 ? "completed" : goal.status === "completed" ? "active" : goal.status,
    });
  }

  return (
    <Card>
      <div className="flex items-start gap-4">
        <CircularProgress value={progress} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground">{goal.title}</h3>
            <Badge color={STATUS_COLOR[goal.status]}>{GOAL_STATUS_LABELS[goal.status]}</Badge>
          </div>
          {goal.description && (
            <p className="mt-1 text-sm text-muted">{goal.description}</p>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-muted">
            {goal.category && <span>{goal.category}</span>}
            {goal.target_date && <span>до {formatDate(goal.target_date)}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          onMouseUp={(e) => commit(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commit(Number((e.target as HTMLInputElement).value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent"
        />
        <button
          onClick={() => onDelete(goal.id)}
          className="text-muted hover:text-red-400"
          aria-label="Удалить цель"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
