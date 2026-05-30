// ─── Razorpay config ────────────────────────────────────────────────────────
export const razorpayConfig = {
  currency: "INR",
  checkoutLabel: "Pay with Razorpay",
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
};

// ─── Razorpay global type (loaded via CDN script) ────────────────────────────
// Razorpay is injected as window.Razorpay by the checkout script.
// This keeps TypeScript happy without needing a separate @types package.
export interface RazorpayOptions {
  key: string;
  amount: number;          // in paise (INR × 100)
  currency: string;
  name: string;            // your store name
  description: string;     // product name
  order_id: string;        // from Razorpay Orders API
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}