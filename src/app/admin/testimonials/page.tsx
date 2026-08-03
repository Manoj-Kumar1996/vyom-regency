"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit, Plus, Video, Image as ImageIcon, FileText, Star, Loader2, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  type: string;
  rating: number;
  text: string;
  media_type: "video" | "photo" | "text";
  image_url?: string;
  video_url?: string;
  status: "pending" | "approved";
  source: "admin" | "visitor";
  created_at: string;
}

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;
      toast.success("Testimonial approved and published!");
      fetchTestimonials();
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Kya aap ise delete karna chahte hain?")) {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Delete failed");
      } else {
        toast.success("Deleted successfully");
        fetchTestimonials();
      }
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    filter === "all" ? true : t.status === filter
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-green-700" size={40} />
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Testimonials & Feedback</h1>
          <p className="text-gray-500 text-sm">Manage admin reviews and visitor feedback</p>
        </div>
        <Link 
          href="/admin/testimonials/add"
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition flex items-center gap-2 shadow-md"
        >
          <Plus size={18} /> Add New Testimonial
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button 
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "all" ? "bg-green-700 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          All ({testimonials.length})
        </button>
        <button 
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === "pending" ? "bg-amber-600 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          <Clock size={16} /> Pending ({testimonials.filter(t => t.status === 'pending').length})
        </button>
        <button 
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === "approved" ? "bg-green-700 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          <CheckCircle size={16} /> Approved
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid gap-4">
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No testimonials found.</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-shadow ${testimonial.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-lg text-gray-800">{testimonial.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      testimonial.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                    }`}>
                      {testimonial.status}
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">
                      Source: {testimonial.source}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 italic">"{testimonial.text}"</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">📍 {testimonial.location}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={12} fill="currentColor" /> {testimonial.rating}/5
                    </span>
                    <span className="flex items-center gap-1">📅 {new Date(testimonial.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  {testimonial.status === "pending" && (
                    <button 
                      onClick={() => handleApprove(testimonial.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition text-sm font-semibold"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  <Link 
                    href={`/admin/testimonials/edit/${testimonial.id}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-semibold"
                  >
                    <Edit size={16} /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(testimonial.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition text-sm font-semibold"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}