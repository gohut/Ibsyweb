"use client";

import { useState } from "react";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { useSettings } from "@/components/providers/SettingsProvider";
import { HeroSlider } from "@/components/product/HeroSlider";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/lib/mock-data";

export default function HomePage() {
  const [visibleCount, setVisibleCount] = useState(4);
  const { settings } = useSettings();

  return (
    <StorefrontShell hero={<HeroSlider slides={settings.slider} />}>
      <div className="page-container">
        <section className="page-section">
          <SectionHeading title="All Products" eyebrow="Wander Below for More" />
          <ProductGrid products={products.slice(0, visibleCount)} />
          {visibleCount < products.length ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
              <Button variant="secondary" onClick={() => setVisibleCount(products.length)}>
                Load More
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </StorefrontShell>
  );
}
