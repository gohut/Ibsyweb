"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrashIcon } from "@/components/ui/Icons";
import type { Database } from "@/types/supabase";

type SliderImage = Database["public"]["Tables"]["slider_images"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function AdminSliderPage() {
  const { showToast } = useAppState();
  const [slides, setSlides] = useState<SliderImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sliderRes, productsRes] = await Promise.all([
          fetch("/api/slider"),
          fetch("/api/products"),
        ]);

        if (!sliderRes.ok) throw new Error("Failed to fetch slider");
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        setSlides(await sliderRes.json());
        setProducts(await productsRes.json());
      } catch {
        showToast("Error loading slider data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleDelete = async (id: string, index: number) => {
    if (id.startsWith("new-")) {
      setSlides((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      const res = await fetch(`/api/slider?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSlides((prev) => prev.filter((s) => s.id !== id));
      showToast("Slide deleted");
    } catch {
      showToast("Error deleting slide", "error");
    }
  };

  const handleAddSlide = async () => {
    try {
      const res = await fetch("/api/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: null,
          title: "New slide",
          subtitle: "Edit this slide.",
          product_slug: products[0]?.slug ?? null,
          sort_order: slides.length,
        }),
      });

      if (!res.ok) throw new Error("Failed to create slide");
      const created = await res.json();
      setSlides((prev) => [...prev, created]);
      showToast("Slide added");
    } catch {
      showToast("Error adding slide", "error");
    }
  };

  const handleSaveSlider = async () => {
    setSaving(true);
    try {
      const results = await Promise.all(
        slides.map((slide, index) =>
          fetch("/api/slider", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...slide, sort_order: index }),
          }),
        ),
      );

      if (results.some((r) => !r.ok)) throw new Error("Some slides failed to save");
      showToast("Slider saved successfully.");
    } catch {
      showToast("Error saving slider", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = (index: number, patch: Partial<SliderImage>) => {
    setSlides((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading slider...</div>
    );
  }

  return (
    <div className="stack">
      <SectionHeading title="Slider" eyebrow="Homepage banners" />

      <Card style={{ padding: "1rem" }}>
        <p className="muted" style={{ fontSize: "0.82rem", marginBottom: "1rem" }}>
          Upload banner images to <strong>Cloudflare R2</strong> (public bucket),
          then paste the public URLs below. Changes are saved when you click{" "}
          <strong>Save Slider</strong>.
        </p>

        <div className="stack" style={{ gap: "1.25rem" }}>
          {slides.map((slide, index) => (
            <Card
              key={slide.id}
              style={{
                padding: "1rem",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>

                {/* ── Image preview ── */}
                <div
                  style={{
                    width: 160,
                    height: 100,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "var(--color-bg-tertiary)",
                    border: "1px solid var(--color-border)",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {slide.image_url ? (
                    <Image
                      src={slide.image_url}
                      alt={slide.title ?? "Slide"}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-text-muted)",
                        fontSize: "0.75rem",
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

                {/* ── Fields ── */}
                <div className="stack" style={{ flex: 1, gap: "0.6rem", minWidth: 220 }}>

                  {/* Image URL */}
                  <Input
                    label="Image URL (Cloudflare R2 public URL)"
                    value={slide.image_url ?? ""}
                    onChange={(e) => updateSlide(index, { image_url: e.target.value || undefined })}
                    placeholder="https://pub-xxxx.r2.dev/banner.jpg"
                  />

                  <div className="two-column">
                    {/* Title */}
                    <Input
                      label="Title"
                      value={slide.title ?? ""}
                      onChange={(e) => updateSlide(index, { title: e.target.value })}
                      placeholder="Banner headline"
                    />

                    {/* Subtitle */}
                    <Input
                      label="Subtitle"
                      value={slide.subtitle ?? ""}
                      onChange={(e) => updateSlide(index, { subtitle: e.target.value })}
                      placeholder="Supporting text"
                    />
                  </div>

                  {/* Product link */}
                  <label className="field">
                    <span>Link to Product</span>
                    <select
                      className="royal-input"
                      value={slide.product_slug ?? ""}
                      onChange={(e) =>
                        updateSlide(index, {
                          product_slug: e.target.value || null,
                        })
                      }
                    >
                      <option value="">No link</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* ── Delete ── */}
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Delete slide"
                  onClick={() => handleDelete(slide.id, index)}
                  style={{ flexShrink: 0 }}
                >
                  <TrashIcon />
                </button>
              </div>
            </Card>
          ))}

          {slides.length === 0 && (
            <p className="muted" style={{ textAlign: "center", padding: "2rem" }}>
              No slides yet. Click "Add Slide" to create one.
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
            marginTop: "1.25rem",
          }}
        >
          <Button variant="ghost" onClick={handleAddSlide} disabled={saving}>
            Add Slide
          </Button>
          <Button onClick={handleSaveSlider} disabled={saving}>
            {saving ? "Saving..." : "Save Slider"}
          </Button>
        </div>
      </Card>
    </div>
  );
}