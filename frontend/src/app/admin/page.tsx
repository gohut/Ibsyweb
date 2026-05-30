import { StatsCard } from "@/components/admin/StatsCard";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();

  const [
    { count: totalProducts },
    { count: totalOrders },
    { data: completedOrders },
    { data: recentOrders },
    { data: allProducts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("amount").eq("status", "completed"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("id, name"),
  ]);

  const totalRevenue =
    (completedOrders as { amount: number | null }[] | null)?.reduce(
      (acc, order) => acc + (order.amount || 0),
      0
    ) || 0;

  const productMap =
    (allProducts as { id: string; name: string }[] | null)?.reduce(
      (acc: Record<string, string>, p) => {
        acc[p.id] = p.name;
        return acc;
      },
      {}
    ) || {};

  const dashboardStats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "positive", change: "+12.5%", detail: "From completed orders" },
    { label: "Total Orders", value: String(totalOrders || 0), trend: "positive", change: "+5.2%", detail: "All time orders" },
    { label: "Active Products", value: String(totalProducts || 0), trend: "neutral", change: "0%", detail: "Published products" },
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
              {(recentOrders || []).map((order) => {
                const o = order as {
                  id: string;
                  product_id: string | null;
                  buyer_email: string | null;
                  amount: number | null;
                  currency: string | null;
                  created_at: string;
                  status: string | null;
                };
                return (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.product_id ? productMap[o.product_id] || "Unknown" : "Unknown"}</td>
                    <td>{o.buyer_email}</td>
                    <td>
                      {o.currency === "INR" ? `₹${o.amount}` : `$${o.amount}`}
                    </td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>{o.status}</td>
                  </tr>
                );
              })}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                    No recent orders. please check later
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