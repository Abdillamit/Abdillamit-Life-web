"use client";

import { useState } from "react";
import { Download, FileJson, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/dates";
import { moodEmoji } from "@/lib/utils/constants";
import type { Entry, Book, Goal, TimelineEvent, Tag, Profile } from "@/types";

async function fetchAllEntries(): Promise<Entry[]> {
  const all: Entry[] = [];
  let offset = 0;
  const limit = 100;
  for (;;) {
    const res = await api<{ data: Entry[]; count: number }>("/api/entries", {
      query: { limit, offset },
    });
    all.push(...res.data);
    if (all.length >= res.count || res.data.length === 0) break;
    offset += limit;
  }
  return all;
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataExport() {
  const [busy, setBusy] = useState<"json" | "md" | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  async function exportJson() {
    setBusy("json");
    try {
      const [profile, entries, books, goals, timeline, tags] = await Promise.all([
        api<{ data: Profile }>("/api/profile").then((r) => r.data),
        fetchAllEntries(),
        api<{ data: Book[] }>("/api/books").then((r) => r.data),
        api<{ data: Goal[] }>("/api/goals").then((r) => r.data),
        api<{ data: TimelineEvent[] }>("/api/timeline").then((r) => r.data),
        api<{ data: Tag[] }>("/api/tags").then((r) => r.data),
      ]);
      const payload = {
        exported_at: new Date().toISOString(),
        profile,
        entries,
        books,
        goals,
        timeline,
        tags,
      };
      download(`life-export-${today}.json`, JSON.stringify(payload, null, 2), "application/json");
    } finally {
      setBusy(null);
    }
  }

  async function exportMarkdown() {
    setBusy("md");
    try {
      const entries = await fetchAllEntries();
      const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
      const md = sorted
        .map((e) => {
          const head = `## ${formatDate(e.date, "d MMMM yyyy")} ${moodEmoji(e.mood)}`;
          const tags = e.tags.length ? `\n\n_Теги: ${e.tags.join(", ")}_` : "";
          return `${head}\n\n${e.content}${tags}`;
        })
        .join("\n\n---\n\n");
      download(`journal-${today}.md`, `# Мой журнал\n\n${md}\n`, "text/markdown");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card>
      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-muted">
        <Download className="h-4 w-4" /> Экспорт данных
      </div>
      <p className="mb-4 text-xs text-muted">
        Скачай резервную копию всех своих данных.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={exportJson} disabled={busy !== null}>
          <FileJson className="h-4 w-4" /> {busy === "json" ? "Готовлю…" : "Всё в JSON"}
        </Button>
        <Button variant="outline" onClick={exportMarkdown} disabled={busy !== null}>
          <FileText className="h-4 w-4" /> {busy === "md" ? "Готовлю…" : "Журнал в Markdown"}
        </Button>
      </div>
    </Card>
  );
}
