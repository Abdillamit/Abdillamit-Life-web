/** Look up a book cover image URL from Open Library by title (+ optional author). */
export async function fetchBookCover(
  title: string,
  author?: string | null,
): Promise<string | null> {
  try {
    const params = new URLSearchParams({ title, limit: "1", fields: "cover_i" });
    if (author) params.set("author", author);
    const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
    if (!res.ok) return null;
    const json = (await res.json()) as { docs?: { cover_i?: number }[] };
    const coverId = json.docs?.[0]?.cover_i;
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
  } catch {
    return null;
  }
}
