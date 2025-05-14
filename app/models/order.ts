import type { User } from "./user";
import type { CartItem } from "./cart";

export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type ShippingMethod = 
  | "standard"
  | "priority"
  | "express";

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
  phoneNumber?: string;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDeliveryDate?: string;
  trackingUrl?: string;
  events: {
    date: string;
    status: string;
    location?: string;
    description: string;
  }[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  shippingDetails: ShippingDetails;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  tracking?: TrackingInfo;
  createdAt: string;
  updatedAt: string;
}

// Sample orders data
export const orders: Order[] = [
  {
    id: "ORD12345",
    userId: "2", // John Doe
    items: [
      {
        product: {
          id: "1",
          name: "Professional Camera",
          description: "High-quality professional camera for photography enthusiasts. Features 4K video recording, 24MP sensor, and advanced autofocus system.",
          price: 1299.99,
          images: ["/images/products/camera-1.jpg", "/images/products/camera-2.jpg", "/images/products/camera-3.jpg"],
          category: "Photography",
          featured: true,
          inStock: true,
          stockQuantity: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 1
      }
    ],
    status: "delivered",
    paymentStatus: "paid",
    shippingMethod: "standard",
    shippingCost: 4.99,
    shippingDetails: {
      firstName: "John",
      lastName: "Doe",
      address: {
        street: "123 Main St",
        city: "Brooklyn",
        state: "NY",
        zipCode: "11201",
        country: "United States"
      },
      email: "john@example.com",
      phoneNumber: "555-123-4567"
    },
    subtotal: 1299.99,
    tax: 130.00,
    total: 1434.98,
    tracking: {
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456784",
      estimatedDeliveryDate: "2023-10-15",
      trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
      events: [
        {
          date: "2023-10-10T09:00:00Z",
          status: "Order Processed",
          description: "Your order has been processed and is ready for shipment."
        },
        {
          date: "2023-10-11T13:25:00Z",
          status: "Shipped",
          location: "Distribution Center",
          description: "Your order has been shipped."
        },
        {
          date: "2023-10-14T16:12:00Z",
          status: "Out for Delivery",
          location: "Local Carrier Facility",
          description: "Your package is out for delivery."
        },
        {
          date: "2023-10-14T18:45:00Z",
          status: "Delivered",
          location: "Front Door",
          description: "Your package has been delivered."
        }
      ]
    },
    createdAt: "2023-10-10T08:30:00Z",
    updatedAt: "2023-10-14T18:45:00Z"
  },
  {
    id: "ORD67890",
    userId: "2", // John Doe
    items: [
      {
        product: {
          id: "5",
          name: "Premium Microphone",
          description: "Studio-quality condenser microphone for professional audio recording and podcasting.",
          price: 149.99,
          images: ["/images/products/microphone-1.jpg", "/images/products/microphone-2.jpg"],
          category: "Audio",
          featured: true,
          inStock: true,
          stockQuantity: 20,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 1
      },
      {
        product: {
          id: "7",
          name: "Wireless Headphones",
          description: "Premium wireless headphones with noise cancellation and studio-quality sound.",
          price: 249.99,
          images: ["/images/products/headphones-1.jpg", "/images/products/headphones-2.jpg"],
          category: "Audio",
          featured: true,
          inStock: true,
          stockQuantity: 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 1
      }
    ],
    status: "shipped",
    paymentStatus: "paid",
    shippingMethod: "express",
    shippingCost: 15.99,
    shippingDetails: {
      firstName: "John",
      lastName: "Doe",
      address: {
        street: "123 Main St",
        city: "Brooklyn",
        state: "NY",
        zipCode: "11201",
        country: "United States"
      },
      email: "john@example.com",
      phoneNumber: "555-123-4567"
    },
    subtotal: 399.98,
    tax: 40.00,
    total: 455.97,
    tracking: {
      carrier: "FedEx",
      trackingNumber: "794605892290",
      estimatedDeliveryDate: "2023-11-25",
      trackingUrl: "https://www.fedex.com/apps/fedextrack/?action=track&tracknumbers=794605892290",
      events: [
        {
          date: "2023-11-20T10:15:00Z",
          status: "Order Processed",
          description: "Your order has been processed and is ready for shipment."
        },
        {
          date: "2023-11-21T09:30:00Z",
          status: "Shipped",
          location: "Distribution Center",
          description: "Your order has been shipped."
        },
        {
          date: "2023-11-23T14:20:00Z",
          status: "In Transit",
          location: "Regional Hub",
          description: "Your package is in transit to the delivery location."
        }
      ]
    },
    createdAt: "2023-11-20T10:15:00Z",
    updatedAt: "2023-11-23T14:20:00Z"
  },
  {
    id: "ORD54321",
    userId: "3", // Jane Smith
    items: [
      {
        product: {
          id: "3",
          name: "Drawing Tablet",
          description: "Professional drawing tablet with pressure sensitivity and wireless connectivity for digital artists.",
          price: 349.99,
          images: ["/images/products/tablet-1.jpg", "/images/products/tablet-2.jpg"],
          category: "Hardware",
          featured: false,
          inStock: true,
          stockQuantity: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        quantity: 1
      }
    ],
    status: "processing",
    paymentStatus: "paid",
    shippingMethod: "priority",
    shippingCost: 9.99,
    shippingDetails: {
      firstName: "Jane",
      lastName: "Smith",
      address: {
        street: "456 Oak Ave",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "United States"
      },
      email: "jane@example.com",
      phoneNumber: "555-987-6543"
    },
    subtotal: 349.99,
    tax: 35.00,
    total: 394.98,
    tracking: {
      carrier: "USPS",
      trackingNumber: "9400123456789123456781",
      events: [
        {
          date: "2023-12-01T11:20:00Z",
          status: "Order Processed",
          description: "Your order has been processed and is ready for shipment."
        },
        {
          date: "2023-12-02T14:30:00Z",
          status: "Processing",
          location: "Warehouse",
          description: "Your order is being prepared for shipment."
        }
      ]
    },
    createdAt: "2023-12-01T11:20:00Z",
    updatedAt: "2023-12-02T14:30:00Z"
  }
];

// Helper functions for orders

// Get all orders for a user
export function getUserOrders(userId: string): Order[] {
  return orders.filter(order => order.userId === userId);
}

// Get order by ID
export function getOrderById(orderId: string): Order | undefined {
  return orders.find(order => order.id === orderId);
}

// Create a new order
export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: `ORD${Math.floor(Math.random() * 90000) + 10000}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  return newOrder;
}

// Update order status
export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) return null;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  return orders[orderIndex];
}

// Add tracking information to an order
export function addTrackingInfo(orderId: string, trackingInfo: TrackingInfo): Order | null {
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) return null;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    tracking: trackingInfo,
    updatedAt: new Date().toISOString()
  };
  
  return orders[orderIndex];
}

// Add tracking event to an order
export function addTrackingEvent(orderId: string, event: { date: string; status: string; location?: string; description: string }): Order | null {
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1 || !orders[orderIndex].tracking) return null;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    tracking: {
      ...orders[orderIndex].tracking!,
      events: [...orders[orderIndex].tracking!.events, event]
    },
    updatedAt: new Date().toISOString()
  };
  
  return orders[orderIndex];
} 