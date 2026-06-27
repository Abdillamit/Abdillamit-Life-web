import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

let browserClient: ReturnType<typeof createClient> | null = null;

/** Shared singleton browser client. */
export function supabase() {
  if (!browserClient) browserClient = createClient();
  return browserClient;
}
