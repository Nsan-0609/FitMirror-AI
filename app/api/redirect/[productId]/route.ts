import { NextResponse } from "next/server";
import { getPurchaseUrl } from "@/lib/affiliate";
import { getProductById } from "@/lib/mockProducts";

export async function GET(
  request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  const product = getProductById(productId);

  if (!product) {
    return NextResponse.redirect(new URL("/try-on?error=product-not-found", request.url));
  }

  // TODO: Supabaseにクリックログを保存する
  // product_id, platform, referrer, user_id, clicked_at など
  return NextResponse.redirect(getPurchaseUrl(product), { status: 302 });
}
