import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProductById, orders } from "@/lib/mock-data";

export default function AdminOrdersPage() {
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
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer Name</th>
                <th>Email</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Download Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.buyerName}</td>
                  <td>{order.email}</td>
                  <td>{getProductById(order.productId)?.name}</td>
                  <td>
                    {order.currency === "INR" ? `₹${order.amount}` : `$${order.amount}`}
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.date}</td>
                  <td>{order.status === "completed" ? "Ready" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
