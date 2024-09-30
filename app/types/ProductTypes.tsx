export interface Product {
  id: number;
  name: string;
  specifications: string[];
  price: number;
  imageUrl: string | null;
  quantity: number;
  totalSold: number;
}
