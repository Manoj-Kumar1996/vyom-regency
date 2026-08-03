import { supabase } from "@/integrations/supabase/client";
import type { Metadata } from "next";
import { cache } from "react";

export interface PageSeo {
  route: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url?: string | null;
  robots_index?: boolean | null;
  robots_follow?: boolean | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_card?: string | null;
  custom_json_ld?: string | null;
}

export const SEO_ROUTES = [
  { route: "home", label: "Home Page", path: "/" },
  { route: "about", label: "About Us", path: "/about" },
  { route: "founder", label: "Founder", path: "/founder" },
  { route: "contact", label: "Contact", path: "/contact" },
  { route: "gallery", label: "Gallery", path: "/gallery" },
  { route: "estates", label: "Estates Listing", path: "/estates" },
  { route: "blog", label: "Blog Listing", path: "/blog" },
] as const;

export interface GlobalSettings {
  id?: number;
  site_title: string | null;
  site_description: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;
  ga4_measurement_id: string | null;
  gtm_container_id: string | null;
  meta_pixel_id: string | null;
  gsc_verification_code: string | null;
  header_scripts: string | null;
  footer_scripts: string | null;
  robots_txt_override: string | null;
  org_legal_name: string | null;
  org_logo_url: string | null;
  org_type: "Organization" | "LocalBusiness" | null;
  geo_latitude: number | null;
  geo_longitude: number | null;
  custom_json_ld_global: string | null;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** Fetches the singleton `settings` row. Memoized per-request via React's cache() — never
 * cached across requests, so admin edits to settings show up on the very next page load. */
export const getGlobalSettings = cache(async (): Promise<GlobalSettings | null> => {
  const { data } = await supabase.from("settings").select("*").maybeSingle();
  return (data as GlobalSettings) || null;
});

export async function getPageSeo(route: string): Promise<PageSeo | null> {
  const { data } = await supabase.from("page_seo").select("*").eq("route", route).maybeSingle();
  return data;
}

export interface BuildMetadataOptions {
  /** Site-relative path (e.g. "/about") used to compute the default canonical URL and OG url. */
  path?: string;
  /** Fallback OG/Twitter image, used when neither the row nor an explicit og image is set. */
  image?: string;
}

/**
 * Merges a SEO row (from page_seo / properties / blog_posts / cms_pages — anything shaped
 * like PageSeo) with fallback values into a full Next.js Metadata object: title, description,
 * canonical, robots, Open Graph, and Twitter card.
 */
export function buildMetadata(
  seo: PageSeo | null,
  fallback: { title: string; description: string },
  options: BuildMetadataOptions = {}
): Metadata {
  const title = seo?.meta_title || fallback.title;
  const description = seo?.meta_description || fallback.description;
  const siteUrl = getSiteUrl();
  const canonical = seo?.canonical_url || (options.path ? `${siteUrl}${options.path}` : undefined);
  const ogImage = seo?.og_image || options.image;

  const metadata: Metadata = {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: seo?.robots_index ?? true,
      follow: seo?.robots_follow ?? true,
    },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: (seo?.twitter_card as "summary" | "summary_large_image") || "summary_large_image",
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };

  return metadata;
}
