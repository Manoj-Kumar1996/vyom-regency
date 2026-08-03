import PropertyDetailClient from "./PropertyDetailClient";
import { getPropertyBySlug } from "@/lib/properties";
import { getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  const title = property.meta_title || `${property.name} | Vyom Regency`;
  const description = property.meta_description || stripHtml(property.description || "").slice(0, 160);
  const siteUrl = getSiteUrl();
  const canonical = property.canonical_url || `${siteUrl}/estates/${property.slug}`;
  const ogImage = property.og_image || property.image_url || undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: property.robots_index ?? true,
      follow: property.robots_follow ?? true,
    },
    openGraph: {
      title: property.og_title || title,
      description: property.og_description || description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: property.og_title || title,
      description: property.og_description || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  const siteUrl = getSiteUrl();

  const jsonLd = property
    ? mergeCustomJsonLd(
        [
          webPageSchema({
            url: `${siteUrl}/estates/${property.slug}`,
            name: property.name,
            description: property.meta_description || undefined,
          }),
          breadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Estates", url: `${siteUrl}/estates` },
            { name: property.name, url: `${siteUrl}/estates/${property.slug}` },
          ]),
        ],
        property.custom_json_ld
      )
    : [];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PropertyDetailClient />
    </>
  );
}
