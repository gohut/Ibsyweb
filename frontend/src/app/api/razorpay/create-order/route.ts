import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CreateOrderBody {
  amount: number;   // INR amount (NOT paise — we multiply below)
  productName: string;
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

// ─── POST /api/razorpay/create-order ─────────────────────────────────────────
export async function POST(request: Request) {
  const keyId     = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("[razorpay] Missing RAZORPAY env vars");
    return NextResponse.json(
      { error: "Payment gateway not configured" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as CreateOrderBody;
  const amountPaise = Math.round(body.amount * 100); // Razorpay expects paise

  const receipt = `rcpt_${crypto.randomBytes(6).toString("hex")}`;

  const razorpayPayload = {
    amount: amountPaise,
    currency: "INR",
    receipt,
  };

  // Call Razorpay Orders API using Basic Auth (key_id:key_secret)
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(razorpayPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[razorpay] create-order failed:", err);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 },
    );
  }

  const order = (await res.json()) as RazorpayOrderResponse;
  return NextResponse.json({ orderId: order.id, amount: order.amount });
}