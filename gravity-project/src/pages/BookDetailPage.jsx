import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/socketContext';

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, addToReadingList, removeFromReadingList } = useAuth();
  const { reviews: liveReviews } = useSocket();

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://gravity-b434.onrender.com/api/v1/books/${id}`);
      setBook(res.data.data.book);
      setReviews(res.data.data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await axios.post(`https://gravity-b434.onrender.com/api/v1/reviews/${id}`, reviewData);
    } catch (err) {
      console.error(err);
    }
  };

  // Merge reviews uniquely
  const mergedReviews = [
    ...liveReviews.filter(r => r.book === id || r.book?._id === id),
    ...reviews,
  ].reduce((acc, curr) => {
    if (!acc.some(r => r._id === curr._id)) acc.push(curr);
    return acc;
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-base animate-pulse">Loading book details...</p>
      </div>
    );

  if (!book)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-base">Book not found.</p>
      </div>
    );

  // Smaller button style
  const buttonClass =
    'inline-block px-5 py-2 rounded-lg font-semibold text-white transition-transform ' +
    'shadow-md focus:outline-none focus:ring-3 focus:ring-offset-1 focus:ring-indigo-400 ' +
    'transform hover:scale-[1.07] active:scale-95 ';

  const addBtnClass = buttonClass + ' bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-sm';
  const removeBtnClass = buttonClass + ' bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-sm';

  return (
    <main className="container max-w-4xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-semibold mb-8 text-sm"
        aria-label="Back to catalog"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Catalog
      </Link>

      {/* Smaller Book Card */}
      <section className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg border border-indigo-300 overflow-hidden flex flex-col md:flex-row">
        {/* Book Cover */}
        <img
          src={book.coverImage || '/default-book-cover.jpg'}
          alt={`Cover of ${book.title}`}
          className="w-full md:w-1/3 object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none shadow-md"
          loading="lazy"
        />

        {/* Book Details */}
        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-indigo-900 mb-2 tracking-tight">{book.title}</h1>
            <p className="text-base text-indigo-700 mb-5 italic tracking-wide">by {book.author}</p>

            <div className="flex items-center mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(book.averageRating) ? 'text-yellow-400' : 'text-indigo-200'
                  } transition-colors duration-300`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-3 text-indigo-700 text-xs font-semibold tracking-wide">
                {book.averageRating.toFixed(1)} ({book.ratingsCount} reviews)
              </span>
            </div>

            <p className="text-indigo-800 leading-relaxed mb-6 whitespace-pre-line text-sm">
              {book.description || 'No description available.'}
            </p>

            <div className="grid grid-cols-2 gap-6 text-indigo-700 font-semibold text-xs">
              <div className="bg-indigo-100 rounded-lg py-2 px-4 shadow-inner">
                <p className="uppercase tracking-widest mb-1 text-indigo-500">Genre</p>
                <p>{book.genre || 'N/A'}</p>
              </div>
              <div className="bg-indigo-100 rounded-lg py-2 px-4 shadow-inner">
                <p className="uppercase tracking-widest mb-1 text-indigo-500">Published Year</p>
                <p>{book.publishedYear || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Small Action Button */}
          {user && (
            <div className="mt-8">
              {user.readingList?.some((b) => b._id === book._id) ? (
                <button
                  onClick={() => removeFromReadingList(book._id)}
                  className={removeBtnClass}
                  aria-label="Remove from Reading List"
                  type="button"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => addToReadingList(book._id)}
                  className={addBtnClass}
                  aria-label="Add to Reading List"
                  type="button"
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mt-14 max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-indigo-900 mb-8 border-b-2 border-indigo-300 pb-2 tracking-wide">
          Reviews
        </h2>

        {user && (
          <div className="mb-10 bg-white rounded-xl shadow-md p-5">
            <ReviewForm onSubmit={handleReviewSubmit} />
          </div>
        )}

        {mergedReviews.length > 0 ? (
          <ReviewList  bookId={book._id} review={mergedReviews} />
        ) : (
          <p className="text-indigo-600 text-base italic text-center py-8">
            No reviews yet. Be the first to leave one!
          </p>
        )}
      </section>
    </main>
  );
};

export default BookDetailPage;
