"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { PlusIcon } from "@/components/ui/Icons";

type ImageUploaderProps = {
  title: string;
  items: string[];
  onChange?: (items: string[]) => void;
};

export function ImageUploader({ title, items, onChange }: ImageUploaderProps) {
  const [previews, setPreviews] = useState(items);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Card style={{ padding: "1rem" }}>
      <div className="section-heading" style={{ marginBottom: "0.85rem" }}>
        <h3 className="gold-underline" style={{ fontSize: "1.2rem" }}>
          {title}
        </h3>
      </div>
      <div className="upload-grid">
        {previews.map((item) => (
          <div key={item} className="upload-slot">
            <Image
              src={item}
              alt="Uploaded preview"
              width={160}
              height={120}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
              unoptimized
            />
          </div>
        ))}
        <button
          type="button"
          className="upload-slot"
          onClick={() => inputRef.current?.click()}
        >
          <span className="stack" style={{ justifyItems: "center", gap: "0.35rem" }}>
            <PlusIcon />
            <span className="muted">Add media</span>
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (!files.length) {
              return;
            }

            const nextPreviews = files.map((file) => URL.createObjectURL(file));
            const mergedItems = [...previews, ...nextPreviews];
            setPreviews(mergedItems);
            onChange?.(mergedItems);
          }}
        />
      </div>
    </Card>
  );
}
