import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaSlider } from "@/components/product/MediaSlider";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductPricePanel } from "@/components/product/ProductPricePanel";
import { RatingStars } from "@/components/product/RatingStars";
import { ReviewList } from "@/components/product/ReviewList";
import { ProductSecondarySection } from "@/components/product/ProductSecondarySection";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug, getRelatedProducts } from "@/lib/mock-data";
import { DownloadIcon, HeartIcon } from "@/components/ui/Icons";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const mediaItems = [
    ...product.images.map((image, index) => ({
      kind: "image" as const,
      src: image,
      label: `${product.name} image ${index + 1}`,
    })),
    ...product.youtubeUrls.map((url, index) => ({
      kind: "video" as const,
      src: url,
      label: `${product.name} video ${index + 1}`,
    })),
  ];

  const relatedProducts = getRelatedProducts(product.id);

  return (
    <StorefrontShell navbarVariant="product">
      <div className="page-container">
        <div className="page-section product-page-layout">
          <MediaSlider items={mediaItems} />

          <div className="stack">
            <div>
              <p className="eyebrow" style={{ fontSize: "10px" }}>{product.category}</p>
              <h1 className="display-heading" style={{ fontSize: "14px" }}>
                {product.name}
              </h1>
              <p className="muted" style={{ marginTop: "0.55rem" , fontSize:"14px"}}>
                {product.shortBlurb}
              </p>
            </div>



            <div style={{ display: "flex", gap: "6.95rem", flexWrap: "wrap" }}>
            <div className="rating-row">
              <RatingStars rating={product.avgRating} />
              <Link href="#reviews" className="subtle-link">
                {product.avgRating}({product.reviewCount})
              </Link>
            </div>
            <div style={{display:"flex", gap: "5px", justifyContent:"center", alignItems:"center"}}>
                <DownloadIcon width="14" height="14" />
                {product.downloads} Downloads
             </div>
            </div>

            <ProductPricePanel product={product} />

            <ProductDetailActions product={product} />
          </div>
        </div>

        <section className="page-section section-divider">
          <ProductSecondarySection
            descriptionHtml={product.descriptionHtml}
            relatedProducts={relatedProducts}
          />
        </section>

        <section id="reviews" className="page-section section-divider">
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
