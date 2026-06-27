"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BookText, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { todayISO } from "@/lib/utils/dates";
import { fetchBookCover } from "@/lib/openLibrary";
import { updateBook } from "@/lib/hooks/useBooks";
import type { Book, BookStatus } from "@/types";

export function BookCard({
  book,
  onUpdate,
  onDelete,
}: {
  book: Book;
  onUpdate: (id: string, patch: Partial<Book>) => void;
  onDelete: (id: string) => void;
}) {
  const [cover, setCover] = useState<string | null>(book.cover_url);

  // Auto-fetch a cover from Open Library once if we don't have one, and persist it.
  useEffect(() => {
    let active = true;
    if (book.cover_url) {
      setCover(book.cover_url);
      return;
    }
    fetchBookCover(book.title, book.author).then((url) => {
      if (!active || !url) return;
      setCover(url);
      void updateBook(book.id, { cover_url: url }).catch(() => {});
    });
    return () => {
      active = false;
    };
  }, [book.id, book.title, book.author, book.cover_url]);

  function changeStatus(status: BookStatus) {
    const patch: Partial<Book> = { status };
    if (status === "reading" && !book.started_at) patch.started_at = todayISO();
    if (status === "read" && !book.finished_at) patch.finished_at = todayISO();
    onUpdate(book.id, patch);
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-surface-2">
          {cover ? (
            <Image src={cover} alt="" fill className="object-cover" sizes="56px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <BookText className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium leading-snug text-foreground">{book.title}</h3>
          {book.author && <p className="mt-0.5 text-xs text-muted">{book.author}</p>}
        </div>
        <button
          onClick={() => onDelete(book.id)}
          className="shrink-0 text-muted hover:text-red-400"
          aria-label="Удалить книгу"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2">
        <Select
          value={book.status}
          onChange={(e) => changeStatus(e.target.value as BookStatus)}
          className="h-8 w-auto text-xs"
        >
          {BOOK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {BOOK_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>

        {book.status === "read" && (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onUpdate(book.id, { rating: book.rating === n ? null : n })}
                aria-label={`Оценка ${n}`}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    book.rating && n <= book.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
