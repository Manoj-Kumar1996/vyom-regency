import { NextResponse, type NextRequest } from "next/server";
import { getActiveRedirects, normalizePath } from "@/lib/redirects";

const CACHE_TTL_MS = 60_000;
let cachedRedirects: { path: string; to: string; type: 301 | 302 }[] | null = null;
let cachedAt = 0;

async function getRedirectsCached() {
  const now = Date.now();
  if (cachedRedirects && now - cachedAt < CACHE_TTL_MS) return cachedRedirects;

  const rules = await getActiveRedirects();
  cachedRedirects = rules.map((r) => ({
    path: normalizePath(r.from_path),
    to: r.to_path,
    type: r.redirect_type,
  }));
  cachedAt = now;
  return cachedRedirects;
}

export async function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);
  const rules = await getRedirectsCached();
  const match = rules.find((r) => r.path === pathname);

  if (match) {
    const destination = match.to.startsWith("http") ? match.to : new URL(match.to, request.url);
    return NextResponse.redirect(destination, match.type);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!admin|api|_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
