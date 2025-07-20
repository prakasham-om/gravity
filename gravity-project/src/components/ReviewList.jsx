import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/socketContext';

const ReviewList = ({ bookId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`https://gravity-b434.onrender.com/api/v1/reviews/${bookId}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  useEffect(() => {
    fetchReviews();

    if (socket) {
      socket.on('newReview', fetchReviews);
      return () => {
        socket.off('newReview');
      };
    }
  }, [bookId, socket]);

  const renderStars = (count) => {
    return [...Array(5)].map((_, index) => (
      <span key={index}>
        {index < count ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Reviews</h2>
      {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
      {reviews.map((review) => (
        <div
          key={review._id}
          className="mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100"
        >
          <div className="mb-2 text-gray-800">
            <strong>{review.user?.name || 'Anonymous'}</strong>
            <span className="ml-2 text-yellow-500">
              {renderStars(review.rating)}
            </span>
          </div>

          {review.reviewTexts.map((reviewText) => (
            <div
              key={reviewText._id}
              className="mb-3 border-t pt-2 border-gray-200"
            >
              <p className="text-gray-700">{reviewText.text}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
