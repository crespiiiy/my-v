export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string; // Display name
  userAvatar?: string; // Optional avatar URL
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  helpful: number; // Number of users who found this review helpful
  verified: boolean; // Whether user actually purchased the product
}

// Sample reviews data
export const reviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "2",
    userName: "John Doe",
    userAvatar: "/images/avatars/user1.jpg",
    rating: 5,
    comment: "Excellent camera! The image quality is amazing and the autofocus is incredibly fast. I've been using it for my photography business and my clients are very impressed with the results.",
    createdAt: "2023-10-15T10:30:00Z",
    helpful: 12,
    verified: true,
  },
  {
    id: "2",
    productId: "1",
    userId: "3",
    userName: "Jane Smith",
    userAvatar: "/images/avatars/user2.jpg",
    rating: 4,
    comment: "Great camera overall. The only drawback for me is the battery life which could be better for longer shoots. But the features and image quality are top-notch.",
    createdAt: "2023-09-20T14:15:00Z",
    helpful: 8,
    verified: true,
  },
  {
    id: "3",
    productId: "2",
    userId: "2",
    userName: "John Doe",
    userAvatar: "/images/avatars/user1.jpg",
    rating: 5,
    comment: "This software has everything I need for my design projects. The interface is intuitive and the tools are powerful. Definitely worth the investment!",
    createdAt: "2023-11-05T09:45:00Z",
    helpful: 15,
    verified: true,
  },
  {
    id: "4",
    productId: "3",
    userId: "4",
    userName: "Mike Johnson",
    rating: 3,
    comment: "The drawing tablet works well but took some time to get used to. The pressure sensitivity is good but the surface is a bit too slippery for my taste.",
    createdAt: "2023-10-28T16:20:00Z",
    helpful: 5,
    verified: true,
  },
  {
    id: "5",
    productId: "5",
    userId: "3",
    userName: "Jane Smith",
    userAvatar: "/images/avatars/user2.jpg",
    rating: 5,
    comment: "This microphone is fantastic for podcasting. The sound quality is crystal clear and it does a great job at minimizing background noise.",
    createdAt: "2023-11-10T11:30:00Z",
    helpful: 9,
    verified: true,
  },
];

// Helper functions for review operations
export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter(review => review.productId === productId);
}

export function getAverageRating(productId: string): number {
  const productReviews = getReviewsByProductId(productId);
  if (productReviews.length === 0) return 0;
  
  const sum = productReviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / productReviews.length).toFixed(1));
}

export function getReviewsCount(productId: string): number {
  return getReviewsByProductId(productId).length;
}

export function addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Review {
  const newReview: Review = {
    id: (reviews.length + 1).toString(),
    ...review,
    createdAt: new Date().toISOString(),
    helpful: 0,
  };
  
  reviews.push(newReview);
  return newReview;
}

export function markReviewHelpful(reviewId: string): void {
  const review = reviews.find(r => r.id === reviewId);
  if (review) {
    review.helpful += 1;
  }
} 