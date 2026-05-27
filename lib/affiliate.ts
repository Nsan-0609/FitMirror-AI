import { Product } from "./mockProducts";

export function getPurchaseUrl(product: Product) {
  return product.affiliateUrl || product.normalUrl;
}
