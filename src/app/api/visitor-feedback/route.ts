import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("website_feedback")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch visitor feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("website_feedback")
      .insert([
        {
          name: body.name || "Anonymous Visitor",
          email: body.email || null,
          rating: body.rating || 5,
          experience: body.experience || body.text || "",
          suggestions: body.suggestions || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to save visitor feedback" },
      { status: 500 }
    );
  }
}
