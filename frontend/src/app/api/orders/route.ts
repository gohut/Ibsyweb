import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createSupabaseServerClient() as ReturnType<typeof createSupabaseServerClient> & {
    from: (table: string) => any;
  };

  const { data, error } = await (supabase as any)
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const body = (await request.json()) as Database["public"]["Tables"]["orders"]["Insert"];

  const { data, error } = await (supabase as any)
    .from("orders")
    .insert([body])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}