import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { HeroSlider } from "@/components/product/HeroSlider";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createSupabaseServerClient } from "@/lib/supabase";
import { readAppSettings } from "@/lib/settings.server";

export const runtime = "nodejs";

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const settings = await readAppSettings();

  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Map snake_case DB fields → camelCase fields expected by ProductCard
  const products = (dbProducts ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category ?? "",
    shortBlurb: p.short_blurb ?? "",
    descriptionHtml: p.description_html ?? "",
    images: p.images ?? [],
    youtubeUrls: p.youtube_urls ?? [],
    originalPriceInr: p.original_price_inr ?? 0,
    priceInr: p.price_inr ?? 0,
    originalPriceUsd: p.original_price_usd ?? 0,
    priceUsd: p.price_usd ?? 0,
    likes: p.likes ?? 0,
    downloads: p.downloads ?? 0,
    avgRating: p.avg_rating ?? 0,
    reviewCount: p.review_count ?? 0,
    status: p.status ?? "active",
    zip_file_path: p.zip_file_path ?? null,
  }));

  return (
    <StorefrontShell hero={<HeroSlider slides={settings.slider} />}>
      <div className="page-container">
        <section className="page-section">
          <SectionHeading title="All Products" eyebrow="Wander Below for More" />
          <ProductGrid products={products} />
        </section>
      </div>
    </StorefrontShell>
  );
}