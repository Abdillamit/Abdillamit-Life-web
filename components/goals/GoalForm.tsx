"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { createGoal } from "@/lib/hooks/useGoals";
import type { Goal } from "@/types";

export function GoalForm({ onCreated }: { onCreated: (goal: Goal) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const goal = await createGoal({
        title,
        description: description || null,
        category: category || null,
        target_date: targetDate || null,
      });
      onCreated(goal);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="g-title">Цель</Label>
        <Input
          id="g-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Выучить английский до C1"
        />
      </div>
      <div>
        <Label htmlFor="g-desc">Описание</Label>
        <Textarea
          id="g-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Необязательно"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="g-cat">Категория</Label>
          <Input
            id="g-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Саморазвитие"
          />
        </div>
        <div>
          <Label htmlFor="g-date">Дедлайн</Label>
          <Input
            id="g-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Создаём…" : "Создать цель"}
      </Button>
    </form>
  );
}
