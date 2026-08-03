"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Loader2, ArrowLeft, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeroSlide {
  id: number;
  image_url: string;
  label: string | null;
  sort_order: number;
}

export default function HeroManagement() {
  const [isMounted, setIsMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error) setSlides(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("hero-banners")
          .upload(`hero/${fileName}`, file, {
            cacheControl: "3600",
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("hero-banners")
          .getPublicUrl(`hero/${fileName}`);

        const nextOrder = slides.length > 0 ? Math.max(...slides.map((s) => s.sort_order)) + 1 : 0;

        const { error: insertError } = await supabase.from("hero_slides").insert([{
          image_url: publicUrl,
          label: file.name.replace(/\.[^/.]+$/, ""),
          sort_order: nextOrder,
        }]);

        if (insertError) throw insertError;
      }

      toast.success("Hero slide(s) added!");
      fetchSlides();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm("Delete this hero slide?")) return;
    const { error } = await supabase.from("hero_slides").delete().eq("id", slide.id);
    if (error) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    fetchSlides();
  };

  const moveSlide = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    setSlides(reordered);

    await Promise.all(
      reordered.map((slide, i) =>
        supabase.from("hero_slides").update({ sort_order: i }).eq("id", slide.id)
      )
    );
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/admin/dashboard")} className="p-2 hover:bg-gray-200 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Hero Banner Slider</h1>
            <p className="text-sm text-gray-500">Manage the rotating images shown on the homepage hero.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 mb-8 text-center hover:border-green-500 transition">
          <label className="cursor-pointer flex flex-col items-center">
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
              {uploading ? <Loader2 className="animate-spin text-green-700" /> : <Upload className="text-green-700" />}
            </div>
            <p className="font-semibold text-gray-700">{uploading ? "Uploading..." : "Click to add slide images"}</p>
            <p className="text-xs text-gray-400 mt-1">You can select multiple images at once</p>
          </label>
        </div>

        {slides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
            No hero slides yet — the homepage will show default placeholder images until you add some.
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div key={slide.id} className="bg-white rounded-xl shadow-sm border flex items-center gap-4 p-3">
                <div className="flex flex-col gap-1 text-gray-400">
                  <button onClick={() => moveSlide(index, -1)} disabled={index === 0} className="disabled:opacity-20 hover:text-gray-700">▲</button>
                  <button onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1} className="disabled:opacity-20 hover:text-gray-700">▼</button>
                </div>
                <img src={slide.image_url} alt={slide.label || ""} className="w-24 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-700 text-sm">{slide.label || "Untitled slide"}</p>
                  <p className="text-xs text-gray-400">Order: {index + 1}</p>
                </div>
                <button onClick={() => handleDelete(slide)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
