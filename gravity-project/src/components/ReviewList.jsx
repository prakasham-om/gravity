import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaReply } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/socketContext';
import { toast } from 'react-toastify';

const ReviewList = ({ bookId }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [reviews, setReviews] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [replyTexts, setReplyTexts] = useState({});

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/reviews/${bookId}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
    }
  };

  useEffect(() => {
    fetchReviews();

    if (socket) {
      socket.on('newReview', fetchReviews);
      socket.on('newReply', fetchReviews);

      return () => {
        socket.off('newReview');
        socket.off('newReply');
      };
    }
  }, [bookId, socket]);

  const handleReplyToggle = (reviewTextId) => {
    setReplyInputs((prev) => ({
      ...prev,
      [reviewTextId]: !prev[reviewTextId],
    }));
  };

  const handleReplyChange = (reviewTextId, value) => {
    setReplyTexts((prev) => ({
      ...prev,
      [reviewTextId]: value,
    }));
  };

  const handleReplySubmit = async (reviewTextId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/v1/reviews/reply/${reviewTextId}`,
        { text: replyTexts[reviewTextId] },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setReplyTexts((prev) => ({ ...prev, [reviewTextId]: '' }));
      setReplyInputs((prev) => ({ ...prev, [reviewTextId]: false }));
      toast.success('Reply added');
    } catch (error) {
      toast.error('Failed to add reply');
      console.error(error.message);
    }
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
            <span className="ml-2 text-yellow-600">Rating: {review.rating}</span>
          </div>

          {review.reviewTexts.map((reviewText) => (
            <div
              key={reviewText._id}
              className="mb-3 border-t pt-2 border-gray-200"
            >
              <p className="text-gray-700">{reviewText.text}</p>

              <div className="flex items-center justify-between mt-2">
                <button
                  className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                  onClick={() => handleReplyToggle(reviewText._id)}
                >
                  <FaReply className="mr-1" /> Reply
                </button>
              </div>

              {/* Reply Input */}
              {replyInputs[reviewText._id] && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={2}
                    placeholder="Type your reply..."
                    value={replyTexts[reviewText._id] || ''}
                    onChange={(e) =>
                      handleReplyChange(reviewText._id, e.target.value)
                    }
                  />
                  <div className="flex justify-end mt-1 space-x-2">
                    <button
                      className="px-3 py-1 text-sm bg-gray-200 rounded-md"
                      onClick={() => handleReplyToggle(reviewText._id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
                      onClick={() => handleReplySubmit(reviewText._id)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {reviewText.replies?.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {reviewText.replies.map((reply, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md"
                    >
                      <strong>{reply.user?.name || 'User'}:</strong> {reply.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
