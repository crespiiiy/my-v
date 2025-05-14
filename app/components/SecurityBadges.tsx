import React from 'react';

interface SecurityBadgesProps {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SecurityBadges({ 
  variant = 'horizontal', 
  size = 'md',
  className = ''
}: SecurityBadgesProps) {
  const isVertical = variant === 'vertical';
  
  // Icon size classes based on size prop
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];
  
  // Text size classes based on size prop
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // Container class based on variant
  const containerClass = isVertical 
    ? 'flex flex-col space-y-3' 
    : 'flex flex-wrap gap-4 items-center';
  
  // Badge class
  const badgeClass = `flex ${isVertical ? 'items-start' : 'items-center'} ${textSize} text-gray-400`;
  
  return (
    <div className={`${containerClass} ${className}`}>
      <div className={badgeClass}>
        <svg className={`${iconSize} mr-2 text-green-500 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure Transaction</span>
      </div>
      
      <div className={badgeClass}>
        <svg className={`${iconSize} mr-2 text-green-500 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>SSL Encrypted Checkout</span>
      </div>
      
      <div className={badgeClass}>
        <svg className={`${iconSize} mr-2 text-green-500 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span>Visa / Mastercard / PayPal</span>
      </div>
      
      {size !== 'sm' && (
        <div className={badgeClass}>
          <svg className={`${iconSize} mr-2 text-green-500 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          <span>Money-Back Guarantee</span>
        </div>
      )}
    </div>
  );
} 