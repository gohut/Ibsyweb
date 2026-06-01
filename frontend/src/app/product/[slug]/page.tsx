import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaSlider } from "@/components/product/MediaSlider";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductPricePanel } from "@/components/product/ProductPricePanel";
import { ReviewList } from "@/components/product/ReviewList";
import { ProductSecondarySection } from "@/components/product/ProductSecondarySection";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export const runtime = "nodejs";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

type DbClient = {
  from(table: "products"): {
    select(cols: string): {
      eq(col: string, val: string): {
        single(): Promise<{ data: ProductRow | null; error: { message: string } | null }>;
        neq(col: string, val: string): {
          limit(n: number): Promise<{ data: ProductRow[] | null; error: { message: string } | null }>;
        };
      };
    };
  };
  from(table: "reviews"): {
    select(cols: string): {
      eq(col: string, val: string): {
        order(col: string, opts: { ascending: boolean }): Promise<{ data: ReviewRow[] | null; error: { message: string } | null }>;
      };
    };
  };
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createSupabaseServerClient() as unknown as DbClient;

  const { data: dbProduct, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !dbProduct) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", dbProduct.id)
    .order("created_at", { ascending: false });

  const { data: dbRelatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .neq("id", dbProduct.id)
    .limit(4);

  const images: string[] = (Array.isArray(dbProduct.images) ? dbProduct.images as string[] : []).filter(Boolean);
  const youtubeUrls: string[] = (Array.isArray(dbProduct.youtube_urls) ? dbProduct.youtube_urls as string[] : []).filter(Boolean);

  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    category: dbProduct.category,
    shortBlurb: dbProduct.short_blurb,
    descriptionHtml: dbProduct.description_html,
    images,
    youtubeUrls,
    originalPriceInr: dbProduct.original_price_inr,
    priceInr: dbProduct.price_inr,
    originalPriceUsd: dbProduct.original_price_usd,
    priceUsd: dbProduct.price_usd,
    likes: dbProduct.likes,
    downloads: dbProduct.downloads,
    avgRating: dbProduct.avg_rating,
    reviewCount: dbProduct.review_count,
    status: dbProduct.status,
    reviews: (reviews || []).map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      date: r.reviewed_at,
      text: r.review_text,
    })),
  };

  const relatedProducts = (dbRelatedProducts || []).map((p) => {
    const pImages = Array.isArray(p.images) ? p.images as string[] : [];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      shortBlurb: p.short_blurb,
      descriptionHtml: p.description_html,
      images: pImages.filter(Boolean),
      youtubeUrls: Array.isArray(p.youtube_urls) ? p.youtube_urls as string[] : [],
      originalPriceInr: p.original_price_inr,
      priceInr: p.price_inr,
      originalPriceUsd: p.original_price_usd,
      priceUsd: p.price_usd,
      likes: p.likes,
      downloads: p.downloads,
      avgRating: p.avg_rating,
      reviewCount: p.review_count,
      status: p.status,
    };
  });

  const mediaItems = [
    ...images.map((image, index) => ({
      kind: "image" as const,
      src: image,
      label: `${product.name} image ${index + 1}`,
    })),
    ...youtubeUrls.map((url, index) => ({
      kind: "video" as const,
      src: url,
      label: `${product.name} video ${index + 1}`,
    })),
  ];

  return (
    <StorefrontShell navbarVariant="product">
      <div className="page-container product-page-container">
        <div className="page-section product-page-layout">
          <MediaSlider items={mediaItems} />

          <div className="stack product-info-stack">
            <div>
              <p className="eyebrow" style={{ fontSize: "10px" }}>{product.category}</p>
              <h1 className="display-heading" style={{ fontSize: "14px" }}>
                {product.name}
              </h1>
              <p className="muted" style={{ marginTop: "0.55rem", fontSize: "14px" }}>
                {product.shortBlurb}
              </p>
            </div>

            <ProductPricePanel product={product} />

            {/* Downloads + rating row now rendered inside ProductDetailActions, below the buttons */}
            <ProductDetailActions product={product} />
          </div>
        </div>

        <section className="page-section section-divider" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
          <ProductSecondarySection
            descriptionHtml={product.descriptionHtml}
            relatedProducts={relatedProducts}
          />
        </section>

        <section id="reviews" className="page-section section-divider" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Social proof</p>
              <h2 className="gold-underline">Reviews</h2>
            </div>
          </div>
          <ReviewList
            reviews={product.reviews}
            average={product.avgRating}
            count={product.reviewCount}
          />
        </section>
      </div>
    </StorefrontShell>
  );
}