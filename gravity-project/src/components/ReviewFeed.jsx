import { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const ReviewFeed = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  let socket;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/books/${bookId}/reviews`);
        setReviews(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    socket = io(API_URL, { withCredentials: true });

    socket.on('newReview', (review) => {
      if (review.book === bookId) {
        setReviews(prev => [review, ...prev]);
      }
    });

    socket.on('updatedReview', (updated) => {
      setReviews(prev => prev.map(r => r._id === updated._id ? updated : r));
    });

    socket.on('deletedReview', (deletedId) => {
      setReviews(prev => prev.filter(r => r._id !== deletedId));
    });

    return () => socket.disconnect();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      if (editingReviewId) {
        const res = await axios.put(`${API_URL}/api/v1/reviews/${editingReviewId}`, { comment, rating });
        setEditingReviewId(null);
      } else {
        await axios.post(`${API_URL}/api/v1/books/${bookId}/reviews`, { comment, rating });
      }
      setComment('');
      setRating(5);
    } catch (err) {
      alert(err.response?.data?.error || 'Review submission failed.');
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setComment(review.comment);
    setRating(review.rating);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`${API_URL}/api/v1/reviews/${id}`);
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-4">
      <h4>Reviews</h4>

      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-control mb-2"
              placeholder="Write your review..."
              required
            />
          </div>
          <div className="mb-2">
            Rating:
            {[1, 2, 3, 4, 5].map((r) => (
              <label key={r} className="mx-1">
                <input
                  type="radio"
                  name="rating"
                  value={r}
                  checked={rating === r}
                  onChange={() => setRating(r)}
                />{' '}
                {r}
              </label>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">
            {editingReviewId ? 'Update Review' : 'Post Review'}
          </button>
          {editingReviewId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingReviewId(null);
                setComment('');
                setRating(5);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="list-group">
          {reviews.map((review) => (
            <div key={review._id} className="list-group-item mb-3">
              <div className="d-flex justify-content-between">
                <h6>{review.user?.username || 'Unknown User'}</h6>
                <div>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <p className="mb-1">{review.comment}</p>
              <small className="text-muted">
                {new Date(review.createdAt).toLocaleString()}
              </small>
              {user?.id === review.user?._id && (
                <div className="mt-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="btn btn-sm btn-outline-warning me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewFeed;
