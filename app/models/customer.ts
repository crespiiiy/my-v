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

// Empty customers data - removed sample data
export const customers: Customer[] = [];

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