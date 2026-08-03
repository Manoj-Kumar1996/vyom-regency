import ContactClient from "./ContactClient";
import { getPageSeo, buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("contact");
  return buildMetadata(
    seo,
    {
      title: "Contact Us | Vyom Regency Pvt Ltd",
      description:
        "Get in touch with Vyom Regency Pvt Ltd for premium farmhouse plots and agriculture land in Rajasthan. Call, WhatsApp, or visit us.",
    },
    { path: "/contact" }
  );
}

export default async function ContactPage() {
  const seo = await getPageSeo("contact");
  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: `${siteUrl}/contact`, name: "Contact Us", description: seo?.meta_description || undefined }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Contact", url: `${siteUrl}/contact` },
      ]),
    ],
    seo?.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ContactClient />
    </>
  );
}
