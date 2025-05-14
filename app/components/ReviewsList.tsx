import React, { useState } from 'react';
import { getReviewsByProductId, markReviewHelpful } from '../models/review';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface ReviewsListProps {
  productId: string;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState(() => getReviewsByProductId(productId));
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const { isLoggedIn } = useAuth();
  
  // Track reviews that user has marked as helpful to prevent multiple votes
  const [helpfulMarked, setHelpfulMarked] = useState<Set<string>>(new Set());
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
  };
  
  const handleMarkHelpful = (reviewId: string) => {
    if (helpfulMarked.has(reviewId)) return;
    
    // Update in mock data layer
    markReviewHelpful(reviewId);
    
    // Update local state
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 } 
        : review
    ));
    
    // Add to marked set
    setHelpfulMarked(new Set(helpfulMarked).add(reviewId));
  };
  
  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        <p className="text-gray-400 mb-4">This product has no reviews yet.</p>
        {isLoggedIn ? (
          <div>
            <p className="mb-2">Be the first to review this product</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
              Write a Review
            </button>
          </div>
        ) : (
          <p>
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Log in
            </Link> to write a review
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Customer Reviews ({reviews.length})</h3>
        <div className="flex items-center">
          <label htmlFor="sort-reviews" className="text-sm mr-2">
            Sort by:
          </label>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden mr-3">
                  {review.userAvatar ? (
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                      {review.userName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{review.userName}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            
            {review.verified && (
              <div className="mb-2 text-xs inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded-md">
                Verified Purchase
              </div>
            )}
            
            <p className="text-gray-300 mb-3">{review.comment}</p>
            
            <div className="flex items-center text-sm text-gray-400">
              <button 
                onClick={() => handleMarkHelpful(review.id)}
                disabled={helpfulMarked.has(review.id)}
                className={`flex items-center ${
                  helpfulMarked.has(review.id) ? 'text-gray-500' : 'hover:text-gray-300'
                }`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                  />
                </svg>
                Helpful {review.helpful > 0 ? `(${review.helpful})` : ''}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {isLoggedIn ? (
        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
            Write a Review
          </button>
        </div>
      ) : (
        <p className="mt-8 text-center text-gray-400">
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Log in
          </Link> to write a review
        </p>
      )}
    </div>
  );
} 