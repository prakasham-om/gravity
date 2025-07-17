import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          BookClub
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                Browse
              </NavLink>

              <NavLink
                to="/add-book"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                ➕ Add Book
              </NavLink>

              <NavLink
                to="/reading-list"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                My Reading List
              </NavLink>

              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>

              <span className="text-sm text-gray-500">
                Hi, {user.name.split(' ')[0]}
              </span>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
