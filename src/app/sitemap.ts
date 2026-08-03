import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { getAllProperties } from "@/lib/properties";
import { getAllPosts } from "@/lib/blog";
import { getAllPublishedCmsPages } from "@/lib/cms";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/about",
  "/founder",
  "/contact",
  "/gallery",
  "/estates",
  "/blog",
  "/location",
  "/privacy-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [properties, posts, cmsPages] = await Promise.all([
    getAllProperties().catch(() => []),
    getAllPosts().catch(() => []),
    getAllPublishedCmsPages().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const propertyEntries: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${siteUrl}/estates/${property.slug}`,
    lastModified: property.created_at ? new Date(property.created_at) : new Date(),
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(),
  }));

  const cmsEntries: MetadataRoute.Sitemap = cmsPages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date(page.updated_at),
  }));

  return [...staticEntries, ...propertyEntries, ...postEntries, ...cmsEntries];
}
