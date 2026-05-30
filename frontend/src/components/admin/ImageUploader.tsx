"use client";

import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlusIcon, TrashIcon } from "@/components/ui/Icons";

type ImageUploaderProps = {
  title: string;
  items: string[];
  onChange?: (items: string[]) => void;
};

export function ImageUploader({ title, items, onChange }: ImageUploaderProps) {
  const [urls, setUrls] = useState<string[]>(items.length > 0 ? items : [""]);

  const handleChange = (index: number, value: string) => {
    const next = urls.map((u, i) => (i === index ? value : u));
    setUrls(next);
    onChange?.(next.filter(Boolean));
  };

  const handleAdd = () => {
    const next = [...urls, ""];
    setUrls(next);
  };

  const handleRemove = (index: number) => {
    const next = urls.filter((_, i) => i !== index);
    const safe = next.length > 0 ? next : [""];
    setUrls(safe);
    onChange?.(safe.filter(Boolean));
  };

  return (
    <Card style={{ padding: "1rem" }}>
      <div className="section-heading" style={{ marginBottom: "0.85rem" }}>
        <h3 className="gold-underline" style={{ fontSize: "1.2rem" }}>
          {title}
        </h3>
        <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
          Upload images to Cloudflare R2, then paste the public URLs here.
        </p>
      </div>

      <div className="stack" style={{ gap: "0.75rem" }}>
        {urls.map((url, index) => (
          <div key={index} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            {/* Live preview thumbnail */}
            <div
              style={{
                width: 64,
                height: 48,
                borderRadius: 8,
                overflow: "hidden",
                background: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border)",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {url && (
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                  onError={() => {}} // silently fail on bad URL
                />
              )}
            </div>

            {/* URL input */}
            <input
              className="royal-input"
              style={{ flex: 1 }}
              type="url"
              value={url}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="https://your-r2-bucket.r2.dev/image.jpg"
            />

            {/* Remove button */}
            <button
              type="button"
              className="icon-button"
              aria-label="Remove image"
              onClick={() => handleRemove(index)}
            >
              <TrashIcon />
            </button>
          </div>
        ))}

        {/* Add another URL */}
        <Button variant="ghost" onClick={handleAdd} style={{ alignSelf: "flex-start" }}>
          <PlusIcon />
          Add Image URL
        </Button>
      </div>
    </Card>
  );
}