export interface PropertyFormData {
  name: string;
  slug: string;
  location: string;
  price: string;
  size: string;
  status: string;
  description: string;
  features: string[];
  image_url: string;
  display_type: string;
  sort_order: number;
  show_on_home: boolean;
  brochure_url: string;
  gallery_urls: string[];
  property_type: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  video_url: string;
  registry_type: string;
  possession_status: string;
  plots_left: number | null;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string;
  og_description: string;
  og_image: string;
  custom_json_ld: string;
}

export const defaultPropertyFormData: PropertyFormData = {
  name: "",
  slug: "",
  location: "",
  price: "",
  size: "",
  status: "available",
  description: "",
  features: [],
  image_url: "",
  display_type: "single",
  sort_order: 0,
  show_on_home: false,
  brochure_url: "",
  gallery_urls: [],
  property_type: "project",
  meta_title: "",
  meta_description: "",
  focus_keyword: "",
  video_url: "",
  registry_type: "",
  possession_status: "",
  plots_left: null,
  canonical_url: "",
  robots_index: true,
  robots_follow: true,
  og_title: "",
  og_description: "",
  og_image: "",
  custom_json_ld: "",
};

export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function isGalleryVideoUrl(url: string): boolean {
  return url.includes("youtube.com/embed/");
}

export function generateSEOFilename(originalName: string, propertyName: string): string {
  const timestamp = Date.now();
  const cleanPropertyName = propertyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 30);
  return `property-${cleanPropertyName}-${timestamp}.webp`;
}

export function generatePropertySlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  return `${baseSlug}-${Date.now()}`;
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function propertyFormDataFromRecord(property: Record<string, unknown>): PropertyFormData {
  return {
    name: (property.name as string) || "",
    slug: (property.slug as string) || "",
    location: (property.location as string) || "",
    price: (property.price as string) || "",
    size: (property.size as string) || "",
    status: (property.status as string) || "available",
    description: (property.description as string) || "",
    features: (property.features as string[]) || [],
    image_url: (property.image_url as string) || "",
    display_type: (property.display_type as string) || "single",
    sort_order: (property.sort_order as number) || 0,
    show_on_home: (property.show_on_home as boolean) || false,
    brochure_url: (property.brochure_url as string) || "",
    gallery_urls: (property.gallery_urls as string[]) || [],
    property_type: (property.property_type as string) || "project",
    meta_title: (property.meta_title as string) || "",
    meta_description: (property.meta_description as string) || "",
    focus_keyword: (property.focus_keyword as string) || "",
    video_url: (property.video_url as string) || "",
    registry_type: (property.registry_type as string) || "",
    possession_status: (property.possession_status as string) || "",
    plots_left: (property.plots_left as number) ?? null,
    canonical_url: (property.canonical_url as string) || "",
    robots_index: (property.robots_index as boolean) ?? true,
    robots_follow: (property.robots_follow as boolean) ?? true,
    og_title: (property.og_title as string) || "",
    og_description: (property.og_description as string) || "",
    og_image: (property.og_image as string) || "",
    custom_json_ld: (property.custom_json_ld as string) || "",
  };
}
