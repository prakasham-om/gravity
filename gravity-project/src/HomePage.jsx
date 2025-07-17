import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Welcome to Book Club</h1>
      <p className="lead">
        {user ? `Hello, ${user.username}!` : 'Join our community of book lovers!'}
      </p>
      <div className="mt-4">
        <Link to="/books" className="btn btn-primary btn-lg me-3">
          Browse Books
        </Link>
        {user ? (
          <Link to="/reading-list" className="btn btn-success btn-lg">
            My Reading List
          </Link>
        ) : (
          <Link to="/register" className="btn btn-outline-primary btn-lg">
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;