import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function GET() {
  // Fetch the stored hero image key from the site_settings table
  const { data, error } = await supabase
    .from("site_settings")
    .select("hero_image_key")
    .single();

  if (error) {
    console.error("Error fetching hero image key:", error);
    return NextResponse.json(
      { error: "Failed to load hero image" },
      { status: 500 }
    );
  }

  // If no key exists, return a default placeholder
  const key = data?.hero_image_key;
  if (!key) {
    return NextResponse.json(
      { url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80" },
      { status: 200 }
    );
  }

  // Generate the public URL for the stored object
  const { data: { publicUrl } } = supabase.storage
    .from("hero-banners")
    .getPublicUrl(key);

  return NextResponse.json({ url: publicUrl });
}