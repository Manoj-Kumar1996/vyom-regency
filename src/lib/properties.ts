import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: string;
  size: string;
  status: string;
  description: string;
  features: string[];
  image_url: string;
  created_at: string;
  display_type: string;
  sort_order: number;
  show_on_home: boolean;
  brochure_url: string | null;
  gallery_urls: string[] | null;
  property_type: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  video_url: string | null;
  registry_type: string | null;
  possession_status: string | null;
  plots_left: number | null;
  canonical_url: string | null;
  robots_index: boolean | null;
  robots_follow: boolean | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  custom_json_ld: string | null;
}

export type PropertyType = "project" | "individual";

const ALL_COLUMNS = "*";
const CARD_COLUMNS =
  "id, name, slug, location, price, size, status, image_url, display_type, sort_order, show_on_home, property_type";

export async function getAllProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(ALL_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
  return data || [];
}

export async function getPropertiesForAdminList(): Promise<Pick<Property,
  "id" | "name" | "location" | "price" | "size" | "status" | "image_url" | "display_type" | "sort_order" | "show_on_home" | "property_type"
>[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(CARD_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
  return data || [];
}

export async function getPropertiesByType(
  type: PropertyType,
  opts: { homeOnly?: boolean; order?: "sort_order" | "created_at" } = {}
): Promise<Property[]> {
  let query = supabase.from("properties").select(ALL_COLUMNS).eq("property_type", type);
  if (opts.homeOnly) query = query.eq("show_on_home", true);

  const orderCol = opts.order || "created_at";
  const { data, error } = await query.order(orderCol, { ascending: orderCol === "sort_order" });

  if (error) {
    console.error("Error fetching properties by type:", error);
    return [];
  }
  return data || [];
}

export async function getLatestProperties(limit = 4): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(ALL_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest properties:", error);
    return [];
  }
  return data || [];
}

export async function getRecentProperties(excludeId: string, limit = 4): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(ALL_COLUMNS)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent properties:", error);
    return [];
  }
  return data || [];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(ALL_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching property by slug:", error);
    return null;
  }
  return data;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(ALL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching property by id:", error);
    return null;
  }
  return data;
}

export type PropertyWritePayload = Omit<Property, "id" | "created_at" | "slug"> & { slug?: string };

export async function createProperty(payload: PropertyWritePayload) {
  return supabase.from("properties").insert([payload]).select().single();
}

export async function updateProperty(id: string, payload: Partial<PropertyWritePayload>) {
  return supabase.from("properties").update(payload).eq("id", id);
}

export async function deleteProperty(id: string) {
  return supabase.from("properties").delete().eq("id", id);
}
