import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export const runtime = "nodejs";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];

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
  const body = await request.json();

  // Strip undefined values and cast to known type
  const payload = Object.fromEntries(
    Object.entries(body).filter(([, v]) => v !== undefined),
  ) as ProductInsert;

  console.log("[products POST] creating product:", (payload as { name?: string }).name);

  // Cast to unknown first to bypass the `never` inference bug in supabase-js
  // with interface-based Database schemas. ProductInsert and ProductRow types
  // are still explicitly enforced in the inline type below.
  const supabase = createSupabaseServerClient() as unknown as {
    from: (table: string) => {
      insert: (values: ProductInsert[]) => {
        select: () => {
          single: () => Promise<{
            data: ProductRow | null;
            error: { message: string; details: string; code: string } | null;
          }>;
        };
      };
    };
  };

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