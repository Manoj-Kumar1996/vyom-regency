import { Search } from "lucide-react";
import type { PropertyFormData } from "@/lib/propertyUtils";

interface SeoSectionProps {
  formData: PropertyFormData;
  updateField: <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => void;
}

export default function SeoSection({ formData, updateField }: SeoSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Search size={16} className="text-blue-700" />
        <h3 className="font-bold text-gray-800 text-sm">SEO</h3>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          placeholder="auto-generated from name if left blank"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          Changing this on an existing property will change its live URL — update any shared links.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => updateField("meta_title", e.target.value)}
          placeholder={formData.name || "Falls back to property name"}
          maxLength={70}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">{formData.meta_title.length}/70 characters</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => updateField("meta_description", e.target.value)}
          placeholder="Falls back to the property description"
          maxLength={160}
          rows={3}
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
          placeholder="e.g. farm land in Mundawar"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Canonical URL</label>
        <input
          type="text"
          value={formData.canonical_url}
          onChange={(e) => updateField("canonical_url", e.target.value)}
          placeholder="Leave blank to auto-generate from the URL slug"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={formData.robots_index}
            onChange={(e) => updateField("robots_index", e.target.checked)}
            className="w-4 h-4 accent-green-700"
          />
          Index
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={formData.robots_follow}
            onChange={(e) => updateField("robots_follow", e.target.checked)}
            className="w-4 h-4 accent-green-700"
          />
          Follow
        </label>
      </div>

      <div className="pt-3 border-t border-gray-100 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Open Graph / Twitter</p>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">OG Title</label>
          <input
            type="text"
            value={formData.og_title}
            onChange={(e) => updateField("og_title", e.target.value)}
            placeholder={formData.meta_title || formData.name || "Falls back to meta title"}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">OG Description</label>
          <textarea
            value={formData.og_description}
            onChange={(e) => updateField("og_description", e.target.value)}
            placeholder="Falls back to meta description"
            rows={2}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">OG Image URL</label>
          <input
            type="text"
            value={formData.og_image}
            onChange={(e) => updateField("og_image", e.target.value)}
            placeholder="Falls back to the cover image"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Custom JSON-LD (advanced)</label>
        <textarea
          value={formData.custom_json_ld}
          onChange={(e) => updateField("custom_json_ld", e.target.value)}
          placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
          rows={3}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none font-mono text-xs"
        />
        {formData.custom_json_ld.trim() && !isValidJson(formData.custom_json_ld) && (
          <p className="text-xs text-red-500 mt-1">Not valid JSON — this will be ignored on the live page.</p>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Google Preview</p>
        <p className="text-blue-700 text-base leading-tight truncate">
          {(formData.meta_title || formData.name || "Untitled").slice(0, 60)}
        </p>
        <p className="text-green-800 text-xs mt-0.5">vyomregency.com{formData.slug ? `/estates/${formData.slug}` : ""}</p>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {(formData.meta_description || "No description set").slice(0, 160)}
        </p>
      </div>
    </div>
  );
}

function isValidJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
