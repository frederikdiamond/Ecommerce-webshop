export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  specifications: string[];
  basePrice: number;
  price: number;
  images: string[];
  quantity: number;
  totalSold: number;
  configurations: ConfigCategory[];
}
