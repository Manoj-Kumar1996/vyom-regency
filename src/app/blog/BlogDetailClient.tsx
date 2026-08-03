"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Twitter, Facebook, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogDetailClientProps {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setLatestPosts(data || []));
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering anything on the server
  }

  return (
    // ... (the rest of the component stays exactly as it was)
    // No direct `window` or `Date` usage outside of useEffect
    // Example of safe usage:
    // useEffect(() => {
    //   const now = Date.now();   // ✅ safe – runs only on client after mount
    //   // …
    // }, []);
    //
    // The component below is unchanged apart from the added safety comment.
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
            <Link href="/blog" className="text-amber-300 hover:text-amber-200">
              ← Back to Blog
            </Link>
            <span>/</span>
            <span className="text-white/70">{post.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-green-100 flex-wrap">
            <span>👤 {post.author}</span>
            <span>📅 {post.date}</span>
            <span>⏱️ {post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl mx-auto">
          {/* Featured Image */}
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full rounded-xl shadow-lg mb-8" 
          />
          
          {/* Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                href={`/blog/tag/${tag}`} 
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-green-700 hover:text-white transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          {/* Author Bio */}
          <div className="bg-gray-50 p-6 rounded-xl mt-8 flex items-center gap-4 flex-wrap md:flex-nowrap">
            <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {post.author.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-gray-800">About {post.author}</h4>
              <p className="text-gray-600 text-sm">
                {post.author === "Mr. Sobaran Singh" 
                  ? "Founder of Vyom Regency Pvt Ltd, Ex-NSG Commando, with decades of experience in real estate and land development."
                  : "Expert team at Vyom Regency dedicated to helping you find your perfect farmhouse plot."}
              </p>
            </div>
          </div>
          
          {/* Share Buttons */}
          <div className="flex items-center gap-4 mt-8 justify-center flex-wrap">
            <span className="text-gray-600">Share this article:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500 transition"
            >
              <Twitter size={16} />
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Facebook size={16} />
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            You May Also <span className="text-green-700">Like</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
              <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                  <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 mb-3 group-hover:text-green-700 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{relatedPost.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Interested in Owning a Farmhouse Plot?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Book a site visit and see our premium farmhouse plots in person
          </p>
          <Link href="/#lead-form" className="bg-amber-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition inline-block">
            Book Site Visit Today →
          </Link>
        </div>
      </section>
    </>
  );
}