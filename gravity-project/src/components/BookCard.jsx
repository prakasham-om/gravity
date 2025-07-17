import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, isInReadingList }) => {
  const { user, addToReadingList, removeFromReadingList } = useAuth();

  const handleReadingListClick = (e) => {
    e.preventDefault();
    if (isInReadingList) {
      removeFromReadingList(book._id);
    } else {
      addToReadingList(book._id);
    }
  };

  return (
    <Link
      to={`/books/${book._id}`}
      className="
        block
        w-full
        bg-white
        rounded-xl
        shadow-md
        overflow-hidden
        hover:shadow-xl
        transition-shadow
        duration-300
        ease-in-out
        "
      aria-label={`View details of ${book.title}`}
    >
      <div className="relative group">
        <img
          src={book.coverImage || '/default-book-cover.jpg'}
          alt={book.title}
          className="w-full h-44 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {user && (
          <button
            onClick={handleReadingListClick}
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-semibold
              shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                isInReadingList
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              }
            `}
            aria-label={isInReadingList ? 'Remove from reading list' : 'Add to reading list'}
            title={isInReadingList ? 'Remove from reading list' : 'Add to reading list'}
          >
            {isInReadingList ? 'Remove' : 'Add'}
          </button>
        )}
      </div>
      <div className="p-5">
        <h3
          className="text-lg font-semibold text-gray-900 truncate"
          title={book.title}
        >
          {book.title}
        </h3>
        <p
          className="text-gray-600 text-sm mb-3 truncate"
          title={`Author: ${book.author}`}
        >
          by {book.author}
        </p>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(book.averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span
            className="text-xs text-gray-500 font-medium"
            title={`${book.ratingsCount} reviews`}
          >
            ({book.ratingsCount})
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
