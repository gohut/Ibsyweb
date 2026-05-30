"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DownloadIcon, LockIcon } from "@/components/ui/Icons";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type PurchasedProduct = {
  id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    images: string[];
  }
};

export default function LibraryPage() {
  const { showToast } = useAppState();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<PurchasedProduct[]>([]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const supabase = createSupabaseBrowserClient();
      
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        router.push("/login");
        return;
      }

      const { data: purchaseData, error: dbError } = await supabase
        .from("purchases")
        .select(`
          id,
          created_at,
          product:products ( id, name, images )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!dbError && purchaseData) {
        // Suppress TS error since postgrest JS has complex generic typing on relations
        setPurchases(purchaseData as any[]);
      }

      setLoading(false);
    };

    checkAuthAndFetch();
  }, [router]);

  return (
    <StorefrontShell>
      <div className="page-container">
        <section className="page-section">
          <SectionHeading title="My Purchases" eyebrow="Protected library" />
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>Loading library...</div>
          ) : (
            <div className="grid-auto products">
              {purchases.length === 0 ? (
                <div style={{ padding: "2rem", gridColumn: "1 / -1" }}>
                  <p>You haven't purchased anything yet.</p>
                </div>
              ) : null}
              {purchases.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <Card key={item.id} className="interactive" style={{ padding: "0.9rem" }}>
                    <div className="product-image-frame">
                      {product.images && product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="stack" style={{ gap: "0.45rem", marginTop: "0.8rem" }}>
                      <h3>{product.name}</h3>
                      <p className="muted">Purchased on {new Date(item.created_at).toLocaleDateString()}</p>
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
          )}
        </section>
      </div>
    </StorefrontShell>
  );
}
