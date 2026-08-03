"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, LayoutGrid, FileText, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PropertyFormData,
  defaultPropertyFormData,
  generateSEOFilename,
  generatePropertySlug,
  extractYouTubeId,
  sanitizeSlug,
} from "@/lib/propertyUtils";
import { getCurrentAdminRole, type AdminRole } from "@/lib/admin";
import { createProperty, updateProperty, type PropertyWritePayload } from "@/lib/properties";
import BasicDetailsSection from "./property-form/BasicDetailsSection";
import SeoSection from "./property-form/SeoSection";
import HomeDisplaySection from "./property-form/HomeDisplaySection";
import ContentTab from "./property-form/ContentTab";
import MediaTab from "./property-form/MediaTab";
import LivePreview from "./property-form/LivePreview";

interface PropertyFormProps {
  mode: "add" | "edit";
  propertyId?: string;
  initialData?: PropertyFormData;
}

export default function PropertyForm({ mode, propertyId, initialData }: PropertyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PropertyFormData>(initialData || defaultPropertyFormData);
  const [activeTab, setActiveTab] = useState("details");
  const [adminRole, setAdminRole] = useState<AdminRole>("editor");
  const isAdmin = adminRole === "admin";

  useEffect(() => {
    getCurrentAdminRole().then((role) => {
      setAdminRole(role);
      if (role !== "admin") setActiveTab("details");
    });
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryVideoUrl, setGalleryVideoUrl] = useState("");

  const updateField = <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData((prev) => {
      const next = [...prev.features];
      next[index] = value;
      return { ...prev, features: next };
    });
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      });
      const filePath = `properties/${generateSEOFilename(file.name, formData.name || "property")}`;
      const { error } = await supabase.storage.from("properties").upload(filePath, compressed, {
        cacheControl: "3600",
        contentType: "image/webp",
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("properties").getPublicUrl(filePath);
      updateField("image_url", publicUrl);
      toast.success("Cover image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBrochure(true);
    try {
      const cleanName = (formData.name || "property")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 30);
      const filePath = `${cleanName}-${Date.now()}.pdf`;
      const { error } = await supabase.storage.from("brochures").upload(filePath, file, {
        cacheControl: "3600",
        contentType: "application/pdf",
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("brochures").getPublicUrl(filePath);
      updateField("brochure_url", publicUrl);
      toast.success("Brochure uploaded");
    } catch {
      toast.error("Brochure upload failed");
    } finally {
      setUploadingBrochure(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp",
        });
        const filePath = `properties/gallery-${generateSEOFilename(file.name, formData.name || "property")}`;
        const { error } = await supabase.storage.from("properties").upload(filePath, compressed, {
          cacheControl: "3600",
          contentType: "image/webp",
        });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from("properties").getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }
      updateField("gallery_urls", [...formData.gallery_urls, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} gallery image(s) uploaded`);
    } catch {
      toast.error("Gallery upload failed");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleAddGalleryVideo = () => {
    const videoId = extractYouTubeId(galleryVideoUrl.trim());
    if (!videoId) {
      toast.error("Enter a valid YouTube link");
      return;
    }
    updateField("gallery_urls", [...formData.gallery_urls, `https://www.youtube.com/embed/${videoId}`]);
    setGalleryVideoUrl("");
    toast.success("Video added to gallery");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Property name is required");
      setActiveTab("details");
      return;
    }

    setSubmitting(true);
    const propertyData: PropertyWritePayload = {
      name: formData.name,
      slug: formData.slug.trim() ? sanitizeSlug(formData.slug) : generatePropertySlug(formData.name),
      location: formData.location,
      price: formData.price,
      size: formData.size,
      status: formData.status,
      description: formData.description,
      features: formData.features.filter((f) => f.trim()),
      image_url: formData.image_url,
      display_type: formData.display_type,
      sort_order: formData.sort_order,
      show_on_home: formData.show_on_home,
      brochure_url: formData.brochure_url || null,
      gallery_urls: formData.gallery_urls,
      property_type: formData.property_type,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      focus_keyword: formData.focus_keyword || null,
      video_url: formData.video_url || null,
      registry_type: formData.registry_type || null,
      possession_status: formData.possession_status || null,
      plots_left: formData.plots_left,
      canonical_url: formData.canonical_url || null,
      robots_index: formData.robots_index,
      robots_follow: formData.robots_follow,
      og_title: formData.og_title || null,
      og_description: formData.og_description || null,
      og_image: formData.og_image || null,
      custom_json_ld: formData.custom_json_ld || null,
    };

    try {
      const { error } =
        mode === "edit" && propertyId
          ? await updateProperty(propertyId, propertyData)
          : await createProperty(propertyData);
      if (error) throw error;
      toast.success(mode === "edit" ? "Property updated successfully" : "Property created successfully");
      router.push("/admin/properties");
    } catch (err: unknown) {
      console.error("Submit error:", err);
      toast.error(mode === "edit" ? "Failed to update property" : "Failed to create property");
    } finally {
      setSubmitting(false);
    }
  };

  const isUploading = uploading || uploadingBrochure || uploadingGallery;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/properties" className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {mode === "edit" ? "Edit Property" : "Add New Property"}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === "edit" ? "Update listing details, media, and display settings" : "Create a new property listing"}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || isUploading}
          className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition flex items-center gap-2 disabled:opacity-50 shadow-md"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {submitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Property"}
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0 w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {isAdmin && (
              <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-gray-100 p-1.5 rounded-xl mb-6">
                <TabsTrigger value="details" className="flex-1 min-w-[120px] gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5">
                  <LayoutGrid size={16} /> Basic Details
                </TabsTrigger>
                <TabsTrigger value="content" className="flex-1 min-w-[120px] gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5">
                  <FileText size={16} /> Content
                </TabsTrigger>
                <TabsTrigger value="media" className="flex-1 min-w-[120px] gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5">
                  <ImageIcon size={16} /> Media
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="details" className="space-y-6">
              <BasicDetailsSection
                formData={formData}
                updateField={updateField}
                uploading={uploading}
                onImageUpload={handleImageUpload}
              />
              <SeoSection formData={formData} updateField={updateField} />
              <HomeDisplaySection formData={formData} updateField={updateField} />
            </TabsContent>

            {/* Content and Media tabs are only reachable when isAdmin — see TabsList above */}
            <TabsContent value="content" className="space-y-6">
              <ContentTab
                formData={formData}
                updateField={updateField}
                onFeatureChange={handleFeatureChange}
                onAddFeature={addFeature}
                onRemoveFeature={removeFeature}
              />
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <MediaTab
                formData={formData}
                updateField={updateField}
                uploadingBrochure={uploadingBrochure}
                uploadingGallery={uploadingGallery}
                galleryVideoUrl={galleryVideoUrl}
                onGalleryVideoUrlChange={setGalleryVideoUrl}
                onBrochureUpload={handleBrochureUpload}
                onGalleryUpload={handleGalleryUpload}
                onAddGalleryVideo={handleAddGalleryVideo}
              />
            </TabsContent>
          </Tabs>
        </div>

        <LivePreview formData={formData} />
      </div>
    </form>
  );
}
