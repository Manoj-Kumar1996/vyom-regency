import { Home } from "lucide-react";
import type { PropertyFormData } from "@/lib/propertyUtils";

interface HomeDisplaySectionProps {
  formData: PropertyFormData;
  updateField: <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => void;
}

export default function HomeDisplaySection({ formData, updateField }: HomeDisplaySectionProps) {
  return (
    <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Home size={16} className="text-amber-700" />
        <h3 className="font-bold text-amber-800 text-sm">Home Page Display</h3>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.show_on_home}
          onChange={(e) => updateField("show_on_home", e.target.checked)}
          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
        />
        <span className="text-sm font-semibold text-gray-800">Show on Home Page</span>
      </label>

      {formData.show_on_home && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Display Layout</label>
            <select
              value={formData.display_type}
              onChange={(e) => updateField("display_type", e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="single">Single — Full Width Card</option>
              <option value="double">Double — 2 Column Card</option>
              <option value="carousel">Carousel — Slider Item</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Sort Order (0 = first)</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
