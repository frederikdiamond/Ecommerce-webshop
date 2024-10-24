import { Product } from "./ProductTypes";

export interface Wishlist {
  wishlistId: number;
  userId: number;
  name: string;
  slug: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: WishlistItem[];
}

export interface WishlistItem {
  id: number;
  productId: number;
  createdAt: Date;
  product: Product;
}
