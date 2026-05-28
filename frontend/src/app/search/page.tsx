import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { SearchBar } from "@/components/layout/SearchBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/lib/mock-data";

export default function SearchPage() {
  return (
    <StorefrontShell>
      <div className="page-container">
        <section className="page-section">
          <SectionHeading title="Search Products" eyebrow="Live lookup" />
          <Card style={{ padding: "1rem", marginBottom: "1rem" }}>
            <SearchBar />
          </Card>
          <ProductGrid products={products} />
        </section>
      </div>
    </StorefrontShell>
  );
}
