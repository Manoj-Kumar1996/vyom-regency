import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

const TABLES = [
  "properties",
  "testimonials",
  "leads",
  "gallery",
  "blog_posts",
  "settings",
  "site_settings",
] as const;

function getProjectRef(url?: string) {
  if (!url) return null;

  try {
    return new URL(url).hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        ok: false,
        projectRef: getProjectRef(supabaseUrl),
        env: {
          NEXT_PUBLIC_SUPABASE_URL: Boolean(supabaseUrl),
          NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
          publishableKeyAvailable: Boolean(publishableKey),
          SUPABASE_SERVICE_ROLE_KEY: Boolean(serviceRoleKey),
        },
        error: "Missing required Supabase environment variables",
      },
      { status: 500 }
    );
  }

  const supabase = createSupabaseAdminClient();

  const checks = await Promise.all(
    TABLES.map(async (table) => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      return {
        table,
        ok: !error,
        count: count ?? 0,
        error: error?.message ?? null,
      };
    })
  );

  return NextResponse.json({
    ok: checks.every((check) => check.ok),
    projectRef: getProjectRef(supabaseUrl),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: true,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
      publishableKeyAvailable: Boolean(publishableKey),
      SUPABASE_SERVICE_ROLE_KEY: true,
    },
    checks,
  });
}
