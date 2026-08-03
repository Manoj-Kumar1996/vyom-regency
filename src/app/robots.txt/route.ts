import { getGlobalSettings, getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function defaultRobotsTxt(siteUrl: string): string {
  return [
    "User-agent: *",
    "Disallow: /admin",
    "Disallow: /api",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}

export async function GET() {
  const settings = await getGlobalSettings();
  const body = settings?.robots_txt_override?.trim()
    ? settings.robots_txt_override
    : defaultRobotsTxt(getSiteUrl());

  return new Response(body, {
    headers: { "content-type": "text/plain" },
  });
}
