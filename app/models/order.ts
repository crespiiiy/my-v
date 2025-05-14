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

// Sample orders data
export const orders: Order[] = [
  {
    id: "1",
    customerId: "2",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      {
        productId: "1",
        productName: "Professional Camera",
        quantity: 1,
        unitPrice: 1299.99,
        totalPrice: 1299.99
      },
      {
        productId: "5",
        productName: "Premium Microphone",
        quantity: 2,
        unitPrice: 149.99,
        totalPrice: 299.98
      }
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "United States"
    },
    billingAddress: {
      street: "123 Main St",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "United States"
    },
    subtotal: 1599.97,
    tax: 144.00,
    shippingCost: 15.00,
    discount: 0,
    total: 1758.97,
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    orderStatus: "delivered",
    createdAt: "2023-06-10T14:30:00Z",
    updatedAt: "2023-06-12T09:15:00Z",
    trackingNumber: "TRK123456789"
  },
  {
    id: "2",
    customerId: "3",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [
      {
        productId: "6",
        productName: "Video Editing Software",
        quantity: 1,
        unitPrice: 299.99,
        totalPrice: 299.99
      }
    ],
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States"
    },
    billingAddress: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States"
    },
    subtotal: 299.99,
    tax: 27.00,
    shippingCost: 0,
    discount: 50.00,
    total: 276.99,
    paymentMethod: "PayPal",
    paymentStatus: "paid",
    orderStatus: "processing",
    createdAt: "2023-06-15T10:45:00Z",
    updatedAt: "2023-06-15T10:45:00Z"
  },
  {
    id: "3",
    customerId: "2",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      {
        productId: "8",
        productName: "Portable SSD Drive",
        quantity: 1,
        unitPrice: 179.99,
        totalPrice: 179.99
      },
      {
        productId: "10",
        productName: "Color Calibration Tool",
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99
      }
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "United States"
    },
    billingAddress: {
      street: "123 Main St",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "United States"
    },
    subtotal: 379.98,
    tax: 34.20,
    shippingCost: 12.50,
    discount: 0,
    total: 426.68,
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    orderStatus: "shipped",
    createdAt: "2023-07-05T16:20:00Z",
    updatedAt: "2023-07-06T09:10:00Z",
    trackingNumber: "TRK987654321"
  },
  {
    id: "4",
    customerId: "4",
    customerName: "Emily Johnson",
    customerEmail: "emily@example.com",
    items: [
      {
        productId: "3",
        productName: "Drawing Tablet",
        quantity: 1,
        unitPrice: 349.99,
        totalPrice: 349.99
      }
    ],
    shippingAddress: {
      street: "789 Pine St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94101",
      country: "United States"
    },
    billingAddress: {
      street: "789 Pine St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94101",
      country: "United States"
    },
    subtotal: 349.99,
    tax: 31.50,
    shippingCost: 15.00,
    discount: 0,
    total: 396.49,
    paymentMethod: "Credit Card",
    paymentStatus: "pending",
    orderStatus: "pending",
    createdAt: "2023-07-20T12:30:00Z",
    updatedAt: "2023-07-20T12:30:00Z"
  },
  {
    id: "5",
    customerId: "5",
    customerName: "Michael Brown",
    customerEmail: "michael@example.com",
    items: [
      {
        productId: "2",
        productName: "Graphic Design Software",
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99
      },
      {
        productId: "7",
        productName: "Wireless Headphones",
        quantity: 1,
        unitPrice: 249.99,
        totalPrice: 249.99
      }
    ],
    shippingAddress: {
      street: "101 Maple Dr",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "United States"
    },
    billingAddress: {
      street: "101 Maple Dr",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "United States"
    },
    subtotal: 449.98,
    tax: 37.12,
    shippingCost: 15.00,
    discount: 20.00,
    total: 482.10,
    paymentMethod: "PayPal",
    paymentStatus: "paid",
    orderStatus: "shipped",
    createdAt: "2023-07-15T09:15:00Z",
    updatedAt: "2023-07-16T14:30:00Z",
    trackingNumber: "TRK456789123"
  }
];

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