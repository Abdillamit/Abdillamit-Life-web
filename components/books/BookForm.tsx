"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "@/lib/utils/constants";
import { createBook } from "@/lib/hooks/useBooks";
import type { Book, BookStatus } from "@/types";

export function BookForm({
  defaultStatus = "want_to_read",
  onCreated,
}: {
  defaultStatus?: BookStatus;
  onCreated: (book: Book) => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>(defaultStatus);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const book = await createBook({
        title: title.trim(),
        author: author.trim() || null,
        status,
      });
      onCreated(book);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="b-title">Название</Label>
        <Input
          id="b-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Clean Code"
          autoFocus
        />
      </div>
      <div>
        <Label htmlFor="b-author">Автор</Label>
        <Input
          id="b-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Robert C. Martin"
        />
      </div>
      <div>
        <Label htmlFor="b-status">Статус</Label>
        <Select
          id="b-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as BookStatus)}
        >
          {BOOK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {BOOK_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Добавляем…" : "Добавить книгу"}
      </Button>
    </form>
  );
}
