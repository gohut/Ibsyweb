import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProductDiscountPercentage, products } from "@/lib/mock-data";

export default function AdminProductsPage() {
  return (
    <div className="stack">
      <SectionHeading title="Products" eyebrow="Catalog management" actionHref="/admin/products/new" actionLabel="Add New Product" />

      <Card style={{ padding: "1rem" }}>
        <Input label="Search products" placeholder="Search by name, category, or slug" />
      </Card>

      <Card style={{ padding: "1rem" }}>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Name</th>
                <th>Price</th>
                <th>Downloads</th>
                <th>Likes</th>
                <th>Avg Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={72}
                      height={52}
                      style={{ borderRadius: 10, objectFit: "cover" }}
                      unoptimized
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    <p className="muted">{product.slug}</p>
                  </td>
                  <td>
                    <div className="stack" style={{ gap: "0.25rem" }}>
                      <span>
                        INR {product.originalPriceInr} {"->"} {product.priceInr} (
                        {getProductDiscountPercentage(product, "INR")}%)
                      </span>
                      <span>
                        USD {product.originalPriceUsd} {"->"} {product.priceUsd} (
                        {getProductDiscountPercentage(product, "USD")}%)
                      </span>
                    </div>
                  </td>
                  <td>{product.downloads}</td>
                  <td>{product.likes}</td>
                  <td>{product.avgRating}</td>
                  <td>{product.status}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <Link href={`/admin/products/${product.id}`} className="subtle-link">
                        Edit
                      </Link>
                      <Link href="/admin/products" className="subtle-link">
                        Hide/Show
                      </Link>
                      <Link href="/admin/products" className="subtle-link">
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
