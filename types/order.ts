export type OrderStatus = 'Process' | 'Cancelled' | 'Delivered' | 'Pending';

export interface Order {
  id: string;
  store: string;
  amount: number;
  status: OrderStatus;
  date?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderDetails extends Order {
  customerName?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  trackingNumber?: string;
}
