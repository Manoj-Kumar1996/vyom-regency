"use client";

import { useState, useEffect } from "react";
import { 
  compressAndConvertImage, 
  uploadToSupabase, 
  deleteFromStorage, 
  getGalleryImages 
} from "@/lib/imageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon, Loader2, Copy, Check, ArrowLeft, Youtube, Plus, Pencil, X as XIcon, Save } from "lucide-react";
import Link from "next/link";

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

interface GalleryVideo {
  id: number;
  url: string;
  caption: string | null;
}

export default function MediaGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("gallery");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [addingVideo, setAddingVideo] = useState(false);
  const [galleryMeta, setGalleryMeta] = useState<Record<string, { alt_text: string; title: string; description: string }>>({});
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ alt_text: "", title: "", description: "" });
  const [savingMeta, setSavingMeta] = useState(false);

  const categories = [
    { id: "hero", label: "Hero Banners", bucket: "hero-banners" }, // New Category
    { id: "gallery", label: "Gallery", bucket: "gallery" },
    { id: "properties", label: "Properties", bucket: "properties" },
    { id: "testimonials", label: "Testimonials", bucket: "testimonials" },
    { id: "blog", label: "Blog", bucket: "blog" },
  ];

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    setLoading(true);
    const bucket = categories.find(c => c.id === selectedCategory)?.bucket || "gallery";
    const imagesList = await getGalleryImages(bucket, selectedCategory);
    setImages(imagesList);

    if (selectedCategory === "gallery") {
      const { data } = await supabase
        .from("gallery")
        .select("*")
        .eq("media_type", "video")
        .order("created_at", { ascending: false });
      setVideos(data || []);

      const { data: photoRows } = await supabase
        .from("gallery")
        .select("url, alt_text, title, description")
        .neq("media_type", "video");
      const metaMap: Record<string, { alt_text: string; title: string; description: string }> = {};
      for (const row of photoRows || []) {
        metaMap[row.url] = {
          alt_text: row.alt_text || "",
          title: row.title || "",
          description: row.description || "",
        };
      }
      setGalleryMeta(metaMap);
    } else {
      setVideos([]);
      setGalleryMeta({});
    }

    setLoading(false);
  };

  const openEditDetails = (img: any) => {
    setEditingImage(img);
    setEditForm(galleryMeta[img.url] || { alt_text: "", title: "", description: "" });
  };

  const handleSaveDetails = async () => {
    if (!editingImage) return;
    setSavingMeta(true);
    try {
      const { data: existing } = await supabase
        .from("gallery")
        .select("id")
        .eq("url", editingImage.url)
        .maybeSingle();

      const payload = { alt_text: editForm.alt_text || null, title: editForm.title || null, description: editForm.description || null };

      const { error } = existing
        ? await supabase.from("gallery").update(payload).eq("id", existing.id)
        : await supabase.from("gallery").insert([{ url: editingImage.url, media_type: "photo", ...payload }]);

      if (error) throw error;
      toast.success("Image details saved");
      setEditingImage(null);
      fetchImages();
    } catch {
      toast.error("Failed to save image details");
    } finally {
      setSavingMeta(false);
    }
  };

  const handleAddVideo = async () => {
    const videoId = extractYouTubeId(youtubeUrl.trim());
    if (!videoId) {
      toast.error("Enter a valid YouTube link");
      return;
    }

    setAddingVideo(true);
    const { error } = await supabase.from("gallery").insert([{
      url: `https://www.youtube.com/embed/${videoId}`,
      caption: null,
      media_type: "video",
    }]);
    setAddingVideo(false);

    if (error) {
      toast.error("Failed to add video");
      return;
    }

    toast.success("Video added!");
    setYoutubeUrl("");
    fetchImages();
  };

  const handleDeleteVideo = async (id: number) => {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    fetchImages();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const bucket = categories.find(c => c.id === selectedCategory)?.bucket || "gallery";

    for (const file of Array.from(files)) {
      if (!file.type.includes('image')) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      try {
        toast.loading(`Optimizing ${file.name}...`, { id: file.name });
        const compressedFile = await compressAndConvertImage(file);
        
        toast.loading(`Uploading ${file.name}...`, { id: file.name });
        const { url, path, error } = await uploadToSupabase(compressedFile, bucket, selectedCategory);
        
        if (error) throw error;

        // If category is gallery, also add to the gallery table for the website
        if (selectedCategory === "gallery") {
          await supabase.from("gallery").insert([{ 
            url: url, 
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/-/g, ' ') 
          }]);
        }

        toast.success(`${file.name} uploaded!`, { id: file.name });
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`, { id: file.name });
      }
    }

    setUploading(false);
    fetchImages();
    e.target.value = '';
  };

  const handleDelete = async (image: any) => {
    if (!confirm(`Delete ${image.name}?`)) return;
    const bucket = categories.find(c => c.id === selectedCategory)?.bucket || "gallery";
    
    // Delete from storage
    const success = await deleteFromStorage(bucket, image.path);
    
    if (success) {
      // If it was in gallery, also delete from the gallery table
      if (selectedCategory === "gallery") {
        await supabase.from("gallery").delete().eq("url", image.url);
      }
      toast.success("Deleted");
      fetchImages();
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      toast.success("URL Copied");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Copy failed — select and copy the URL manually");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Media Manager</h1>
            <p className="text-gray-500 text-sm">Auto-optimized WebP images for SEO & Speed</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 mb-8 text-center hover:border-emerald-500 transition group">
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
              {uploading ? <Loader2 className="animate-spin text-emerald-700" /> : <Upload className="text-emerald-700" />}
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {uploading ? "Processing Images..." : "Click to Upload Media"}
            </p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, WebP supported • Auto-compressed</p>
          </label>
        </div>

        {selectedCategory === "gallery" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Youtube className="text-red-600" size={20} />
              <h3 className="font-semibold text-gray-700">Add YouTube Video</h3>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)"
                className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAddVideo}
                disabled={addingVideo}
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Plus size={16} /> {addingVideo ? "Adding..." : "Add Video"}
              </button>
            </div>

            {videos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-gray-50 rounded-xl overflow-hidden border group relative">
                    <div className="aspect-video">
                      <iframe
                        src={video.url}
                        className="w-full h-full"
                        title="Gallery video"
                        allowFullScreen
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin mx-auto mb-2" /> Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.name} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
                <div className="relative aspect-square bg-gray-100">
                  <img src={img.url} alt={galleryMeta[img.url]?.alt_text || ""} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDelete(img)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                  {selectedCategory === "gallery" && (
                    <button
                      onClick={() => openEditDetails(img)}
                      className="absolute top-2 left-2 bg-white/90 text-gray-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                      title="Edit alt text / title / description"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400 truncate mb-2">{img.name}</p>
                  {selectedCategory === "gallery" && !galleryMeta[img.url]?.alt_text && (
                    <p className="text-[10px] text-amber-600 mb-2">No alt text set</p>
                  )}
                  <button
                    onClick={() => copyToClipboard(img.url, img.name)}
                    className="w-full py-1.5 bg-gray-50 hover:bg-emerald-50 text-emerald-700 text-xs font-bold rounded flex items-center justify-center gap-1 transition"
                  >
                    {copiedId === img.name ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy URL</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingImage && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4" onClick={() => setEditingImage(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Image Details</h3>
              <button onClick={() => setEditingImage(null)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>
            <img src={editingImage.url} alt="" className="w-full h-40 object-cover rounded-lg" />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                value={editForm.alt_text}
                onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                placeholder="Describe the image for accessibility & SEO"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
            <button
              onClick={handleSaveDetails}
              disabled={savingMeta}
              className="w-full bg-emerald-700 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {savingMeta ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}