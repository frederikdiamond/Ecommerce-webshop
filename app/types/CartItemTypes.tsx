import { Product } from "./ProductTypes";

export interface CartItem {
  cartItemId: number;
  product: Partial<Product>;
  quantity: number;
  price: number;
  configurations: {
    category: string;
    optionLabel: string;
    configurationId: number;
  }[];
}
