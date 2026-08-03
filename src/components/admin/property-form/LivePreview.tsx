import { ImageIcon, Home, CheckCircle } from "lucide-react";
import type { PropertyFormData } from "@/lib/propertyUtils";

interface LivePreviewProps {
  formData: PropertyFormData;
}

export default function LivePreview({ formData }: LivePreviewProps) {
  const visibleFeatures = formData.features.filter(Boolean);

  return (
    <div className="w-full xl:w-96 shrink-0">
      <div className="sticky top-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Live Preview</p>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="relative h-44 bg-gray-200">
            {formData.image_url ? (
              <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon size={32} />
              </div>
            )}
            {formData.show_on_home && (
              <div className="absolute top-2 left-2 bg-amber-500 text-white p-1.5 rounded-full shadow">
                <Home size={12} />
              </div>
            )}
            <div className="absolute top-2 right-2">
              {formData.status === "available" && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium">Available</span>
              )}
              {formData.status === "limited" && (
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-medium">Limited</span>
              )}
              {formData.status === "sold" && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium">Sold Out</span>
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-gray-800 text-sm truncate flex-1">
                {formData.name || "Property Name"}
              </h3>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold ml-2">
                {formData.display_type}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{formData.location || "Location"}</p>
            {formData.property_type === "individual" && (
              <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold mb-2">
                Individual Land
              </span>
            )}
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-bold text-sm">{formData.price || "Price"}</span>
              <span className="text-gray-400 text-[10px]">{formData.size || "Size"}</span>
            </div>
            {visibleFeatures.length > 0 && (
              <ul className="mt-3 space-y-1 border-t pt-3">
                {visibleFeatures.slice(0, 3).map((f, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-green-600 shrink-0" /> {f}
                  </li>
                ))}
                {visibleFeatures.length > 3 && (
                  <li className="text-xs text-gray-400">+{visibleFeatures.length - 3} more</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-2">
          <p><strong>Gallery:</strong> {formData.gallery_urls.length} item(s)</p>
          <p><strong>Brochure:</strong> {formData.brochure_url ? "Uploaded" : "Not uploaded"}</p>
          <p><strong>Home page:</strong> {formData.show_on_home ? `Yes (order: ${formData.sort_order})` : "Hidden"}</p>
        </div>
      </div>
    </div>
  );
}
