"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote } from "lucide-react";

interface Review {
  id: number;
  name: string;
  experience: string;
  rating: number;
  created_at: string;
}

export default function VisitorReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      const { data, error } = await supabase
        .from("website_feedback")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (!error) {
        setReviews(data || []);
      }
      setLoading(false);
    };

    fetchApprovedReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">Wall of Love</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2">
            Recent <span className="text-green-700">Visitor Reviews</span>
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative hover:shadow-lg transition-shadow"
            >
              <Quote className="absolute top-4 right-4 text-green-100" size={40} />
              
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < review.rating ? "text-amber-400 fill-current" : "text-gray-300"}`} 
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-6 relative z-10 italic">
                "{review.experience}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{review.name}</h4>
                  <p className="text-[10px] text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}