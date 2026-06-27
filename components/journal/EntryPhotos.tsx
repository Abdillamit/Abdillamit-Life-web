"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

/** Multi-photo uploader for journal entries (stored in the public `avatars` bucket). */
export function EntryPhotos({
  value,
  onChange,
  userId,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  userId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    const client = supabase();
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${userId}/entries/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await client.storage.from("avatars").upload(path, file);
        if (upErr) throw upErr;
        uploaded.push(client.storage.from("avatars").getPublicUrl(path).data.publicUrl);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((url) => (
          <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border">
            <Image src={url} alt="Фото" fill className="object-cover" sizes="80px" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              aria-label="Удалить фото"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-border bg-surface-2 text-muted hover:text-foreground"
        >
          {uploading ? <LoadingSpinner /> : <ImagePlus className="h-6 w-6" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
}
