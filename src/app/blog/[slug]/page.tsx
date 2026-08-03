import BlogDetailClient from "./BlogDetailClient";
import { getPostBySlug } from "@/lib/blog";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteUrl } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, mergeCustomJsonLd } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const title = post.meta_title || `${post.title} | Vyom Regency Blog`;
  const description = post.meta_description || post.excerpt;
  const siteUrl = getSiteUrl();
  const canonical = post.canonical_url || `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.og_image || post.image || undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: post.robots_index ?? true,
      follow: post.robots_follow ?? true,
    },
    openGraph: {
      title: post.og_title || title,
      description: post.og_description || description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: post.og_title || title,
      description: post.og_description || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const jsonLd = mergeCustomJsonLd(
    [
      articleSchema({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        date: post.date,
        url: `${siteUrl}/blog/${post.slug}`,
      }),
      breadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Blog", url: `${siteUrl}/blog` },
        { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
      ]),
    ],
    post.custom_json_ld
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <BlogDetailClient post={post} />
      <Footer />
    </>
  );
}