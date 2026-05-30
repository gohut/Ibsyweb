"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Database } from "@/types/supabase";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function AdminOrdersPage() {
  const { showToast } = useAppState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products")
        ]);

        if (!ordersRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        const productMap = productsData.reduce((acc: Record<string, Product>, product: Product) => {
          acc[product.id] = product;
          return acc;
        }, {});

        setOrders(ordersData);
        setProducts(productMap);
      } catch (err) {
        showToast("Error loading orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showToast]);

  return (
    <div className="stack">
      <SectionHeading title="Orders" eyebrow="Transactions" />
      <Card style={{ padding: "1rem" }}>
        <div className="grid-auto products" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Input label="Date Range" placeholder="May 1 - May 31" />
          <Input label="Currency" placeholder="INR / USD" />
          <Input label="Product" placeholder="Search a product" />
        </div>
      </Card>
      <Card style={{ padding: "1rem" }}>
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading orders...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Buyer Name</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.buyer_name}</td>
                    <td>{order.buyer_email}</td>
                    <td>{order.product_id ? products[order.product_id]?.name || order.product_id : "Unknown"}</td>
                    <td>
                      {order.currency === "INR" ? `₹${order.amount}` : `$${order.amount}`}
                    </td>
                    <td>{order.currency}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{order.status === "completed" ? "Completed" : "Pending"}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                      No orders found.
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
