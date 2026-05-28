import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <StorefrontShell>
      <div className="page-container page-section">
        <Skeleton height={220} style={{ borderRadius: 16 }} />
        <div className="grid-auto products" style={{ marginTop: "1rem" }}>
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index} style={{ padding: "0.85rem" }}>
              <Skeleton height={180} style={{ borderRadius: 12 }} />
              <Skeleton height={18} style={{ marginTop: "0.8rem" }} />
              <Skeleton height={18} style={{ marginTop: "0.5rem", width: "72%" }} />
              <Skeleton height={42} style={{ marginTop: "1rem", borderRadius: 10 }} />
            </Card>
          ))}
        </div>
      </div>
    </StorefrontShell>
  );
}
