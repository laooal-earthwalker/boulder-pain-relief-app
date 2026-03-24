import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Fall back to placeholder values when env vars are not yet configured.
  // Construction succeeds; network calls fail gracefully inside useEffect handlers
  // (no SSR crash). Auth forms show a descriptive error from the API response.
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
  return createBrowserClient(url, key);
}
