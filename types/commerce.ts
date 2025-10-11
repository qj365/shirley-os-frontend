// Shared cart item interface used across the application
// This matches the structure returned by Medusa's cart service
export interface CartItem {
  id: string;
  variant_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  thumbnail?: string;
  product_id?: string; // Optional for compatibility
  total?: number; // Optional for compatibility
  original_total?: number; // Optional for compatibility
}
