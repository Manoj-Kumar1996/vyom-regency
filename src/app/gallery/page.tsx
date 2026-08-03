import GalleryClient from "./GalleryClient";
import { getPageSeo, buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("gallery");
  return buildMetadata(
    seo,
    {
      title: "Gallery | Vyom Regency Pvt Ltd",
      description: "Browse photos and videos of Vyom Regency's premium farmhouse plots and agriculture land developments in Rajasthan.",
    },
    { path: "/gallery" }
  );
}

export default async function GalleryPage() {
  const seo = await getPageSeo("gallery");
  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: `${siteUrl}/gallery`, name: "Gallery", description: seo?.meta_description || undefined }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Gallery", url: `${siteUrl}/gallery` },
      ]),
    ],
    seo?.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <GalleryClient />
    </>
  );
}
