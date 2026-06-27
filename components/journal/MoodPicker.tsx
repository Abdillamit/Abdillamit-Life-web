"use client";

import { MOODS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

export function MoodPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const current = MOODS.find((m) => m.value === value);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-muted">
        <span>Настроение</span>
        <span className="text-foreground">
          {current ? `${current.emoji} ${current.label}` : "не указано"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(value === m.value ? null : m.value)}
            title={`${m.value} — ${m.label}`}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all",
              value === m.value
                ? "scale-110 bg-accent/20 ring-2 ring-accent"
                : "bg-surface-2 hover:bg-[#27272e]",
            )}
          >
            {m.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
