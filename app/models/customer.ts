import type { Address } from "./order";

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: Address;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  notes?: string;
  status: 'active' | 'inactive';
}

// Sample customers data
export const customers: Customer[] = [
  {
    id: "2",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    address: {
      street: "123 Main St",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "United States"
    },
    phoneNumber: "555-123-4567",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-07-05T16:20:00Z",
    totalOrders: 2,
    totalSpent: 2185.65,
    lastOrderDate: "2023-07-05T16:20:00Z",
    status: "active"
  },
  {
    id: "3",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Smith",
    address: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States"
    },
    phoneNumber: "555-987-6543",
    createdAt: "2023-02-20T14:45:00Z",
    updatedAt: "2023-06-15T10:45:00Z",
    totalOrders: 1,
    totalSpent: 276.99,
    lastOrderDate: "2023-06-15T10:45:00Z",
    status: "active"
  },
  {
    id: "4",
    email: "emily@example.com",
    firstName: "Emily",
    lastName: "Johnson",
    address: {
      street: "789 Pine St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94101",
      country: "United States"
    },
    phoneNumber: "555-456-7890",
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-07-20T12:30:00Z",
    totalOrders: 1,
    totalSpent: 396.49,
    lastOrderDate: "2023-07-20T12:30:00Z",
    status: "active"
  },
  {
    id: "5",
    email: "michael@example.com",
    firstName: "Michael",
    lastName: "Brown",
    address: {
      street: "101 Maple Dr",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "United States"
    },
    phoneNumber: "555-789-0123",
    createdAt: "2023-04-05T16:30:00Z",
    updatedAt: "2023-07-15T09:15:00Z",
    totalOrders: 1,
    totalSpent: 482.10,
    lastOrderDate: "2023-07-15T09:15:00Z",
    status: "active"
  },
  {
    id: "6",
    email: "sarah@example.com",
    firstName: "Sarah",
    lastName: "Davis",
    address: {
      street: "202 Elm St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "United States"
    },
    phoneNumber: "555-321-6547",
    createdAt: "2023-05-18T11:20:00Z",
    updatedAt: "2023-05-18T11:20:00Z",
    totalOrders: 0,
    totalSpent: 0,
    status: "inactive"
  }
];

// Helper functions
export function getAllCustomers(): Customer[] {
  return customers;
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find(customer => customer.id === id);
}

export function getCustomerByEmail(email: string): Customer | undefined {
  return customers.find(customer => customer.email.toLowerCase() === email.toLowerCase());
}

export function getActiveCustomers(): Customer[] {
  return customers.filter(customer => customer.status === "active");
}

export function getInactiveCustomers(): Customer[] {
  return customers.filter(customer => customer.status === "inactive");
}

export function updateCustomer(id: string, data: Partial<Omit<Customer, 'id' | 'createdAt'>>): Customer | undefined {
  const customerIndex = customers.findIndex(customer => customer.id === id);
  if (customerIndex === -1) return undefined;
  
  customers[customerIndex] = {
    ...customers[customerIndex],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return customers[customerIndex];
}

export function addCustomerNote(id: string, note: string): Customer | undefined {
  const customerIndex = customers.findIndex(customer => customer.id === id);
  if (customerIndex === -1) return undefined;
  
  const currentNotes = customers[customerIndex].notes || "";
  const dateStr = new Date().toISOString().split('T')[0];
  const newNote = `${dateStr}: ${note}`;
  const updatedNotes = currentNotes ? `${currentNotes}\n${newNote}` : newNote;
  
  customers[customerIndex] = {
    ...customers[customerIndex],
    notes: updatedNotes,
    updatedAt: new Date().toISOString()
  };
  
  return customers[customerIndex];
} 