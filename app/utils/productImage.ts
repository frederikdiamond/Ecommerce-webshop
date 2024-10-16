import { Product } from "~/types/ProductTypes";

const PLACEHOLDER_IMAGE = "/placeholder-image.jpg"; // Need to replace!

export function getProductImage(product: Product | undefined): string {
  if (product?.images && product.images.length > 0) {
    return product.images[0];
  }
  return PLACEHOLDER_IMAGE;
}
