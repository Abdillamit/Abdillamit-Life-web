"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useGoals, updateGoal, deleteGoal } from "@/lib/hooks/useGoals";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalForm } from "@/components/goals/GoalForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { GOAL_STATUS_LABELS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import type { Goal, GoalStatus } from "@/types";

const STATUSES: (GoalStatus | "all")[] = ["all", "active", "completed", "paused"];

export default function GoalsPage() {
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "all">("all");
  const { goals, loading, error, refresh } = useGoals(
    statusFilter === "all" ? undefined : statusFilter,
  );
  const [open, setOpen] = useState(false);

  async function handleUpdate(id: string, patch: Partial<Goal>) {
    await updateGoal(id, patch);
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить цель?")) return;
    await deleteGoal(id);
    await refresh();
  }

  return (
    <div>
      <PageHeader
        title="Цели"
        subtitle="Куда ты движешься и насколько близко."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Цель
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              statusFilter === s
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-surface-2 text-muted hover:text-foreground",
            )}
          >
            {s === "all" ? "Все" : GOAL_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <EmptyState icon="⚠️" title="Ошибка" description={error} />
      ) : goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Целей пока нет"
          description="Поставь первую цель и отслеживай прогресс."
          action={<Button onClick={() => setOpen(true)}>Создать цель</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Новая цель">
        <GoalForm
          onCreated={() => {
            setOpen(false);
            void refresh();
          }}
        />
      </Modal>
    </div>
  );
}
