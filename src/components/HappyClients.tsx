"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Testimonial {
  id: number | string;
  name: string;
  location: string;
  type: string;
  rating: number;
  text: string;
  media_type: "video" | "photo" | "text";
  image_url?: string;
  video_url?: string;
  created_at: string;
  status: string;
}

export default function HappyClients() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "video" | "photo" | "text">("all");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const [testimonialsRes, feedbackRes] = await Promise.all([
      supabase.from("testimonials").select("*").eq("status", "approved").order("created_at", { ascending: false }),
      supabase.from("website_feedback").select("*").eq("status", "approved").order("created_at", { ascending: false }),
    ]);

    if (testimonialsRes.error) console.error("Testimonials error:", testimonialsRes.error);
    if (feedbackRes.error) console.error("Feedback error:", feedbackRes.error);

    const testimonialsData: Testimonial[] = testimonialsRes.data || [];
    const feedbackData = (feedbackRes.data || []).map((f: { id: number; name: string; rating: number; experience: string; created_at: string }) => ({
      id: `feedback-${f.id}`,
      name: f.name,
      location: "",
      type: "Visitor",
      rating: f.rating,
      text: f.experience,
      media_type: "text" as const,
      created_at: f.created_at,
      status: "approved",
    }));

    setTestimonials([...testimonialsData, ...feedbackData]);
    setLoading(false);
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeTab === "all") return true;
    return t.media_type === activeTab;
  });

  const stats = {
    total: testimonials.length,
    video: testimonials.filter((t) => t.media_type === "video").length,
    photo: testimonials.filter((t) => t.media_type === "photo").length,
  };

  if (loading) return (
    <div className="py-20 flex justify-center">
      <Loader2 className="animate-spin text-green-700" size={40} />
    </div>
  );

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            Our Happy Families
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2 mb-4">
            What Our <span className="text-amber-600">Clients Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {stats.total}+ families trust Vyom Regency for their farmhouse dreams
          </p>
          <div className="w-20 h-1 bg-green-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-3xl mx-auto text-center">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-700">{stats.total}+</div>
            <div className="text-xs text-gray-500">Happy Families</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-700">100%</div>
            <div className="text-xs text-gray-500">Satisfaction</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-700">{stats.video}</div>
            <div className="text-xs text-gray-500">Video Reviews</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-700">5.0</div>
            <div className="text-xs text-gray-500">Google Rating</div>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "all"
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-1 ${
              activeTab === "video"
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📹 Video ({stats.video})
          </button>
          <button
            onClick={() => setActiveTab("photo")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "photo"
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📸 Photo + Text ({stats.photo})
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Media Content */}
              {testimonial.media_type === "video" && (
                <div className="aspect-video bg-gray-900 relative group">
                  <iframe
                    src={testimonial.video_url}
                    title={`${testimonial.name} - Video Testimonial`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    Video
                  </div>
                </div>
              )}

              {testimonial.media_type === "photo" && (
                <div className="relative">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Photo
                  </div>
                </div>
              )}

              {testimonial.media_type === "text" && (
                <div className="bg-gradient-to-r from-amber-50 to-green-50 p-6 text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                    Written
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 text-sm italic mb-4 line-clamp-3">
                  "{testimonial.text}"
                </p>

                {/* Client Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-gray-400">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {testimonial.type}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(testimonial.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-3">Join our family of happy customers</p>
          <a
            href="#lead-form"
            className="inline-block bg-green-700 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition"
          >
            Book Your Farmhouse Today →
          </a>
        </div>
      </div>
    </section>
  );
}