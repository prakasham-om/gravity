import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookCard from './BookCard';

const BookList = () => {
  const { books, fetchBooks, user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.length > 0 ? (
        books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            isInReadingList={user?.readingList?.some((b) => b._id === book._id)}
          />
        ))
      ) : (
        <p className="text-gray-500">No books found.</p>
      )}
    </div>
  );
};

export default BookList;
