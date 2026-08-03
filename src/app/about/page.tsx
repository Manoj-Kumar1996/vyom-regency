import AboutClient from "./AboutClient";
import { getPageSeo, buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("about");
  return {
    ...buildMetadata(
      seo,
      {
        title: "About Us | Vyom Regency Pvt Ltd - Trusted Since 2017",
        description: "Learn about Vyom Regency Pvt Ltd, established in 2017 by Ex-NSG Commando Mr. Sobaran Singh.",
      },
      { path: "/about" }
    ),
    keywords: seo?.focus_keyword || "Vyom Regency, about us, NSG commando, real estate",
  };
}

export default async function AboutPage() {
  const seo = await getPageSeo("about");
  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: `${siteUrl}/about`, name: "About Us", description: seo?.meta_description || undefined }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "About Us", url: `${siteUrl}/about` },
      ]),
    ],
    seo?.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutClient />
    </>
  );
}
