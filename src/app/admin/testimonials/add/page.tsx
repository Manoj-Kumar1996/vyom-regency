"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddTestimonial() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    rating: 5,
    text: "",
    media_type: "text",
    image_url: "",
    video_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("testimonials")
        .insert([formData]);

      if (error) throw error;

      toast.success("Testimonial added successfully");
      router.push("/admin/testimonials");
    } catch (error) {
      console.error("Error adding:", error);
      toast.error("Add karne mein error aaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/testimonials" className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Testimonial</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
              <input
                type="text"
                required
                placeholder="Farmhouse Owner/Investor"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
              <select
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                <option value={3}>⭐⭐⭐ 3 Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Media Type *</label>
              <select
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                value={formData.media_type}
                onChange={(e) => setFormData({...formData, media_type: e.target.value as any})}
              >
                <option value="text">📝 Text Only</option>
                <option value="photo">📸 Photo + Text</option>
                <option value="video">🎥 Video + Text</option>
              </select>
            </div>
          </div>

          {formData.media_type === "photo" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
              <input
                type="url"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>
          )}

          {formData.media_type === "video" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Embed URL *</label>
              <input
                type="url"
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Testimonial Text *</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
            />
          </div>

          <button
            type="submit" 
            disabled={loading}
            className="w-full bg-green-700 text-white py-4 rounded-xl font-bold hover:bg-green-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? "Adding..." : "Add Testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
}