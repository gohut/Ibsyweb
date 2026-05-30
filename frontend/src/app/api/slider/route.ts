import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export const runtime = "nodejs";

type SliderInsert = Database["public"]["Tables"]["slider_images"]["Insert"];
type SliderUpdate = Database["public"]["Tables"]["slider_images"]["Update"];
type SliderRow = Database["public"]["Tables"]["slider_images"]["Row"];

type SliderClient = {
  from: (table: string) => {
    insert: (values: SliderInsert[]) => {
      select: () => {
        single: () => Promise<{
          data: SliderRow | null;
          error: { message: string } | null;
        }>;
      };
    };
    update: (values: SliderUpdate) => {
      eq: (col: string, val: string) => {
        select: () => {
          single: () => Promise<{
            data: SliderRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
    select: (cols?: string) => {
      order: (col: string, opts: { ascending: boolean }) => Promise<{
        data: SliderRow[] | null;
        error: { message: string } | null;
      }>;
    };
    delete: () => {
      eq: (col: string, val: string) => Promise<{
        error: { message: string } | null;
      }>;
    };
  };
};

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("slider_images")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[slider GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createSupabaseServerClient() as unknown as SliderClient;

  const { data, error } = await supabase
    .from("slider_images")
    .insert([
      {
        image_url: body.image_url || null,
        title: body.title ?? null,
        subtitle: body.subtitle ?? null,
        product_slug: body.product_slug ?? null,
        sort_order: body.sort_order ?? 0,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[slider POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient() as unknown as SliderClient;

  const { data, error } = await supabase
    .from("slider_images")
    .update({
      image_url: body.image_url || null,
      title: body.title ?? null,
      subtitle: body.subtitle ?? null,
      product_slug: body.product_slug ?? null,
      sort_order: body.sort_order ?? 0,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("[slider PUT]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("slider_images")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[slider DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}