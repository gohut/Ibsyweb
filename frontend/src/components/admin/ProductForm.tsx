"use client";

import { useState } from "react";
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
  const { showToast } = useAppState();
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
  const [descriptionHtml, setDescriptionHtml] = useState(
    product?.descriptionHtml ?? "<p>Start writing your premium product story here.</p>",
  );
  const [productImages, setProductImages] = useState(product?.images ?? []);
  const [zipFileName, setZipFileName] = useState("");
  const inrDiscount =
    Number(originalPriceInr) > Number(currentPriceInr) && Number(originalPriceInr) > 0
      ? Math.round(
          ((Number(originalPriceInr) - Number(currentPriceInr)) / Number(originalPriceInr)) *
            100,
        )
      : 0;
  const usdDiscount =
    Number(originalPriceUsd) > Number(currentPriceUsd) && Number(originalPriceUsd) > 0
      ? Math.round(
          ((Number(originalPriceUsd) - Number(currentPriceUsd)) / Number(originalPriceUsd)) *
            100,
        )
      : 0;

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
          <div className="two-column">
            <Input label="Product Name" defaultValue={product?.name} placeholder="Product name" />
            <Input label="Slug" defaultValue={product?.slug} placeholder="product-slug" />
          </div>

          <div className="two-column">
            <Input
              label="Category"
              defaultValue={product?.category}
              placeholder="Category"
            />
            <label className="field">
              <span>Status</span>
              <div className="surface-card" style={{ padding: "0.35rem", display: "flex", gap: "0.5rem" }}>
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

          <div className="two-column">
            <div className="stack" style={{ gap: "0.75rem" }}>
              <Input
                label="Actual Price (INR)"
                type="number"
                value={originalPriceInr}
                onChange={(event) => setOriginalPriceInr(event.target.value)}
                placeholder="3999"
              />
              <Input
                label="Current Price (INR)"
                type="number"
                value={currentPriceInr}
                onChange={(event) => setCurrentPriceInr(event.target.value)}
                placeholder="3499"
              />
              <span className="pill">Discount: {inrDiscount}%</span>
            </div>
            <div className="stack" style={{ gap: "0.75rem" }}>
              <Input
                label="Actual Price (USD)"
                type="number"
                value={originalPriceUsd}
                onChange={(event) => setOriginalPriceUsd(event.target.value)}
                placeholder="56"
              />
              <Input
                label="Current Price (USD)"
                type="number"
                value={currentPriceUsd}
                onChange={(event) => setCurrentPriceUsd(event.target.value)}
                placeholder="49"
              />
              <span className="pill">Discount: {usdDiscount}%</span>
            </div>
          </div>

          <div className="two-column">
            <Input
              label="Likes"
              type="number"
              defaultValue={product?.likes}
              placeholder="0"
            />
            <Input
              label="Downloads"
              type="number"
              defaultValue={product?.downloads}
              placeholder="0"
            />
          </div>

          <div className="two-column">
            <Input
              label="Average Rating"
              type="number"
              step="0.1"
              defaultValue={product?.avgRating}
              placeholder="4.8"
            />
            <Input
              label="Review Count"
              type="number"
              defaultValue={product?.reviewCount}
              placeholder="128"
            />
          </div>

          <Input
            label="YouTube URLs"
            defaultValue={product?.youtubeUrls.join(", ")}
            placeholder="https://youtube.com/..."
            hint="Add up to 3 URLs separated by commas."
          />

          <ImageUploader
            title="Product Images"
            items={productImages}
            onChange={setProductImages}
          />

          <div className="field">
            <span>Description</span>
            <RichTextEditor
              initialValue={descriptionHtml}
              onChange={setDescriptionHtml}
            />
          </div>

          <Card style={{ padding: "1rem" }}>
            <div className="section-heading" style={{ marginBottom: "0.85rem" }}>
              <h3 className="gold-underline" style={{ fontSize: "1.2rem" }}>
                ZIP File Upload
              </h3>
            </div>
            <div className="upload-slot" style={{ padding: "1rem" }}>
              <label className="stack" style={{ justifyItems: "center", gap: "0.45rem", width: "100%" }}>
                <span className="muted">
                  {zipFileName || "Choose a ZIP file for secure delivery"}
                </span>
                <input
                  type="file"
                  accept=".zip"
                  onChange={(event) =>
                    setZipFileName(event.target.files?.[0]?.name ?? "")
                  }
                />
              </label>
            </div>
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button
              variant="ghost"
              onClick={() => showToast("Draft saved in local preview mode.")}
            >
              Save Draft
            </Button>
            <Button
              onClick={() =>
                showToast(
                  `Product ready with INR ${currentPriceInr || 0} (${inrDiscount}% off) and USD ${currentPriceUsd || 0} (${usdDiscount}% off).`,
                )
              }
            >
              Save Product
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
