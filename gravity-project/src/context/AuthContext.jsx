import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]); // ✅ FIXED name
  const navigate = useNavigate();

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  const loadUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/auth/me');
      setUser(res.data.data.user);
    } catch (err) {
      logout(); // token invalid or expired
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      const token = res.data.token;
      setToken(token);
      setAuthToken(token);
      await loadUser();
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', formData);
      const token = res.data.token;
      setToken(token);
      setAuthToken(token);
      await loadUser();
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/login');
  };

  const addBook = async (bookData) => {
    try {
      await axios.post('http://localhost:5000/api/v1/books', bookData);
      toast.success('Book added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book');
      throw err;
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/books');
      setBooks(res.data.data.books); // ✅ FIXED setter name
    } catch (err) {
      toast.error('Failed to load books');
      console.error(err);
    }
  };

  const addToReadingList = async (bookId) => {
    try {
      await axios.post(`http://localhost:5000/api/v1/books/${bookId}/reading-list`);
      await loadUser();
      toast.success('Added to your reading list');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to reading list');
    }
  };

  const removeFromReadingList = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/books/${bookId}/reading-list`);
      await loadUser();
      toast.success('Removed from your reading list');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove from reading list');
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setAuthToken(storedToken);
      setToken(storedToken);
      loadUser();
    } else {
      setLoading(false);
    }
    fetchBooks(); // ✅ Always fetch books on startup
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        books,
        fetchBooks,
        addBook,
        register,
        login,
        logout,
        addToReadingList,
        removeFromReadingList,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
