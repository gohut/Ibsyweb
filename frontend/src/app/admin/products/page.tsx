"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAppState();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      showToast("Error loading products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      showToast("Product deleted");
      fetchProducts();
    } catch (err) {
      showToast("Error deleting product", "error");
    }
  };

  const getProductDiscountPercentage = (product: Product, currency: "INR" | "USD") => {
    const original = currency === "INR" ? product.original_price_inr : product.original_price_usd;
    const current = currency === "INR" ? product.price_inr : product.price_usd;
  
    if (!original || original <= current) {
      return 0;
    }
  
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="stack">
      <SectionHeading title="Products" eyebrow="Catalog management" actionHref="/admin/products/new" actionLabel="Add New Product" />

      <Card style={{ padding: "1rem" }}>
        <Input label="Search products" placeholder="Search by name, category, or slug" />
      </Card>

      <Card style={{ padding: "1rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
        ) : (
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
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={72}
                          height={52}
                          style={{ borderRadius: 10, objectFit: "cover" }}
                          unoptimized
                        />
                      )}
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      <p className="muted">{product.slug}</p>
                    </td>
                    <td>
                      <div className="stack" style={{ gap: "0.25rem" }}>
                        <span>
                          INR {product.original_price_inr} {"->"} {product.price_inr} (
                          {getProductDiscountPercentage(product, "INR")}%)
                        </span>
                        <span>
                          USD {product.original_price_usd} {"->"} {product.price_usd} (
                          {getProductDiscountPercentage(product, "USD")}%)
                        </span>
                      </div>
                    </td>
                    <td>{product.downloads}</td>
                    <td>{product.likes}</td>
                    <td>{product.avg_rating}</td>
                    <td>{product.status}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <Link href={`/admin/products/${product.id}`} className="subtle-link">
                          Edit
                        </Link>
                        <button type="button" className="subtle-link" onClick={() => handleDelete(product.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
