import Stripe from "stripe";

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return Response.json({ ok: false, error: "STRIPE_SECRET_KEY is not set" }, { status: 500 });
  }

  const { plan } = await request.json().catch(() => ({ plan: "standard" }));
  const priceId = plan === "premium" ? process.env.STRIPE_PREMIUM_PRICE_ID : process.env.STRIPE_STANDARD_PRICE_ID;

  if (!priceId) {
    return Response.json({ ok: false, error: "Stripe price id is not set" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/try-on?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=cancel`,
  });

  return Response.json({ ok: true, url: session.url });
}
