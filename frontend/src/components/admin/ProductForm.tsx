"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { type Product } from "@/lib/mock-data";

type ProductFormProps = {
  product?: Product;
  title: string;
};

export function ProductForm({ product, title }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useAppState();

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [shortBlurb, setShortBlurb] = useState(product?.shortBlurb ?? "");

  const [status, setStatus] = useState<"active" | "hidden">(
    product?.status ?? "active",
  );

  const [originalPriceInr, setOriginalPriceInr] = useState(
    String(product?.originalPriceInr ?? ""),
  );
  const [currentPriceInr, setCurrentPriceInr] = useState(
    String(product?.priceInr ?? ""),
  );
  const [originalPriceUsd, setOriginalPriceUsd] = useState(
    String(product?.originalPriceUsd ?? ""),
  );
  const [currentPriceUsd, setCurrentPriceUsd] = useState(
    String(product?.priceUsd ?? ""),
  );

  const [likes, setLikes] = useState(String(product?.likes ?? ""));
  const [downloads, setDownloads] = useState(String(product?.downloads ?? ""));
  const [avgRating, setAvgRating] = useState(String(product?.avgRating ?? ""));
  const [reviewCount, setReviewCount] = useState(String(product?.reviewCount ?? ""));
  const [youtubeUrls, setYoutubeUrls] = useState(
    product?.youtubeUrls?.join(", ") ?? "",
  );

  const [descriptionHtml, setDescriptionHtml] = useState(
    product?.descriptionHtml ??
      "<p>Start writing your premium product story here.</p>",
  );
  const [productImages, setProductImages] = useState<string[]>(
    product?.images ?? [],
  );

  // ── ZIP: just a URL/key pasted from Cloudflare R2 ───────────────────
  const [zipFileKey, setZipFileKey] = useState(
    product?.zip_file_path ?? "",
  );

  const [submitting, setSubmitting] = useState(false);

  const inrDiscount =
    Number(originalPriceInr) > Number(currentPriceInr) &&
    Number(originalPriceInr) > 0
      ? Math.round(
          ((Number(originalPriceInr) - Number(currentPriceInr)) /
            Number(originalPriceInr)) *
            100,
        )
      : 0;

  const usdDiscount =
    Number(originalPriceUsd) > Number(currentPriceUsd) &&
    Number(originalPriceUsd) > 0
      ? Math.round(
          ((Number(originalPriceUsd) - Number(currentPriceUsd)) /
            Number(originalPriceUsd)) *
            100,
        )
      : 0;

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Product name is required.", "error");
      return;
    }
    if (!slug.trim()) {
      showToast("Slug is required.", "error");
      return;
    }

    setSubmitting(true);

    const payload = {
      name,
      slug,
      category,
      short_blurb: shortBlurb,
      description_html: descriptionHtml,
      images: productImages,
      youtube_urls: youtubeUrls
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
      original_price_inr: Number(originalPriceInr) || 0,
      price_inr: Number(currentPriceInr) || 0,
      original_price_usd: Number(originalPriceUsd) || 0,
      price_usd: Number(currentPriceUsd) || 0,
      status,
      likes: Number(likes) || 0,
      downloads: Number(downloads) || 0,
      avg_rating: Number(avgRating) || 0,
      review_count: Number(reviewCount) || 0,
      zip_file_path: zipFileKey.trim() || null,
    };

    try {
      const isEdit = Boolean(product?.id);
      const url = isEdit ? `/api/products/${product?.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save product");
      }

      showToast("Product saved successfully.");
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving product.";
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stack">
      <div>
        <p className="eyebrow">Product editor</p>
        <h2 className="display-heading" style={{ fontSize: "2rem" }}>
          {title}
        </h2>
      </div>

      <Card style={{ padding: "1rem" }}>
        <div className="form-grid">

          {/* ── Name + Slug ── */}
          <div className="two-column">
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Auto-generate slug if not editing
                if (!product?.id) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, ""),
                  );
                }
              }}
              placeholder="Product name"
            />
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="product-slug"
              hint="Used in the product URL. Auto-generated from name."
            />
          </div>

          {/* ── Category + Status ── */}
          <div className="two-column">
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Templates, UI Kits, Scripts"
            />
            <label className="field">
              <span>Status</span>
              <div
                className="surface-card"
                style={{ padding: "0.35rem", display: "flex", gap: "0.5rem" }}
              >
                {(["active", "hidden"] as const).map((item) => (
                  <Button
                    key={item}
                    variant={status === item ? "primary" : "ghost"}
                    onClick={() => setStatus(item)}
                  >
                    {item === "active" ? "Active" : "Hidden"}
                  </Button>
                ))}
              </div>
            </label>
          </div>

          {/* ── Short Blurb ── */}
          <Input
            label="Short Blurb"
            value={shortBlurb}
            onChange={(e) => setShortBlurb(e.target.value)}
            placeholder="A one-line description shown on product cards"
          />

          {/* ── Pricing ── */}
          <div className="two-column">
            <div className="stack" style={{ gap: "0.75rem" }}>
              <Input
                label="Original Price (INR)"
                type="number"
                value={originalPriceInr}
                onChange={(e) => setOriginalPriceInr(e.target.value)}
                placeholder="3999"
                hint="Shown as struck-through original price"
              />
              <Input
                label="Selling Price (INR)"
                type="number"
                value={currentPriceInr}
                onChange={(e) => setCurrentPriceInr(e.target.value)}
                placeholder="3499"
              />
              <span className="pill">INR Discount: {inrDiscount}%</span>
            </div>
            <div className="stack" style={{ gap: "0.75rem" }}>
              <Input
                label="Original Price (USD)"
                type="number"
                value={originalPriceUsd}
                onChange={(e) => setOriginalPriceUsd(e.target.value)}
                placeholder="56"
                hint="Shown as struck-through original price"
              />
              <Input
                label="Selling Price (USD)"
                type="number"
                value={currentPriceUsd}
                onChange={(e) => setCurrentPriceUsd(e.target.value)}
                placeholder="49"
              />
              <span className="pill">USD Discount: {usdDiscount}%</span>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="two-column">
            <Input
              label="Likes"
              type="number"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="0"
            />
            <Input
              label="Downloads"
              type="number"
              value={downloads}
              onChange={(e) => setDownloads(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="two-column">
            <Input
              label="Average Rating"
              type="number"
              step="0.1"
              value={avgRating}
              onChange={(e) => setAvgRating(e.target.value)}
              placeholder="4.8"
            />
            <Input
              label="Review Count"
              type="number"
              value={reviewCount}
              onChange={(e) => setReviewCount(e.target.value)}
              placeholder="128"
            />
          </div>

          {/* ── YouTube URLs ── */}
          <Input
            label="YouTube Video URLs"
            value={youtubeUrls}
            onChange={(e) => setYoutubeUrls(e.target.value)}
            placeholder="https://youtube.com/watch?v=abc, https://youtube.com/watch?v=xyz"
            hint="Add up to 3 YouTube URLs separated by commas. Shown in the product media slider."
          />

          {/* ── Product Images (Cloudflare R2 URLs) ── */}
          <ImageUploader
            title="Product Images"
            items={productImages}
            onChange={setProductImages}
          />

          {/* ── Description (Rich Text) ── */}
          <div className="field">
            <span>Description</span>
            <RichTextEditor
              initialValue={descriptionHtml}
              onChange={setDescriptionHtml}
            />
          </div>

{/* ── ZIP File (Cloudflare R2) ── */}
          <Card style={{ padding: "1rem" }}>
            <div className="section-heading" style={{ marginBottom: "0.85rem" }}>
              <h3 className="gold-underline" style={{ fontSize: "1.2rem" }}>
                ZIP File
              </h3>
            </div>
            <p className="muted" style={{ fontSize: "0.82rem", marginBottom: "0.75rem" }}>
              Upload your ZIP to <strong>Cloudflare R2</strong>, then paste either:
              <br />
              • The <strong>full public URL</strong> — e.g.{" "}
              <code>https://pub-xxx.r2.dev/my-product.zip</code>
              <br />
              • Or just the <strong>object key</strong> — e.g.{" "}
              <code>my-product-v1.zip</code> (requires{" "}
              <code>NEXT_PUBLIC_R2_BASE_URL</code> in .env.local)
            </p>
            <Input
              label="R2 URL or Object Key"
              value={zipFileKey}
              onChange={(e) => setZipFileKey(e.target.value)}
              placeholder="https://pub-xxx.r2.dev/my-product.zip"
              hint="Paste the full R2 public URL for simplicity."
            />
            {zipFileKey && (
              <p className="muted" style={{ fontSize: "0.78rem", marginTop: "0.4rem" }}>
                ✓ Saved: <strong>{zipFileKey}</strong>
              </p>
            )}
          </Card>

          {/* ── Actions ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="ghost"
              disabled={submitting}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button disabled={submitting} onClick={handleSave}>
              {submitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}