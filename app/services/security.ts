// Security service for fraud prevention

// Types
type FraudRiskLevel = 'low' | 'medium' | 'high';

interface FraudCheckResult {
  risk: FraudRiskLevel;
  verified: boolean;
  reasons: string[];
}

interface OrderData {
  userId: string;
  items: Array<{
    productId: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    country: string;
    city: string;
    zipCode: string;
    street: string;
  };
  billingAddress?: {
    country: string;
    city: string;
    zipCode: string;
    street: string;
  };
  paymentMethod: {
    type: 'credit_card' | 'paypal' | 'bank_transfer';
    cardInfo?: {
      lastFourDigits: string;
      bin: string; // Bank Identification Number (first 6 digits)
    };
  };
  ipAddress: string;
  userAgent: string;
  orderTimestamp: string;
}

// Suspicious country list (simplified for demo)
const HIGH_RISK_COUNTRIES = ['CountryX', 'CountryY', 'CountryZ'];

// IP Geolocation check (simulated)
function checkIPGeolocation(ipAddress: string, country: string): boolean {
  // In real implementation, this would call a geolocation service
  // to verify IP matches the country
  console.log(`Checking IP geolocation for ${ipAddress} against country ${country}`);
  return true; // Mock implementation always returns true
}

// Order velocity check (detect multiple orders in short time)
const recentOrders: Map<string, string[]> = new Map();

function checkOrderVelocity(userId: string, timestamp: string): boolean {
  const now = new Date(timestamp);
  const userOrders = recentOrders.get(userId) || [];
  
  // Check if user has placed more than 3 orders in the last 24 hours
  const last24Hours = userOrders.filter(orderTime => {
    const orderDate = new Date(orderTime);
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  });
  
  // Add current order timestamp to user's history
  recentOrders.set(userId, [...userOrders, timestamp]);
  
  // Return true if suspicious (more than 3 orders in 24 hours)
  return last24Hours.length >= 3;
}

// Address mismatch check
function checkAddressMismatch(shippingAddress: any, billingAddress: any): boolean {
  if (!billingAddress) return false;
  
  // Check if shipping and billing countries match
  return shippingAddress.country !== billingAddress.country;
}

// Order amount check - detect unusually high value orders
function checkHighValueOrder(items: any[]): boolean {
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return totalValue > 2000; // Consider orders over $2000 as high value
}

// Check for known fraud patterns in card BIN
function checkCardBIN(cardBin?: string): boolean {
  if (!cardBin) return false;
  
  // List of known fraud BINs (fictional for demo)
  const suspiciousBINs = ['123456', '654321'];
  return suspiciousBINs.includes(cardBin);
}

// Main fraud detection function
export function detectFraud(orderData: OrderData): FraudCheckResult {
  const reasons: string[] = [];
  let riskLevel: FraudRiskLevel = 'low';
  
  // Country risk check
  if (HIGH_RISK_COUNTRIES.includes(orderData.shippingAddress.country)) {
    reasons.push('Order shipping to high-risk country');
    riskLevel = 'high';
  }
  
  // IP Geolocation mismatch
  if (!checkIPGeolocation(orderData.ipAddress, orderData.shippingAddress.country)) {
    reasons.push('IP geolocation does not match shipping country');
    riskLevel = 'medium';
  }
  
  // Order velocity check
  if (checkOrderVelocity(orderData.userId, orderData.orderTimestamp)) {
    reasons.push('Multiple orders placed in short time period');
    riskLevel = riskLevel === 'high' ? 'high' : 'medium';
  }
  
  // Shipping/Billing address mismatch
  if (checkAddressMismatch(orderData.shippingAddress, orderData.billingAddress)) {
    reasons.push('Shipping and billing addresses in different countries');
    riskLevel = riskLevel === 'high' ? 'high' : 'medium';
  }
  
  // High value order
  if (checkHighValueOrder(orderData.items)) {
    reasons.push('High value order');
    // Only increase risk if other factors are present
    if (reasons.length > 1) {
      riskLevel = 'high';
    }
  }
  
  // Credit card BIN check
  if (orderData.paymentMethod.type === 'credit_card' && 
      orderData.paymentMethod.cardInfo &&
      checkCardBIN(orderData.paymentMethod.cardInfo.bin)) {
    reasons.push('Card BIN associated with fraud');
    riskLevel = 'high';
  }
  
  return {
    risk: riskLevel,
    verified: riskLevel !== 'high',
    reasons
  };
}

// Check if order should be auto-approved or needs manual review
export function processOrderSecurity(orderData: OrderData): {
  approved: boolean;
  requiresReview: boolean;
  result: FraudCheckResult;
} {
  const fraudCheck = detectFraud(orderData);
  
  return {
    approved: fraudCheck.risk === 'low',
    requiresReview: fraudCheck.risk === 'medium' || fraudCheck.risk === 'high',
    result: fraudCheck
  };
}

// Function to verify user login attempts 
// (e.g., detect multiple failed login attempts from different IPs)
export function verifyLoginAttempt(
  userId: string,
  ipAddress: string,
  userAgent: string,
  timestamp: string
): { suspicious: boolean; reason?: string } {
  // Implementation would track login attempts and IP addresses
  // This is a simplified version
  return { suspicious: false };
} 