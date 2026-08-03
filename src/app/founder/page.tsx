import FounderClient from "./FounderClient";
import { getPageSeo, buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("founder");
  return buildMetadata(
    seo,
    {
      title: "Founder | Mr. Sobaran Singh - Ex-NSG Commando | Vyom Regency Pvt Ltd",
      description:
        "Meet Mr. Sobaran Singh, Founder of Vyom Regency Pvt Ltd. An Ex-NSG Commando with decades of experience in real estate and land development across UP, Uttarakhand & Rajasthan.",
    },
    { path: "/founder" }
  );
}

export default async function FounderPage() {
  const seo = await getPageSeo("founder");
  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: `${siteUrl}/founder`, name: "Founder", description: seo?.meta_description || undefined }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Founder", url: `${siteUrl}/founder` },
      ]),
    ],
    seo?.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <FounderClient />
    </>
  );
}
