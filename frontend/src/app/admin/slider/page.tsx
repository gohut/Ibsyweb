"use client";

import Image from "next/image";
import { useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrashIcon } from "@/components/ui/Icons";
import { products } from "@/lib/mock-data";

export default function AdminSliderPage() {
  const { settings, setSettings } = useSettings();
  const { showToast } = useAppState();
  const [slides, setSlides] = useState(settings.slider);

  return (
    <div className="stack">
      <SectionHeading title="Slider" eyebrow="Homepage banners" />
      <Card style={{ padding: "1rem" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide, index) => (
                <tr key={slide.id}>
                  <td>
                    <div className="slider-image-cell">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title ?? "Slide image"}
                        width={120}
                        height={72}
                        style={{ width: 120, height: 72, borderRadius: 10, objectFit: "cover" }}
                        unoptimized
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result;
                            if (typeof result === "string") {
                              setSlides((current) =>
                                current.map((item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, imageUrl: result }
                                    : item,
                                ),
                              );
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <select
                      className="royal-input"
                      value={slide.productSlug ?? ""}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, productSlug: event.target.value }
                              : item,
                          ),
                        )
                      }
                    >
                      <option value="">No link</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.slug}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Input
                      value={slide.title ?? ""}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, title: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  </td>
                  <td>
                    <Input
                      value={slide.subtitle ?? ""}
                      onChange={(event) =>
                        setSlides((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, subtitle: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Delete slide"
                      onClick={() =>
                        setSlides((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="slider-admin-actions">
          <Button
            variant="ghost"
            onClick={() =>
              setSlides((current) => [
                ...current,
                {
                  id: `slide-${current.length + 1}`,
                  imageUrl: settings.website.logoUrl,
                  title: "New slide",
                  subtitle: "Add a product link and image.",
                  productSlug: products[0]?.slug,
                },
              ])
            }
          >
            Add
          </Button>
          <Button
            onClick={async () => {
              const nextSettings = {
                ...settings,
                slider: slides,
              };
              const response = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(nextSettings),
              });
              const savedSettings = (await response.json()) as typeof nextSettings;
              setSettings(savedSettings);
              showToast("Slider settings saved.");
            }}
          >
            Save Slider
          </Button>
        </div>
      </Card>
    </div>
  );
}
