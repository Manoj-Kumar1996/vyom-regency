import HomeClient from "./HomeClient";
import { getPageSeo, buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, faqPageSchema, mergeCustomJsonLd } from "@/lib/schema";
import { getFaqsForRoute } from "@/lib/faq";
import JsonLd from "@/components/JsonLd";
import { supabase } from "@/integrations/supabase/client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("home");
  return buildMetadata(
    seo,
    {
      title: "Vyom Regency Pvt Ltd - Premium Farmhouse Plots in Rajasthan",
      description:
        "Vyom Regency offers premium agriculture land and farmhouse plots in Kishangarh Bas, Alwar, Rajasthan. Clear titles, transparent deals since 2017.",
    },
    { path: "/" }
  );
}

export default async function Home() {
  const [slidesRes, contentRes, seo, homeFaqs] = await Promise.all([
    supabase.from("hero_slides").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_content").select("*").eq("page", "home"),
    getPageSeo("home"),
    getFaqsForRoute("home"),
  ]);

  const initialSlides = slidesRes.data && slidesRes.data.length > 0
    ? slidesRes.data.map((s) => ({ label: s.label || `slide-${s.id}`, url: s.image_url }))
    : null;

  const initialContent: Record<string, string> = {};
  if (contentRes.data) {
    contentRes.data.forEach((item) => {
      initialContent[item.section] = item.content;
    });
  }

  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: siteUrl, name: "Home", description: seo?.meta_description || undefined }),
      faqPageSchema(homeFaqs.map((f) => ({ question: f.question, answer: f.answer }))),
    ].filter((entry): entry is Exclude<typeof entry, null> => entry !== null),
    seo?.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeClient initialSlides={initialSlides} initialContent={initialContent} />
    </>
  );
}
