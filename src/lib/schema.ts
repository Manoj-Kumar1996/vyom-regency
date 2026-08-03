import type { GlobalSettings } from "@/lib/seo";
import { getSiteUrl } from "@/lib/seo";
import { SOCIAL_PROFILE_URLS } from "@/lib/socialLinks";

/** Pure JSON-LD builder functions — the "core set" of schema types (Organization, LocalBusiness,
 * Website, WebPage, Breadcrumb, FAQPage, Article). Each returns a plain object ready to be
 * serialized by <JsonLd />. */

export function organizationSchema(settings: GlobalSettings | null) {
  const siteUrl = getSiteUrl();
  const type = settings?.org_type || "LocalBusiness";
  const name = settings?.org_legal_name || settings?.site_title || "Vyom Regency Pvt Ltd";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    url: siteUrl,
    logo: settings?.org_logo_url || undefined,
    image: settings?.org_logo_url || undefined,
    telephone: settings?.contact_phone || undefined,
    email: settings?.contact_email || undefined,
    description: settings?.site_description || undefined,
    sameAs: SOCIAL_PROFILE_URLS,
  };

  if (settings?.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: settings.address,
    };
  }

  if (type === "LocalBusiness" && settings?.geo_latitude != null && settings?.geo_longitude != null) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: settings.geo_latitude,
      longitude: settings.geo_longitude,
    };
  }

  return schema;
}

// Alias kept distinct for clarity at call sites even though it currently delegates to the same
// builder — organizationSchema() already switches on settings.org_type.
export function localBusinessSchema(settings: GlobalSettings | null) {
  return organizationSchema(settings);
}

export function websiteSchema(settings: GlobalSettings | null) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.site_title || "Vyom Regency Pvt Ltd",
    url: siteUrl,
  };
}

export function webPageSchema(page: { url: string; name: string; description?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.name,
    url: page.url,
    description: page.description || undefined,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function articleSchema(post: {
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
  date?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || (post.content ? stripHtml(post.content).slice(0, 160) : undefined),
    image: post.image || undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    datePublished: post.date || undefined,
    mainEntityOfPage: post.url,
  };
}

/**
 * Safely parses an admin-authored custom JSON-LD string and appends it alongside the base
 * schema objects. Malformed JSON is silently ignored (never crashes SSR) — the admin form
 * validates on save, but old/edited-out-of-band rows shouldn't be able to take a page down.
 */
export function mergeCustomJsonLd(base: object[], customJsonLd?: string | null): object[] {
  if (!customJsonLd || !customJsonLd.trim()) return base;
  try {
    const parsed = JSON.parse(customJsonLd);
    return Array.isArray(parsed) ? [...base, ...parsed] : [...base, parsed];
  } catch {
    return base;
  }
}
