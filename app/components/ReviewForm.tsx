import React, { useState } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';
import { addReview } from '../models/review';

interface ReviewFormProps {
  productId: string;
  onReviewSubmit: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmit, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{rating?: string; comment?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const newErrors: {rating?: string; comment?: string} = {};
    
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    
    if (!comment.trim()) {
      newErrors.comment = "Please enter a review comment";
    } else if (comment.length < 10) {
      newErrors.comment = "Your review must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Create a new review
    if (user) {
      try {
        // In a real app, this would be an API call
        addReview({
          productId,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          userAvatar: undefined, // In a real app, this might come from user profile
          rating,
          comment,
          verified: true, // In a real app, you'd verify if they purchased the product
        });
        
        // Show success message
        setRating(0);
        setComment('');
        onReviewSubmit();
      } catch (error) {
        console.error('Error adding review:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div>
            <StarRating 
              rating={rating} 
              size="lg" 
              interactive={true} 
              onRatingChange={setRating} 
            />
            {errors.rating && (
              <div className="text-red-500 text-sm mt-1">{errors.rating}</div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full min-h-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-y"
            placeholder="What did you like or dislike about this product? How did it perform?"
          />
          {errors.comment && (
            <div className="text-red-500 text-sm mt-1">{errors.comment}</div>
          )}
          <div className="mt-1 text-sm text-gray-400">
            Your review will be publicly displayed with your name
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 