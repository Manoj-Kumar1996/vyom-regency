import { Upload, X, CheckCircle, Clock, Ban } from "lucide-react";
import type { PropertyFormData } from "@/lib/propertyUtils";

const STATUS_OPTIONS = [
  { value: "available", label: "Available", icon: CheckCircle, color: "text-green-600" },
  { value: "limited", label: "Limited", icon: Clock, color: "text-amber-600" },
  { value: "sold", label: "Sold Out", icon: Ban, color: "text-gray-500" },
];

const PROPERTY_TYPES = [
  { value: "project", label: "Project", desc: "Large developments like Vyom Green Paradise" },
  { value: "individual", label: "Individual Land", desc: "Standalone plots for sale" },
];

interface BasicDetailsSectionProps {
  formData: PropertyFormData;
  updateField: <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => void;
  uploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicDetailsSection({ formData, updateField, uploading, onImageUpload }: BasicDetailsSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateField("property_type", type.value)}
              className={`p-4 rounded-xl border-2 text-left transition ${
                formData.property_type === type.value
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-gray-800">{type.label}</p>
              <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Property Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="e.g. Individual Premium Farm Land - Mundawar"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="e.g. Mundawar, Khairthal"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("status", opt.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition ${
                    formData.status === opt.value
                      ? "border-green-600 bg-green-50 text-green-800"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Icon size={14} className={opt.color} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
          <input
            type="text"
            required
            value={formData.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="e.g. ₹1500/- Sq Yard"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Include currency and unit (per sq yard, per acre, etc.)</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Plot Size *</label>
          <input
            type="text"
            required
            value={formData.size}
            onChange={(e) => updateField("size", e.target.value)}
            placeholder="e.g. 4500 Sq. Yards"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Registry Type</label>
          <select
            value={formData.registry_type}
            onChange={(e) => updateField("registry_type", e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="">Not specified</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Possession</label>
          <select
            value={formData.possession_status}
            onChange={(e) => updateField("possession_status", e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="">Not specified</option>
            <option value="ready">Ready to Move</option>
            <option value="under_development">Under Development</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Plots Left</label>
          <input
            type="number"
            min={0}
            value={formData.plots_left ?? ""}
            onChange={(e) => updateField("plots_left", e.target.value === "" ? null : parseInt(e.target.value) || 0)}
            placeholder="Leave blank to hide"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
        <p className="text-xs text-gray-400 mb-3">Main image shown on listing cards and detail page hero</p>
        <div className="flex gap-3 items-center">
          {formData.image_url && (
            <div className="relative group shrink-0">
              <img src={formData.image_url} alt="Cover" className="w-20 h-20 object-cover rounded-xl border" />
              <button
                type="button"
                onClick={() => updateField("image_url", "")}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition">
            <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
            <Upload className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600 font-medium">
              {uploading ? "Uploading..." : formData.image_url ? "Replace image" : "Upload cover image"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
