import { useState } from 'react';
import { useSocket } from '../context/socketContext';
import { useAuth } from '../context/AuthContext';

const ReviewList = () => {
  const { reviews, socket, setReviews } = useSocket();
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (reviewId) => {
    if (!replyText.trim()) return;

    socket.emit('addReply', {
      reviewId,
      text: replyText,
    });

    setReplyText('');
    setReplyingTo(null);
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border p-4 rounded shadow">
          <p><strong>{review.user?.email}</strong>:</p>
          <p>{review.reviewText}</p>
          <p>Rating: {review.rating}/5</p>

          <div className="ml-4 mt-2 space-y-2">
            {review.replies?.map((reply) => (
              <div key={reply._id} className="text-sm text-gray-600">
                → <strong>{reply.user?.email || 'User'}</strong>: {reply.text}
              </div>
            ))}
          </div>

          {replyingTo === review._id ? (
            <div className="mt-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="border px-2 py-1 text-sm"
                placeholder="Write a reply..."
              />
              <button
                onClick={() => handleReply(review._id)}
                className="ml-2 text-sm text-blue-600"
              >
                Send
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="ml-2 text-sm text-gray-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setReplyingTo(review._id)}
              className="text-sm text-blue-500 mt-2"
            >
              Reply
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
