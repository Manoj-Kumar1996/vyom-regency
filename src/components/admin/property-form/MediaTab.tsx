import { useState } from "react";
import { Upload, X, Youtube, PlayCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { isGalleryVideoUrl, extractYouTubeId, type PropertyFormData } from "@/lib/propertyUtils";

interface MediaTabProps {
  formData: PropertyFormData;
  updateField: <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => void;
  uploadingBrochure: boolean;
  uploadingGallery: boolean;
  galleryVideoUrl: string;
  onGalleryVideoUrlChange: (value: string) => void;
  onBrochureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddGalleryVideo: () => void;
}

export default function MediaTab({
  formData,
  updateField,
  uploadingBrochure,
  uploadingGallery,
  galleryVideoUrl,
  onGalleryVideoUrlChange,
  onBrochureUpload,
  onGalleryUpload,
  onAddGalleryVideo,
}: MediaTabProps) {
  const [videoInput, setVideoInput] = useState("");

  const handleSetVideo = () => {
    const videoId = extractYouTubeId(videoInput.trim());
    if (!videoId) {
      toast.error("Enter a valid YouTube link");
      return;
    }
    updateField("video_url", `https://www.youtube.com/embed/${videoId}`);
    setVideoInput("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Video</label>
        <p className="text-xs text-gray-400 mb-3">One featured YouTube video shown prominently on the property page</p>
        {formData.video_url ? (
          <div className="mb-3 relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border">
            <iframe src={formData.video_url} title="Project video preview" className="w-full h-full" allowFullScreen />
            <button
              type="button"
              onClick={() => updateField("video_url", "")}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Youtube className="text-red-500 shrink-0" size={18} />
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="Paste YouTube link for the project video"
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="button"
              onClick={handleSetVideo}
              className="shrink-0 flex items-center gap-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition"
            >
              <Plus size={14} /> Set
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Brochure (PDF)</label>
        <p className="text-xs text-gray-400 mb-3">Visitors can download after filling the lead form</p>
        <div className="flex gap-3 items-center flex-wrap">
          {formData.brochure_url && (
            <a
              href={formData.brochure_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 underline shrink-0 bg-green-50 px-3 py-2 rounded-lg"
            >
              View current PDF
            </a>
          )}
          <label className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-2.5 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition">
            <input type="file" accept="application/pdf" onChange={onBrochureUpload} className="hidden" />
            <Upload className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600 font-medium">
              {uploadingBrochure ? "Uploading..." : formData.brochure_url ? "Replace PDF" : "Upload brochure PDF"}
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Images & Videos</label>
        <p className="text-xs text-gray-400 mb-3">Additional photos and YouTube videos shown on the property detail page</p>
        {formData.gallery_urls.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {formData.gallery_urls.map((url) => (
              <div key={url} className="relative group">
                {isGalleryVideoUrl(url) ? (
                  <div className="w-full h-20 rounded-lg border bg-gray-900 flex items-center justify-center">
                    <PlayCircle className="text-white" size={22} />
                  </div>
                ) : (
                  <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border" />
                )}
                <button
                  type="button"
                  onClick={() => updateField("gallery_urls", formData.gallery_urls.filter((u) => u !== url))}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="block bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition">
          <input type="file" accept="image/*" multiple onChange={onGalleryUpload} className="hidden" />
          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-sm text-gray-600 font-medium">{uploadingGallery ? "Uploading..." : "Add gallery photos"}</p>
          <p className="text-xs text-gray-400 mt-1">Select multiple images at once</p>
        </label>

        <div className="flex gap-2 items-center mt-3">
          <Youtube className="text-red-500 shrink-0" size={18} />
          <input
            type="text"
            value={galleryVideoUrl}
            onChange={(e) => onGalleryVideoUrlChange(e.target.value)}
            placeholder="Paste YouTube link to add a video"
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            type="button"
            onClick={onAddGalleryVideo}
            className="shrink-0 flex items-center gap-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
