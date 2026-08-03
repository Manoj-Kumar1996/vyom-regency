import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseServer";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "lead",
    accepts: ["POST"],
    storesIn: "leads",
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const lead = {
      name: String(data.name || "").trim(),
      phone: String(data.phone || "").trim(),
      email: data.email ? String(data.email).trim() : null,
      city: data.city ? String(data.city).trim() : null,
      project: data.project ? String(data.project).trim() : null,
      source: data.source ? String(data.source).trim() : "website",
      status: "new",
      message: data.message ? String(data.message).trim() : null,
    };

    if (!lead.name || !lead.phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const { data: savedLead, error } = await supabase
      .from("leads")
      .insert([lead])
      .select()
      .single();

    if (error) {
      console.error("Supabase lead insert error:", error);
      throw error;
    }

    return NextResponse.json(
      { message: "Lead received successfully", lead: savedLead },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    const message = error instanceof Error ? error.message : "Failed to process lead";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
