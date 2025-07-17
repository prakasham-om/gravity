import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';

// Set base URL for backend
axios.defaults.baseURL = 'http://localhost:5000';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const { user } = useAuth();

  // ✅ Fetch all books with filters and pagination
  const fetchBooks = async () => {
    try {
      setLoading(true);
      let url = `/api/v1/books?page=${currentPage}&limit=12`;

      if (searchTerm) url += `&title=${encodeURIComponent(searchTerm)}`;
      if (genreFilter) url += `&genre=${encodeURIComponent(genreFilter)}`;

      const res = await axios.get(url);

      // ✅ Correctly access nested data
      setBooks(res.data.data.books || []);
      setTotalPages(Math.ceil((res.data.total || 0) / 12));
    } catch (err) {
      console.error('📕 Error fetching books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch books when filters/page change
  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm, genreFilter]);

  // ✅ Search handler
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // ✅ Genre filter handler
  const handleGenreChange = (genre) => {
    setGenreFilter(genre);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="flex justify-center py-12 text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Book Catalog</h1>
        <SearchBar onSearch={handleSearch} />

        {/* Genre filter buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreChange('')}
            className={`px-3 py-1 rounded-full text-sm ${
              !genreFilter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All Genres
          </button>
          {['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Self-Help'].map(
            (genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-3 py-1 rounded-full text-sm ${
                  genreFilter === genre ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {genre}
              </button>
            )
          )}
        </div>
      </div>

      {/* Books List */}
      {books.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No books found. Try a different search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              isInReadingList={user?.readingList?.some((b) => b._id === book._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
