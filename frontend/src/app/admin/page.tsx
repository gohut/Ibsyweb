import { StatsCard } from "@/components/admin/StatsCard";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { dashboardStats, getProductById, orders } from "@/lib/mock-data";

export default function AdminDashboardPage() {
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{getProductById(order.productId)?.name}</td>
                  <td>{order.email}</td>
                  <td>
                    {order.currency === "INR" ? `₹${order.amount}` : `$${order.amount}`}
                  </td>
                  <td>{order.date}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
