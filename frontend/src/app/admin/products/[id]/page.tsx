"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAppState } from "@/components/providers/AppStateProvider";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAppState();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        showToast("Error loading product", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, showToast]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading product...</div>;
  }

  if (!product) {
    return null; // notFound will handle 404
  }

  // Need to map Supabase product type back to mock Product type that ProductForm expects,
  // or ProductForm can handle Database Row. Since we updated ProductForm but didn't change its type 
  // (we still use type Product from mock-data), we should fix ProductForm to use Supabase type,
  // or we can map it here. Let's map it here to be safe and avoid touching ProductForm again.
  const mappedProduct: any = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    shortBlurb: product.short_blurb,
    descriptionHtml: product.description_html,
    images: product.images,
    youtubeUrls: product.youtube_urls,
    originalPriceInr: product.original_price_inr,
    priceInr: product.price_inr,
    originalPriceUsd: product.original_price_usd,
    priceUsd: product.price_usd,
    likes: product.likes,
    downloads: product.downloads,
    avgRating: product.avg_rating,
    reviewCount: product.review_count,
    status: product.status,
  };

  return <ProductForm title={`Edit ${product.name}`} product={mappedProduct} />;
}
