import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  // Determine star size based on prop
  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];
  
  // Calculate filled stars width as a percentage
  const calculateWidth = (index: number) => {
    const displayRating = hoverRating || rating;
    const remainder = displayRating - (index - 1);
    
    if (remainder >= 1) return '100%';
    if (remainder <= 0) return '0%';
    return `${remainder * 100}%`;
  };
  
  const handleClick = (clickedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(clickedRating);
    }
  };
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => (
          <div 
            key={index} 
            className="relative"
            onMouseEnter={() => interactive && setHoverRating(index + 1)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => handleClick(index + 1)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            {/* Empty star (background) */}
            <svg 
              className={`${starSize} text-gray-400`} 
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            
            {/* Filled star (overlay) */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: calculateWidth(index + 1) }}>
              <svg 
                className={`${starSize} text-yellow-400`} 
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
} 