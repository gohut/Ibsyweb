"use client";

import { useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import { formatCurrencyValue } from "@/lib/currency";
import { razorpayConfig, type RazorpaySuccessResponse } from "@/lib/razorpay";
import type { Product } from "@/lib/mock-data";

type DirectPurchaseButtonProps = {
  products: Product[];
  buttonLabel?: string;
  fullWidth?: boolean;
};

type Stage = "closed" | "processing" | "bill";

interface CompletedOrder {
  billId: string;
  paymentId: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function DirectPurchaseButton({
  products,
  buttonLabel = "Buy Now",
  fullWidth = true,
}: DirectPurchaseButtonProps) {
  const { showToast } = useAppState();
  const [stage, setStage] = useState<Stage>("closed");
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const total = products.reduce((sum, p) => sum + p.priceInr, 0);

  const handleBuyNow = async () => {
    setStage("processing");

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      showToast("Could not load payment gateway.", "error");
      setStage("closed");
      return;
    }

    let razorpayOrderId: string;
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          productName: products.map((p) => p.name).join(", "),
        }),
      });
      if (!res.ok) throw new Error();
      razorpayOrderId = ((await res.json()) as { orderId: string }).orderId;
    } catch {
      showToast("Could not initiate payment. Try again.", "error");
      setStage("closed");
      return;
    }

    const rzp = new window.Razorpay({
      key: razorpayConfig.keyId,
      amount: Math.round(total * 100),
      currency: "INR",
      name: "Ibsy",
      description: products.map((p) => p.name).join(", "),
      order_id: razorpayOrderId,
      prefill: { name: "", email: "" },
      theme: { color: "#c9a84c" },
      handler: async (response: RazorpaySuccessResponse) => {
        await saveOrder(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: () => {
          showToast("Payment cancelled.", "error");
          setStage("closed");
        },
      },
    });

    rzp.open();
  };

  const saveOrder = async (paymentId: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_name: "Customer",
          buyer_email: "customer@ibsy.in",
          product_id: products[0]?.id,
          amount: total,
          currency: "INR",
          payment_method: "razorpay",
          status: "completed",
          payment_reference: paymentId,
        }),
      });
      if (!res.ok) throw new Error();
      const order = (await res.json()) as { id: string };
      setCompletedOrder({ billId: order.id, paymentId });
    } catch {
      setCompletedOrder({
        billId: `PAY-${paymentId.slice(-8).toUpperCase()}`,
        paymentId,
      });
    }
    setStage("bill");

  };

  // ─── Shared order summary ─────────────────────────────────────────────────
  const OrderSummary = () => (
    <div className="surface-card" style={{ padding: "0.75rem" }}>
      {products.map((p) => (
        <div key={p.id} className="summary-row" style={{ fontSize: "0.9rem" }}>
          <span style={{ color: "var(--color-text-secondary)" }}>{p.name}</span>
          <strong>{formatCurrencyValue(p.priceInr, "INR")}</strong>
        </div>
      ))}
      <div className="summary-row" style={{
        marginTop: "0.5rem",
        paddingTop: "0.5rem",
        borderTop: "1px solid var(--color-border)",
      }}>
        <strong style={{ fontSize: "0.9rem" }}>Total</strong>
        <strong style={{
          fontFamily: "var(--font-accent), serif",
          fontSize: "1.25rem",
          color: "var(--color-accent-secondary)",
        }}>
          {formatCurrencyValue(total, "INR")}
        </strong>
      </div>
    </div>
  );

  return (
    <>
      <Button fullWidth={fullWidth} onClick={handleBuyNow}>
        {buttonLabel}
      </Button>

      {stage !== "closed" && (
        <div className="payment-modal-backdrop">
          <div
            className="surface-card"
            style={{
              width: "min(100%, 420px)",
              maxHeight: "calc(100dvh - 2rem)",
              overflowY: "auto",
              padding: "1rem",
              display: "grid",
              gap: "0.85rem",
              borderRadius: "var(--radius-card)",
            }}
          >

            {/* ── Processing ── */}
            {stage === "processing" && (
              <div style={{
                display: "grid",
                gap: "0.75rem",
                justifyItems: "center",
                padding: "1.5rem 0.5rem",
                textAlign: "center",
              }}>
                <div style={{
                  width: 40, height: 40,
                  border: "3px solid var(--color-accent-primary)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                <p className="eyebrow">Processing payment</p>
                <p className="muted" style={{ fontSize: "0.82rem" }}>
                  Complete the payment in the Razorpay window.
                  <br />Do not close or refresh this page.
                </p>
              </div>
            )}

            {/* ── Bill ── */}
            {stage === "bill" && completedOrder && (
              <>
                {/* Header with close button */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div>
                    <p className="eyebrow" style={{ marginBottom: "0.2rem" }}>Payment confirmed</p>
                    <h3 style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                      lineHeight: 1.25,
                    }}>
                      Payment successful
                    </h3>
                  </div>
                  <button
                    onClick={() => setStage("closed")}
                    aria-label="Close"
                    style={{
                      flexShrink: 0,
                      width: 32, height: 32,
                      borderRadius: "50%",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface-medium)",
                      color: "var(--color-text-secondary)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem", cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <p className="muted" style={{ fontSize: "0.82rem", marginTop: "-0.25rem" }}>
                  Screenshot your receipt before downloading the product
                </p>

                {/* Receipt */}
                <div className="surface-card" style={{ padding: "0.75rem", display: "grid", gap: "0.45rem" }}>
                  {[
                    ["Order ID", completedOrder.billId],
                    ["Payment ID", completedOrder.paymentId],
                    ["Date", new Date().toLocaleString()],
                  ].map(([label, value]) => (
                    <div key={label} className="summary-row" style={{ fontSize: "0.82rem" }}>
                      <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
                      <strong style={{ textAlign: "right", wordBreak: "break-all", maxWidth: "65%" }}>
                        {value}
                      </strong>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "0.25rem", paddingTop: "0.5rem" }}>
                    <OrderSummary />
                  </div>
                </div>

                <div className="payment-modal-actions">
                  <Button variant="ghost" onClick={() => setStage("closed")}>Close</Button>
                  <a
                    href={`/api/download/${products[0]?.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="royal-button primary"
                  >
                    download My Product
                  </a>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}