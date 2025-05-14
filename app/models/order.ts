export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  trackingNumber?: string;
}

// Empty orders data - removed sample data
export const orders: Order[] = [];

// Helper functions
export function getAllOrders(): Order[] {
  return orders;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find(order => order.id === id);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return orders.filter(order => order.customerId === customerId);
}

// Added for compatibility with existing code
export function getUserOrders(userId: string): Order[] {
  return getOrdersByCustomerId(userId);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return orders.filter(order => order.orderStatus === status);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const orderIndex = orders.findIndex(order => order.id === id);
  if (orderIndex === -1) return undefined;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    orderStatus: status,
    updatedAt: new Date().toISOString()
  };
  
  return orders[orderIndex];
}

export function updateTrackingNumber(id: string, trackingNumber: string): Order | undefined {
  const orderIndex = orders.findIndex(order => order.id === id);
  if (orderIndex === -1) return undefined;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    trackingNumber,
    updatedAt: new Date().toISOString()
  };
  
  return orders[orderIndex];
} 