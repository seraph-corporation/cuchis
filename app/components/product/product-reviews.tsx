"use client";

import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  user: {
    name?: string;
    email: string;
  };
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!session) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title || undefined,
          comment: comment || undefined,
          // user: session.user // If API expects user, we might need to adjust API too. 
        }),
      });

      if (response.ok) {
        setTitle("");
        setComment("");
        setRating(5);
        fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-primary-800 mb-4">
        Customer Reviews
      </h2>

      {reviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-5 w-5 ${star <= averageRating
                    ? "text-yellow-400"
                    : "text-gray-300"
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-primary-600">({reviews.length} reviews)</span>
          </div>
        </div>
      )}

      {/* Auth check removed - Review Form always visible */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 border border-beige-300 rounded-lg">
        <h3 className="font-semibold mb-4">Write a Review</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`h-8 w-8 ${star <= rating ? "text-yellow-400" : "text-primary-300"
                  }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-beige-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-beige-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-beige-200 pb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">
                  {review.user.name || review.user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating
                        ? "text-yellow-400"
                        : "text-primary-300"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <span className="text-sm text-primary-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.title && (
              <h4 className="font-semibold mb-2">{review.title}</h4>
            )}
            {review.comment && <p className="text-primary-700">{review.comment}</p>}
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-primary-600">No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
}
