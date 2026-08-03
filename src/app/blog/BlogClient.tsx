"use client";

import Link from "next/link";
import type { BlogPost, BlogCategory } from "@/lib/blog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Mail, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogClientProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const featuredPosts = posts.filter((post) => post.featured);
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error) {
      if (error.code === "23505") {
        toast.info("Already subscribed!", { description: "This email is already on our list." });
      } else {
        toast.error("Subscription failed", { description: "Please try again." });
      }
      return;
    }
    toast.success("Subscribed!", {
      description: "You'll receive our latest updates soon.",
    });
    setEmail("");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-amber-400">Blog</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Expert insights on farmhouse living, agriculture investment, and real estate in Rajasthan
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            Featured <span className="text-green-700">Articles</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
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
        </div>
      </section>

      {/* Main Blog Grid with Sidebar */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Posts Grid */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Latest Posts
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Categories
                </h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/blog/category/${cat.slug}`}
                        className="flex items-center justify-between text-gray-600 hover:text-green-700 transition"
                      >
                        <span>{cat.name}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(posts.flatMap((post) => post.tags))).map(
                    (tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag}`}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-green-700 hover:text-white transition"
                      >
                        #{tag}
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl shadow-md p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                <p className="text-green-100 text-sm mb-4">
                  Get the latest farmhouse tips and real estate updates directly in your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-amber-500 text-green-900 hover:bg-amber-400 font-bold"
                  >
                    <Mail size={16} className="mr-2" />
                    Subscribe Now
                  </Button>
                </form>
              </div>

              {/* CTA */}
              <div className="bg-amber-50 rounded-2xl shadow-md p-6 border border-amber-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Looking for Farmhouse Plots?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explore our premium farmhouse projects in Rajasthan with clear titles and world-class amenities.
                </p>
                <Link
                  href="/#lead-form"
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2 hover:bg-green-800 transition"
                >
                  <CalendarCheck size={16} />
                  Book Site Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Farmhouse Journey?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join hundreds of happy families who chose Vyom Regency for their dream farmhouse
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/#lead-form"
              className="bg-amber-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition"
            >
              Book Site Visit Today →
            </Link>
            <a
              href="tel:+918955311031"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition"
            >
              Call: +91 89553 11031
            </a>
          </div>
        </div>
      </section>
    </>
  );
}