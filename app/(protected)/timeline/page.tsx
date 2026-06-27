"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTimeline, createEvent, deleteEvent } from "@/lib/hooks/useTimeline";
import { TimelineView } from "@/components/timeline/TimelineView";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { EVENT_TYPES } from "@/lib/utils/constants";
import { todayISO } from "@/lib/utils/dates";
import type { EventType } from "@/types";

export default function TimelinePage() {
  const { events, loading, error, refresh } = useTimeline();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(todayISO());
  const [eventType, setEventType] = useState<EventType>("personal");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createEvent({
        title,
        description: description || null,
        event_date: eventDate,
        event_type: eventType,
      });
      setOpen(false);
      setTitle("");
      setDescription("");
      setEventDate(todayISO());
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить событие?")) return;
    await deleteEvent(id);
    await refresh();
  }

  return (
    <div>
      <PageHeader
        title="Таймлайн жизни"
        subtitle="Ключевые события, расставленные по годам."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Событие
          </Button>
        }
      />

      {loading ? (
        <PageLoader />
      ) : error ? (
        <EmptyState icon="⚠️" title="Ошибка" description={error} />
      ) : events.length === 0 ? (
        <EmptyState
          icon="🚩"
          title="Таймлайн пуст"
          description="Добавь важные вехи: учёбу, работу, достижения, путешествия."
          action={<Button onClick={() => setOpen(true)}>Добавить событие</Button>}
        />
      ) : (
        <TimelineView events={events} onDelete={handleDelete} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Новое событие">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <Label htmlFor="t-title">Название</Label>
            <Input
              id="t-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Поступил в университет"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="t-date">Дата</Label>
              <Input
                id="t-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="t-type">Тип</Label>
              <Select
                id="t-type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="t-desc">Описание</Label>
            <Textarea
              id="t-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Необязательно"
            />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Сохраняем…" : "Добавить"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
