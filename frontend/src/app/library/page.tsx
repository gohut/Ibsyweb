"use client";

import Image from "next/image";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DownloadIcon, LockIcon } from "@/components/ui/Icons";
import { getProductById, libraryItems } from "@/lib/mock-data";

export default function LibraryPage() {
  const { showToast } = useAppState();

  return (
    <StorefrontShell>
      <div className="page-container">
        <section className="page-section">
          <SectionHeading title="My Purchases" eyebrow="Protected library" />
          <div className="grid-auto products">
            {libraryItems.map((item) => {
              const product = getProductById(item.productId);
              if (!product) {
                return null;
              }

              return (
                <Card key={item.productId} className="interactive" style={{ padding: "0.9rem" }}>
                  <div className="product-image-frame">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                  <div className="stack" style={{ gap: "0.45rem", marginTop: "0.8rem" }}>
                    <h3>{product.name}</h3>
                    <p className="muted">Purchased on {item.purchasedAt}</p>
                    <p className="muted" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <LockIcon width="14" height="14" />
                      Signed URL delivery with 10 minute expiry
                    </p>
                    <Button
                      fullWidth
                      onClick={() =>
                        showToast("Signed download URL generated for 10 minutes.")
                      }
                    >
                      <DownloadIcon width="16" height="16" />
                      Download
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </StorefrontShell>
  );
}
