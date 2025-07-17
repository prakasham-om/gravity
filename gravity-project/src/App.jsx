import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/socketContext';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import ReadingListPage from './pages/ReadingListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AddBook from './pages/AddBookPage'; // Adjust path if needed

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="w-full max-w-7xl mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/books/:id" element={<BookDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/reading-list"
                  element={
                    <PrivateRoute>
                      <ReadingListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-book"
                  element={
                    <PrivateRoute>
                      <AddBook />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>

          <ToastContainer position="bottom-right" autoClose={3000} />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
