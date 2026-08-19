"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, Search } from "lucide-react";
import { SEO_ROUTES, type PageSeo } from "@/lib/seo";

type RouteSeo = {
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
};

type SeoFormState = Record<string, RouteSeo>;

const EMPTY_ROUTE_SEO: RouteSeo = {
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

function isValidJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [form, setForm] = useState<SeoFormState>({});

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    const { data } = await supabase.from("page_seo").select("*");
    const rows = (data as PageSeo[]) || [];
    const next: SeoFormState = {};
    for (const r of SEO_ROUTES) {
      const existing = rows.find((row) => row.route === r.route);
      next[r.route] = {
        meta_title: existing?.meta_title || "",
        meta_description: existing?.meta_description || "",
        focus_keyword: existing?.focus_keyword || "",
        canonical_url: existing?.canonical_url || "",
        robots_index: existing?.robots_index ?? true,
        robots_follow: existing?.robots_follow ?? true,
        og_title: existing?.og_title || "",
        og_description: existing?.og_description || "",
        og_image: existing?.og_image || "",
        twitter_card: existing?.twitter_card || "summary_large_image",
        custom_json_ld: existing?.custom_json_ld || "",
      };
    }
    setForm(next);
    setLoading(false);
  };

  const updateField = <K extends keyof RouteSeo>(route: string, key: K, value: RouteSeo[K]) => {
    setForm((prev) => ({ ...prev, [route]: { ...(prev[route] || EMPTY_ROUTE_SEO), [key]: value } }));
  };

  const handleSave = async (route: string) => {
    setSaving(route);
    try {
      const { error } = await supabase
        .from("page_seo")
        .upsert({ route, ...form[route], updated_at: new Date().toISOString() }, { onConflict: "route" });
      if (error) throw error;
      toast.success("SEO saved");
    } catch {
      toast.error("Failed to save SEO");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-green-700" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Search className="text-green-700" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SEO Settings</h1>
          <p className="text-sm text-gray-500">Edit meta, Open Graph, robots, and structured data for each page</p>
        </div>
      </div>

      <div className="space-y-6">
        {SEO_ROUTES.map((r) => {
          const values = form[r.route] || EMPTY_ROUTE_SEO;
          return (
            <div key={r.route} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-gray-800">{r.label}</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  maxLength={70}
                  value={values.meta_title}
                  onChange={(e) => updateField(r.route, "meta_title", e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">{values.meta_title.length}/70 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={values.meta_description}
                  onChange={(e) => updateField(r.route, "meta_description", e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{values.meta_description.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Focus Keyword</label>
                <input
                  type="text"
                  value={values.focus_keyword}
                  onChange={(e) => updateField(r.route, "focus_keyword", e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Canonical URL</label>
                <input
                  type="text"
                  placeholder="Leave blank to auto-generate"
                  value={values.canonical_url}
                  onChange={(e) => updateField(r.route, "canonical_url", e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={values.robots_index}
                    onChange={(e) => updateField(r.route, "robots_index", e.target.checked)}
                    className="w-4 h-4 accent-green-700"
                  />
                  Index
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={values.robots_follow}
                    onChange={(e) => updateField(r.route, "robots_follow", e.target.checked)}
                    className="w-4 h-4 accent-green-700"
                  />
                  Follow
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open Graph / Twitter</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">OG Title</label>
                    <input
                      type="text"
                      placeholder="Falls back to meta title"
                      value={values.og_title}
                      onChange={(e) => updateField(r.route, "og_title", e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">OG Image URL</label>
                    <input
                      type="text"
                      value={values.og_image}
                      onChange={(e) => updateField(r.route, "og_image", e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">OG Description</label>
                  <textarea
                    rows={2}
                    placeholder="Falls back to meta description"
                    value={values.og_description}
                    onChange={(e) => updateField(r.route, "og_description", e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter Card Type</label>
                  <select
                    value={values.twitter_card}
                    onChange={(e) => updateField(r.route, "twitter_card", e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="summary">Summary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom JSON-LD (advanced)</label>
                <textarea
                  rows={3}
                  placeholder='{"@context": "https://schema.org", "@type": "Thing", ...}'
                  value={values.custom_json_ld}
                  onChange={(e) => updateField(r.route, "custom_json_ld", e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none font-mono text-xs"
                />
                {values.custom_json_ld.trim() && !isValidJson(values.custom_json_ld) && (
                  <p className="text-xs text-red-500 mt-1">Not valid JSON — this will be ignored on the live page.</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Google Preview</p>
                <p className="text-blue-700 text-base leading-tight truncate">
                  {(values.meta_title || r.label).slice(0, 60)}
                </p>
                <p className="text-green-800 text-xs mt-0.5">vyomregency.com{r.path}</p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {(values.meta_description || "No description set").slice(0, 250)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSave(r.route)}
                disabled={saving === r.route}
                className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50"
              >
                {saving === r.route ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
