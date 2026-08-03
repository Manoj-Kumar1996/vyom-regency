import EstatesClient from "./EstatesClient";
import { getPageSeo, buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("estates");
  return buildMetadata(
    seo,
    {
      title: "Estates & Properties | Vyom Regency Pvt Ltd",
      description: "Explore premium farmhouse plots and individual land properties from Vyom Regency across Rajasthan.",
    },
    { path: "/estates" }
  );
}

export default async function EstatesPage() {
  const seo = await getPageSeo("estates");
  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: `${siteUrl}/estates`, name: "Estates & Properties", description: seo?.meta_description || undefined }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Estates", url: `${siteUrl}/estates` },
      ]),
    ],
    seo?.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <EstatesClient />
    </>
  );
}
