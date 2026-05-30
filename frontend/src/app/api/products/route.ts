import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

// GET /api/products — fetch all products
export async function GET() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[products GET]", error.code, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/products — create a new product
export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();

  const body = await request.json();

  // Strip undefined values
  const payload = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== undefined),
  );

  console.log("[products POST] creating product:", payload.name);

  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[products POST error]", error.code, error.message, error.details);
    return NextResponse.json(
      { error: error.message, details: error.details, code: error.code },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}