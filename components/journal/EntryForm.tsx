"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { MoodPicker } from "./MoodPicker";
import { TAGS, TAG_LABELS, TAG_COLORS } from "@/lib/utils/constants";
import { todayISO } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import { createEntry, updateEntry } from "@/lib/hooks/useEntries";
import type { Entry } from "@/types";

export function EntryForm({ entry }: { entry?: Entry }) {
  const router = useRouter();
  const [content, setContent] = useState(entry?.content ?? "");
  const [mood, setMood] = useState<number | null>(entry?.mood ?? null);
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [date, setDate] = useState(entry?.date ?? todayISO());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Запись не может быть пустой");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = { content: content.trim(), mood, tags, date };
      const saved = entry
        ? await updateEntry(entry.id, payload)
        : await createEntry(payload);
      router.push(`/journal/${saved.id}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="date">Дата</Label>
        <Input
          id="date"
          type="date"
          value={date}
          max={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className="w-auto"
        />
      </div>

      <div>
        <Label htmlFor="content">Что произошло сегодня?</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Опиши свой день… (поддерживается markdown)"
          className="min-h-48"
          autoFocus
        />
      </div>

      <MoodPicker value={mood} onChange={setMood} />

      <div>
        <Label>Теги</Label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const active = tags.includes(tag);
            const color = TAG_COLORS[tag];
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  active
                    ? "font-medium"
                    : "border-border bg-surface-2 text-muted hover:text-foreground",
                )}
                style={
                  active
                    ? { borderColor: `${color}88`, backgroundColor: `${color}22`, color }
                    : undefined
                }
              >
                {TAG_LABELS[tag]}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Сохраняем…" : entry ? "Сохранить" : "Создать запись"}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
