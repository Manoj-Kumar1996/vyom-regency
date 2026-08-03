import { supabase } from "@/integrations/supabase/client";

export interface RedirectRule {
  id?: number;
  from_path: string;
  to_path: string;
  redirect_type: 301 | 302;
  is_active: boolean;
}

export async function getActiveRedirects(): Promise<RedirectRule[]> {
  const { data, error } = await supabase
    .from("redirects")
    .select("*")
    .eq("is_active", true);

  if (error || !data) return [];
  return data as RedirectRule[];
}

export function normalizePath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;
}
