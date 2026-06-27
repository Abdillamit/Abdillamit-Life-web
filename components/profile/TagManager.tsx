"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useTags, createTag, updateTag, deleteTag } from "@/lib/hooks/useTags";
import { tagColor } from "@/lib/utils/constants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Tag } from "@/types";

const PALETTE = [
  "#14b8a6", "#3b82f6", "#22c55e", "#a855f7",
  "#ec4899", "#f59e0b", "#ef4444", "#6366f1",
];

export function TagManager() {
  const { tags, loading, refresh } = useTags();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PALETTE[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(PALETTE[0]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createTag({ name: newName.trim(), color: newColor });
      setNewName("");
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(tag: Tag) {
    setEditId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
  }

  async function saveEdit() {
    if (!editId || !editName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await updateTag(editId, { name: editName.trim(), color: editColor });
      setEditId(null);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить тег? Из существующих записей он не пропадёт.")) return;
    await deleteTag(id);
    await refresh();
  }

  return (
    <Card id="tags" className="scroll-mt-20">
      <div className="mb-1 text-sm font-medium text-muted">Мои теги</div>
      <p className="mb-4 text-xs text-muted">
        Создавай, переименовывай и удаляй теги — они появятся при создании записей.
      </p>

      {loading ? (
        <div className="flex justify-center py-6">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) =>
            editId === tag.id ? (
              <div key={tag.id} className="flex items-center gap-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-9 flex-1"
                  autoFocus
                />
                <ColorPicker value={editColor} onChange={setEditColor} />
                <Button size="icon" className="h-9 w-9" onClick={saveEdit} disabled={busy}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  onClick={() => setEditId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                key={tag.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: tagColor(tag.name, tag.color) }}
                />
                <span className="flex-1 text-sm">{tag.name}</span>
                <button
                  onClick={() => startEdit(tag)}
                  className="text-muted hover:text-foreground"
                  aria-label="Изменить"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="text-muted hover:text-red-400"
                  aria-label="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          )}
        </div>
      )}

      <form onSubmit={handleCreate} className="mt-4 flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Новый тег…"
          className="h-9 flex-1"
          maxLength={40}
        />
        <ColorPicker value={newColor} onChange={setNewColor} />
        <Button type="submit" size="icon" className="h-9 w-9" disabled={busy}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </Card>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex gap-1">
      {PALETTE.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="h-6 w-6 rounded-full border-2 transition-transform"
          style={{
            backgroundColor: c,
            borderColor: value === c ? "#ededed" : "transparent",
            transform: value === c ? "scale(1.15)" : undefined,
          }}
          aria-label={`Цвет ${c}`}
        />
      ))}
    </div>
  );
}
