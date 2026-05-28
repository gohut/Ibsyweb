import type { Product } from "@/lib/mock-data";
import { ProductCard } from "@/components/product/ProductCard";

type ProductGridProps = {
  products: Product[];
  className?: string;
};

export function ProductGrid({ products, className = "" }: ProductGridProps) {
  return (
    <div className={`grid-auto products ${className}`.trim()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
