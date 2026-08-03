import { supabase } from "@/integrations/supabase/client";
import type { PageSeo } from "@/lib/seo";

export interface CmsPage extends PageSeo {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

/** File-route folders under src/app that a CMS page slug must never collide with. */
export const RESERVED_SLUGS = [
  "about",
  "admin",
  "api",
  "blog",
  "contact",
  "estates",
  "founder",
  "gallery",
  "location",
  "login",
  "privacy-policy",
  "robots.txt",
  "sitemap.xml",
];

export async function getPublishedCmsPageBySlug(slug: string): Promise<CmsPage | null> {
  const { data } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function getAllCmsPages(): Promise<CmsPage[]> {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as CmsPage[];
}

export async function getAllPublishedCmsPages(): Promise<CmsPage[]> {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("status", "published");
  if (error || !data) return [];
  return data as CmsPage[];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
