import { Plus, X, GripVertical } from "lucide-react";
import WysiwygEditor from "@/components/WysiwygEditor";
import type { PropertyFormData } from "@/lib/propertyUtils";

interface ContentTabProps {
  formData: PropertyFormData;
  updateField: <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => void;
  onFeatureChange: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

export default function ContentTab({ formData, updateField, onFeatureChange, onAddFeature, onRemoveFeature }: ContentTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <p className="text-xs text-gray-400 mb-3">Write a compelling description. Use headings and bullet lists for readability.</p>
        <WysiwygEditor
          value={formData.description}
          onChange={(val) => updateField("description", val)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Key Features</label>
            <p className="text-xs text-gray-400">Highlight what makes this property special</p>
          </div>
          <button
            type="button"
            onClick={onAddFeature}
            className="text-sm text-green-700 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus size={14} /> Add Feature
          </button>
        </div>

        {formData.features.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-sm mb-3">No features added yet</p>
            <button
              type="button"
              onClick={onAddFeature}
              className="text-green-700 font-semibold text-sm hover:underline"
            >
              + Add your first feature
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 items-center group">
                <GripVertical size={16} className="text-gray-300 shrink-0" />
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => onFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1} — e.g. Clear Title Documentation`}
                  className="flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => onRemoveFeature(index)}
                  className="text-red-500 hover:bg-red-50 rounded-lg p-2 transition opacity-60 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
