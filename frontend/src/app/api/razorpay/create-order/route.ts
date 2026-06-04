import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

// ─── Types ────────────────────────────────────────────────────────────────────
interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ─── POST /api/razorpay/verify ────────────────────────────────────────────────
// Called by DirectPurchaseButton BEFORE saving the order or delivering the product.
// Returns { ok: true } only if the HMAC signature matches — proving the payment
// actually came from Razorpay and was not tampered with.
export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.error("[razorpay/verify] Missing RAZORPAY_KEY_SECRET env var");
    return NextResponse.json(
      { ok: false, error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Razorpay's verification formula:
  // HMAC-SHA256( razorpay_order_id + "|" + razorpay_payment_id, key_secret )
  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.warn("[razorpay/verify] Signature mismatch — possible fraud or tampered response", {
      razorpay_order_id,
      razorpay_payment_id,
    });
    return NextResponse.json(
      { ok: false, error: "Signature verification failed" },
      { status: 400 },
    );
  }

  // Signature matched — payment is genuine
  return NextResponse.json({ ok: true });
}