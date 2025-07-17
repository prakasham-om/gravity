import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BookList from '../components/books/BookList';
import SearchBar from '../components/books/SearchBar';
import api from '../services/api';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get('/books', {
          params: { search: searchTerm }
        });
        setBooks(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>Book Catalog</h1>
        </Col>
        <Col md={6}>
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </Col>
      </Row>
      <BookList books={books} loading={loading} error={error} />
    </Container>
  );
};

export default BooksPage;