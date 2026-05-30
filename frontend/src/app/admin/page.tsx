import { StatsCard } from "@/components/admin/StatsCard";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export const runtime = "nodejs";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();

  const [{ count: totalProducts }, { count: totalOrders }, { data: completedOrders }, { data: recentOrders }, { data: allProducts }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("amount").eq("status", "completed"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("id, name")
  ]);

  const totalRevenue = completedOrders?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0;

  const productMap = allProducts?.reduce((acc: Record<string, string>, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {}) || {};

  const dashboardStats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "positive", change: "+12.5%" },
    { label: "Total Orders", value: String(totalOrders || 0), trend: "positive", change: "+5.2%" },
    { label: "Active Products", value: String(totalProducts || 0), trend: "neutral", change: "0%" },
  ];

  return (
    <div className="stack">
      <SectionHeading title="Dashboard" eyebrow="Overview" />
      <div className="admin-stats">
        {dashboardStats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card style={{ padding: "1rem" }}>
        <SectionHeading title="Recent Orders" actionHref="/admin/orders" actionLabel="View all" />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer Email</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product_id ? productMap[order.product_id] || "Unknown" : "Unknown"}</td>
                  <td>{order.buyer_email}</td>
                  <td>
                    {order.currency === "INR" ? `₹${order.amount}` : `$${order.amount}`}
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                    No recent orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
