"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import WysiwygEditor from "@/components/WysiwygEditor";
import { slugify, RESERVED_SLUGS, type CmsPage } from "@/lib/cms";

export interface CmsPageFormData {
  title: string;
  slug: string;
  body: string;
  status: "draft" | "published";
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  custom_json_ld: string;
}

export const defaultCmsPageFormData: CmsPageFormData = {
  title: "",
  slug: "",
  body: "",
  status: "draft",
  meta_title: "",
  meta_description: "",
  focus_keyword: "",
  canonical_url: "",
  robots_index: true,
  robots_follow: true,
  og_title: "",
  og_description: "",
  og_image: "",
  twitter_card: "summary_large_image",
  custom_json_ld: "",
};

export function cmsPageFormDataFromRecord(page: CmsPage): CmsPageFormData {
  return {
    title: page.title,
    slug: page.slug,
    body: page.body || "",
    status: page.status,
    meta_title: page.meta_title || "",
    meta_description: page.meta_description || "",
    focus_keyword: page.focus_keyword || "",
    canonical_url: page.canonical_url || "",
    robots_index: page.robots_index ?? true,
    robots_follow: page.robots_follow ?? true,
    og_title: page.og_title || "",
    og_description: page.og_description || "",
    og_image: page.og_image || "",
    twitter_card: page.twitter_card || "summary_large_image",
    custom_json_ld: page.custom_json_ld || "",
  };
}

function isValidJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

interface CmsPageFormProps {
  mode: "add" | "edit";
  pageId?: string;
  initialData?: CmsPageFormData;
}

export default function CmsPageForm({ mode, pageId, initialData }: CmsPageFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CmsPageFormData>(initialData || defaultCmsPageFormData);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof CmsPageFormData>(key: K, value: CmsPageFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    updateField("title", title);
    if (!slugManuallyEdited) {
      updateField("slug", slugify(title));
    }
  };

  const isReservedSlug = RESERVED_SLUGS.includes(formData.slug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const slug = slugify(formData.slug || formData.title);
    if (!slug) {
      toast.error("A valid slug is required");
      return;
    }
    if (RESERVED_SLUGS.includes(slug)) {
      toast.error(`"${slug}" is a reserved route and can't be used as a CMS page slug`);
      return;
    }

    setSubmitting(true);
    const payload = {
      title: formData.title,
      slug,
      body: formData.body,
      status: formData.status,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      focus_keyword: formData.focus_keyword || null,
      canonical_url: formData.canonical_url || null,
      robots_index: formData.robots_index,
      robots_follow: formData.robots_follow,
      og_title: formData.og_title || null,
      og_description: formData.og_description || null,
      og_image: formData.og_image || null,
      twitter_card: formData.twitter_card,
      custom_json_ld: formData.custom_json_ld || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } =
        mode === "edit" && pageId
          ? await supabase.from("cms_pages").update(payload).eq("id", pageId)
          : await supabase.from("cms_pages").insert([payload]);
      if (error) throw error;
      toast.success(mode === "edit" ? "Page updated" : "Page created");
      router.push("/admin/cms-pages");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      toast.error(message.includes("duplicate") ? "A page with this slug already exists" : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/cms-pages" className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{mode === "edit" ? "Edit Page" : "New Page"}</h1>
          <p className="text-sm text-gray-500">Simple title + rich-text pages, managed without touching code</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">/</span>
              <input
                type="text"
                value={formData.slug}
                onClick={() => setSlugManuallyEdited(true)}
                onChange={(e) => { setSlugManuallyEdited(true); updateField("slug", e.target.value); }}
                className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
              />
            </div>
            {isReservedSlug && (
              <p className="text-xs text-red-500 mt-1">
                This slug is reserved by an existing route and would be unreachable — choose another.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value as "draft" | "published")}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="draft">Draft (not publicly visible)</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Body</label>
            <WysiwygEditor value={formData.body} onChange={(v) => updateField("body", v)} placeholder="Write the page content..." />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm">SEO</h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
            <input
              type="text"
              maxLength={70}
              value={formData.meta_title}
              onChange={(e) => updateField("meta_title", e.target.value)}
              placeholder={formData.title || "Falls back to page title"}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.meta_title.length}/70 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
            <textarea
              rows={2}
              maxLength={160}
              value={formData.meta_description}
              onChange={(e) => updateField("meta_description", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.meta_description.length}/160 characters</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Focus Keyword</label>
            <input
              type="text"
              value={formData.focus_keyword}
              onChange={(e) => updateField("focus_keyword", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Canonical URL</label>
            <input
              type="text"
              value={formData.canonical_url}
              onChange={(e) => updateField("canonical_url", e.target.value)}
              placeholder="Leave blank to auto-generate"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" checked={formData.robots_index} onChange={(e) => updateField("robots_index", e.target.checked)} className="w-4 h-4 accent-green-700" />
              Index
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" checked={formData.robots_follow} onChange={(e) => updateField("robots_follow", e.target.checked)} className="w-4 h-4 accent-green-700" />
              Follow
            </label>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open Graph / Twitter</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">OG Title</label>
                <input type="text" value={formData.og_title} onChange={(e) => updateField("og_title", e.target.value)} placeholder="Falls back to meta title" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">OG Image URL</label>
                <input type="text" value={formData.og_image} onChange={(e) => updateField("og_image", e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">OG Description</label>
              <textarea rows={2} value={formData.og_description} onChange={(e) => updateField("og_description", e.target.value)} placeholder="Falls back to meta description" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter Card Type</label>
              <select value={formData.twitter_card} onChange={(e) => updateField("twitter_card", e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                <option value="summary_large_image">Summary Large Image</option>
                <option value="summary">Summary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Custom JSON-LD (advanced)</label>
            <textarea
              rows={3}
              value={formData.custom_json_ld}
              onChange={(e) => updateField("custom_json_ld", e.target.value)}
              placeholder='{"@context": "https://schema.org", "@type": "Thing", ...}'
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none font-mono text-xs"
            />
            {formData.custom_json_ld.trim() && !isValidJson(formData.custom_json_ld) && (
              <p className="text-xs text-red-500 mt-1">Not valid JSON — this will be ignored on the live page.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || isReservedSlug}
          className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Page"}
        </button>
      </div>
    </form>
  );
}
