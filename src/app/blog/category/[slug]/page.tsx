import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByCategory, getCategories } from "@/lib/blog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((cat) => cat.slug === slug);
  if (!category) {
    return { title: "Category Not Found" };
  }
  return {
    title: `${category.name} | Vyom Regency Blog`,
    description: `Read all blog posts about ${category.name.toLowerCase()}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((cat) => cat.slug === slug);
  const posts = await getPostsByCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <Header />
      <section className="py-32 md:py-40 bg-white">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-green-700 font-semibold mb-4 hover:underline"
          >
            <ArrowLeft size={16} /> Back to All Blogs
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {category.name}
          </h1>
          <p className="text-gray-600 mb-6">
            {posts.length} post{posts.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span>• {post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="text-green-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No posts found in this category yet.
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}