"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useBooks, updateBook, deleteBook } from "@/lib/hooks/useBooks";
import { BookCard } from "@/components/books/BookCard";
import { BookForm } from "@/components/books/BookForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import type { Book, BookStatus } from "@/types";

type Filter = BookStatus | "all";

export default function BooksPage() {
  const { books, loading, error, refresh } = useBooks();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: books.length };
    for (const s of BOOK_STATUSES) c[s] = books.filter((b) => b.status === s).length;
    return c;
  }, [books]);

  const visible = filter === "all" ? books : books.filter((b) => b.status === filter);

  async function handleUpdate(id: string, patch: Partial<Book>) {
    await updateBook(id, patch);
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить книгу из списка?")) return;
    await deleteBook(id);
    await refresh();
  }

  const FILTERS: Filter[] = ["all", ...BOOK_STATUSES];

  return (
    <div>
      <PageHeader
        title="Книги"
        subtitle="Список чтения: что прочитал, что читаешь, что в планах."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Книга
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              filter === f
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-surface-2 text-muted hover:text-foreground",
            )}
          >
            {f === "all" ? "Все" : BOOK_STATUS_LABELS[f]}
            <span className="ml-1.5 opacity-60">{counts[f] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <EmptyState icon="⚠️" title="Ошибка" description={error} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon="📚"
          title="Здесь пусто"
          description="Добавь книгу в свой список чтения."
          action={<Button onClick={() => setOpen(true)}>Добавить книгу</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Новая книга">
        <BookForm
          defaultStatus={filter === "all" ? "want_to_read" : filter}
          onCreated={() => {
            setOpen(false);
            void refresh();
          }}
        />
      </Modal>
    </div>
  );
}
