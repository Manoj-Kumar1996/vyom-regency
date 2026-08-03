"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Loader2, Upload, X, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import WysiwygEditor from "@/components/WysiwygEditor";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  canonical_url?: string | null;
  robots_index?: boolean | null;
  robots_follow?: boolean | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  custom_json_ld?: string | null;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    categorySlug: "",
    author: "",
    date: "",
    readTime: "",
    image: "",
    tags: [],
    featured: false,
    meta_title: "",
    meta_description: "",
    focus_keyword: "",
    canonical_url: "",
    robots_index: true,
    robots_follow: true,
    og_title: "",
    og_description: "",
    og_image: "",
    custom_json_ld: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      const autoSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, slugManuallyEdited]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("blog_categories").select("*").order("name");
    if (!error) setCategories(data || []);
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const { data, error } = await supabase
      .from("blog_categories")
      .insert({ name, slug })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add category");
      return;
    }
    setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setFormData((prev) => ({ ...prev, category: data.name, categorySlug: data.slug }));
    setNewCategoryName("");
    setAddingCategory(false);
    toast.success("Category added");
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditing(post);
    setSlugManuallyEdited(true);
    setFormData({
      ...post,
      tags: post.tags || [],
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this blog post?")) {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Delete failed");
      } else {
        toast.success("Deleted successfully");
        fetchPosts();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required");
      return;
    }

    setSaving(true);
    const isNew = !editing;
    try {
      const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const wordCount = (formData.content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
      const payload = {
        ...formData,
        tags: formData.tags ?? [],
        date: formData.date || today,
        readTime: formData.readTime || readTime,
      };
      const { error } = isNew
        ? await supabase.from("blog_posts").insert(payload)
        : await supabase.from("blog_posts").update(payload).eq("id", editing!.id);

      if (error) {
        console.error("Error saving post:", error);
        toast.error("Save failed");
      } else {
        toast.success(isNew ? "Post created" : "Post updated");
        router.push("/admin/blog");
        fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const filePath = `posts/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("blog").upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type,
      });

      if (error) throw error;
      const { data } = supabase.storage.from("blog").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, image: data.publicUrl }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  if (!isMounted) return null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-green-700" size={48} />
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/admin" className="text-green-700 hover:text-green-800">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Admin Blog Management</h1>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
        >
          {editing ? "Back to List" : "New Post"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug || ""}
              onClick={() => !slugManuallyEdited && setSlugManuallyEdited(true)}
              onChange={(e) => { setSlugManuallyEdited(true); setFormData({ ...formData, slug: e.target.value }); }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            {!slugManuallyEdited && formData.title && (
              <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Click to edit.</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt *</label>
          <textarea
            required
            rows={2}
            value={formData.excerpt || ""}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            {!addingCategory ? (
              <div className="flex gap-2">
                <select
                  value={formData.categorySlug || ""}
                  onChange={(e) => {
                    const opt = categories.find((o) => o.slug === e.target.value);
                    setFormData({ ...formData, categorySlug: e.target.value, category: opt?.name || "" });
                  }}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddingCategory(true)}
                  title="Add new category"
                  className="shrink-0 flex items-center justify-center w-11 border rounded-lg text-green-700 hover:bg-green-50 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="shrink-0 px-3 border rounded-lg bg-green-700 text-white hover:bg-green-800 transition text-sm font-semibold"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setAddingCategory(false); setNewCategoryName(""); }}
                  className="shrink-0 flex items-center justify-center w-11 border rounded-lg text-gray-500 hover:bg-gray-50 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Author *</label>
            <input
              type="text"
              value={formData.author || ""}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., farmhouse, investment"
              value={formData.tags?.join(",") || ""}
              onChange={(e) => setFormData({
                ...formData,
                tags: e.target.value.split(",").filter(t => t.trim()),
              })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={formData.featured === true}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm font-semibold text-gray-700">Mark as featured</span>
        </label>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <div className="flex gap-3 items-center">
            {formData.image && (
              <div className="relative group shrink-0">
                <img src={formData.image} alt="Cover" className="w-20 h-20 object-cover rounded-xl border" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: "" })}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <label className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <Upload className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600 font-medium">
                {uploadingImage ? "Uploading..." : formData.image ? "Replace image" : "Upload cover image"}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
          <WysiwygEditor
            value={formData.content || ""}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Write the blog post..."
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">SEO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                placeholder={formData.title ? `${formData.title} | Vyom Regency Blog` : "Falls back to post title"}
                maxLength={70}
                value={formData.meta_title || ""}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Focus Keyword</label>
              <input
                type="text"
                placeholder="e.g. farmhouse investment guide"
                value={formData.focus_keyword || ""}
                onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
            <textarea
              rows={2}
              maxLength={160}
              placeholder="Falls back to the excerpt"
              value={formData.meta_description || ""}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Canonical URL</label>
            <input
              type="text"
              placeholder="Leave blank to auto-generate from the slug"
              value={formData.canonical_url || ""}
              onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={formData.robots_index ?? true}
                onChange={(e) => setFormData({ ...formData, robots_index: e.target.checked })}
                className="w-4 h-4 accent-green-700"
              />
              Index
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={formData.robots_follow ?? true}
                onChange={(e) => setFormData({ ...formData, robots_follow: e.target.checked })}
                className="w-4 h-4 accent-green-700"
              />
              Follow
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">OG Title</label>
              <input
                type="text"
                placeholder="Falls back to meta title"
                value={formData.og_title || ""}
                onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">OG Image URL</label>
              <input
                type="text"
                placeholder="Falls back to the cover image"
                value={formData.og_image || ""}
                onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">OG Description</label>
            <textarea
              rows={2}
              placeholder="Falls back to meta description"
              value={formData.og_description || ""}
              onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Custom JSON-LD (advanced)</label>
            <textarea
              rows={3}
              placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
              value={formData.custom_json_ld || ""}
              onChange={(e) => setFormData({ ...formData, custom_json_ld: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || saving}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Post"}
          </button>
          <button
            type="button"
          onClick={() => { setEditing(null); setSlugManuallyEdited(false); }}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Posts List */}
      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
