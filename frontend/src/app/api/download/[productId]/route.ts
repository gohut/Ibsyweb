import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

// Your Cloudflare R2 public bucket base URL.
// Set this in your .env.local file:
//   NEXT_PUBLIC_R2_BASE_URL=https://pub-xxxxxxxxxxxx.r2.dev
// (found in your R2 bucket → Settings → Public URL in Cloudflare dashboard)
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL ?? "";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const supabase = createSupabaseServerClient();

  // ── 1. Fetch product and its zip_file_path ────────────────────────────
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, zip_file_path")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    console.error("[download] product not found:", productId);
    return new NextResponse("Product not found", { status: 404 });
  }

  const zipValue = product.zip_file_path?.trim();

  if (!zipValue) {
    console.error("[download] zip_file_path is empty for product:", productId);
    return new NextResponse("No download file available for this product", { status: 404 });
  }

  // ── 2. Build the download URL ─────────────────────────────────────────
  // Handles two cases:
  //   a) Admin pasted a full URL  → use it directly
  //      e.g. "https://pub-xxx.r2.dev/my-product.zip"
  //   b) Admin pasted just the object key → prepend the R2 base URL
  //      e.g. "my-product-v1.zip"
  let downloadUrl: string;

  if (zipValue.startsWith("http://") || zipValue.startsWith("https://")) {
    // Already a full URL — use as-is
    downloadUrl = zipValue;
  } else {
    // Object key only — build the full R2 public URL
    if (!R2_BASE_URL) {
      console.error("[download] NEXT_PUBLIC_R2_BASE_URL is not set in .env.local");
      return new NextResponse(
        "Server misconfiguration: R2 base URL not set",
        { status: 500 },
      );
    }
    downloadUrl = `${R2_BASE_URL.replace(/\/$/, "")}/${zipValue}`;
  }

  // ── 3. Redirect the user to the file ─────────────────────────────────
  return NextResponse.redirect(downloadUrl);
}