import { mockProducts } from "@/lib/mockProducts";

export async function GET() {
  return Response.json({ products: mockProducts });
}
