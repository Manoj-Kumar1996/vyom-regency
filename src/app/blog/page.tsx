import BlogClient from "./BlogClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getCategories } from "@/lib/blog";
import { getPageSeo, buildMetadata, getSiteUrl } from "@/lib/seo";
import { webPageSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("blog");
  return buildMetadata(
    seo,
    {
      title: "Blog | Vyom Regency Pvt Ltd - Farmhouse Living & Agriculture Land Guide",
      description:
        "Expert insights on farmhouse living, agriculture land investment, organic farming, and real estate in Rajasthan. Read our blog for tips and updates.",
    },
    { path: "/blog" }
  );
}

export default async function BlogPage() {
  const [posts, categories, seo] = await Promise.all([getAllPosts(), getCategories(), getPageSeo("blog")]);
  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      webPageSchema({ url: `${siteUrl}/blog`, name: "Blog", description: seo?.meta_description || undefined }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Blog", url: `${siteUrl}/blog` },
      ]),
    ],
    seo?.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <BlogClient posts={posts} categories={categories} />
      <Footer />
    </>
  );
}
