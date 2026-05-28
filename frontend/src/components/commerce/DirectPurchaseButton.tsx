"use client";

import { useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrencyValue, type Currency } from "@/lib/currency";
import type { Product } from "@/lib/mock-data";

type DirectPurchaseButtonProps = {
  products: Product[];
  buttonLabel?: string;
  fullWidth?: boolean;
};

type PurchaseStage = "closed" | "payment" | "bill";

export function DirectPurchaseButton({
  products,
  buttonLabel = "Buy Now",
  fullWidth = true,
}: DirectPurchaseButtonProps) {
  const { currency, showToast } = useAppState();
  const [stage, setStage] = useState<PurchaseStage>("closed");
  const [billId, setBillId] = useState("");

  const total = products.reduce((sum, product) => {
    return sum + (currency === "INR" ? product.priceInr : product.priceUsd);
  }, 0);
  const provider = currency === "INR" ? "Razorpay" : "Stripe";

  const completePayment = () => {
    const nextBillId = `BILL-${Date.now().toString().slice(-6)}`;
    setBillId(nextBillId);
    setStage("bill");
    showToast(`Payment completed via ${provider}.`);
  };

  return (
    <>
      <Button fullWidth={fullWidth} onClick={() => setStage("payment")}>
        {buttonLabel}
      </Button>

      {stage !== "closed" ? (
        <div className="payment-modal-backdrop" role="presentation">
          <Card className="payment-modal">
            {stage === "payment" ? (
              <div className="stack" style={{ gap: "1rem" }}>
                <div>
                  <p className="eyebrow">{provider} secure checkout</p>
                  <h3 className="display-heading" style={{ fontSize: "1.8rem" }}>
                    Complete your payment
                  </h3>
                  <p className="muted">
                    {currency === "INR"
                      ? "The buy flow goes directly into Razorpay-style payment without a separate checkout page."
                      : "International visitors are switched to USD automatically."}
                  </p>
                </div>
                <div className="surface-card" style={{ padding: "1rem" }}>
                  {products.map((product) => (
                    <div key={product.id} className="summary-row">
                      <span>{product.name}</span>
                      <strong>
                        {formatCurrencyValue(
                          currency === "INR" ? product.priceInr : product.priceUsd,
                          currency,
                        )}
                      </strong>
                    </div>
                  ))}
                  <div className="summary-row" style={{ marginTop: "0.75rem" }}>
                    <strong>Total</strong>
                    <strong className="price-display" style={{ fontSize: "1.5rem" }}>
                      {formatCurrencyValue(total, currency)}
                    </strong>
                  </div>
                </div>
                <div className="payment-modal-actions">
                  <Button variant="ghost" onClick={() => setStage("closed")}>
                    Cancel
                  </Button>
                  <Button onClick={completePayment}>
                    Pay with {provider}
                  </Button>
                </div>
              </div>
            ) : (
              <BillModal
                billId={billId}
                currency={currency}
                products={products}
                total={total}
                onClose={() => setStage("closed")}
              />
            )}
          </Card>
        </div>
      ) : null}
    </>
  );
}

function BillModal({
  billId,
  currency,
  products,
  total,
  onClose,
}: {
  billId: string;
  currency: Currency;
  products: Product[];
  total: number;
  onClose: () => void;
}) {
  return (
    <div className="stack" style={{ gap: "1rem" }}>
      <div>
        <p className="eyebrow">Bill displayed</p>
        <h3 className="display-heading" style={{ fontSize: "1.8rem" }}>
          Payment successful
        </h3>
        <p className="muted">
          Before getting the product, you can take screenshot of your bill.
        </p>
      </div>
      <div className="surface-card" style={{ padding: "1rem" }}>
        <div className="summary-row">
          <span>Bill ID</span>
          <strong>{billId}</strong>
        </div>
        <div className="summary-row">
          <span>Date</span>
          <strong>{new Date().toLocaleString()}</strong>
        </div>
        {products.map((product) => (
          <div key={product.id} className="summary-row">
            <span>{product.name}</span>
            <strong>
              {formatCurrencyValue(
                currency === "INR" ? product.priceInr : product.priceUsd,
                currency,
              )}
            </strong>
          </div>
        ))}
        <div className="summary-row" style={{ marginTop: "0.75rem" }}>
          <strong>Total</strong>
          <strong className="price-display" style={{ fontSize: "1.5rem" }}>
            {formatCurrencyValue(total, currency)}
          </strong>
        </div>
      </div>
      <div className="payment-modal-actions">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <a
          href={`/api/download/${products[0]?.id}`}
          target="_blank"
          rel="noreferrer"
          className="royal-button primary"
        >
          Get My Product
        </a>
      </div>
    </div>
  );
}
