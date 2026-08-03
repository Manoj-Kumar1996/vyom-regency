import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { getPublishedCmsPageBySlug } from "@/lib/cms";
import { buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, faqPageSchema, mergeCustomJsonLd } from "@/lib/schema";
import { getFaqsForRoute } from "@/lib/faq";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CmsPageProps) {
  const { slug } = await params;
  const page = await getPublishedCmsPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };

  return buildMetadata(
    page,
    { title: page.title, description: page.meta_description || "" },
    { path: `/${page.slug}` }
  );
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params;
  const page = await getPublishedCmsPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageFaqs = await getFaqsForRoute(`cms:${page.slug}`);
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: `${siteUrl}/${page.slug}`, name: page.title, description: page.meta_description || undefined }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: page.title, url: `${siteUrl}/${page.slug}` },
      ]),
      faqPageSchema(pageFaqs.map((f) => ({ question: f.question, answer: f.answer }))),
    ].filter((entry): entry is Exclude<typeof entry, null> => entry !== null),
    page.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">{page.title}</h1>
          <div
            className="prose prose-green max-w-none"
            dangerouslySetInnerHTML={{ __html: page.body || "" }}
          />
        </div>
      </main>
      {pageFaqs.length > 0 && <FAQ route={`cms:${page.slug}`} />}
      <Footer />
    </>
  );
}
