import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export const runtime = "nodejs";

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as ProductUpdate;

  // createClient without the Database generic to avoid the `never` inference
  // bug in some versions of @supabase/supabase-js with interface-based schemas.
  const supabase = createSupabaseServerClient() as unknown as {
    from: (table: string) => {
      update: (values: ProductUpdate) => {
        eq: (col: string, val: string) => {
          select: () => {
            single: () => Promise<{
              data: ProductRow | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  };

  const { data, error } = await supabase
    .from("products")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}