import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

const ReadingListPage = () => {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (user?.readingList) {
      setBooks(user.readingList);
    }
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Reading List</h1>
      
      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your reading list is empty.</p>
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Browse books to add some!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard 
              key={book._id} 
              book={book} 
              isInReadingList={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingListPage;