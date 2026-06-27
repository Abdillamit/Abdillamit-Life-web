"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { LoadingSpinner } from "./LoadingSpinner";

/** Uploads an image to the Supabase `avatars` bucket and returns its public URL. */
export function PhotoUpload({
  value,
  onChange,
  userId,
}: {
  value: string | null;
  onChange: (url: string) => void;
  userId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const client = supabase();
      const { error: upErr } = await client.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = client.storage.from("avatars").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-2 text-muted"
      >
        {value ? (
          <Image src={value} alt="Аватар" fill className="object-cover" sizes="80px" />
        ) : uploading ? (
          <LoadingSpinner />
        ) : (
          <Camera className="h-6 w-6" />
        )}
      </button>
      <div className="text-sm">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-accent hover:underline"
          disabled={uploading}
        >
          {uploading ? "Загрузка…" : "Сменить фото"}
        </button>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
