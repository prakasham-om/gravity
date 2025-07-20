import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinkClass = (isActive) =>
    `block px-4 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          BookClub
        </Link>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none focus:text-blue-600"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)}>
                Browse
              </NavLink>
              <NavLink to="/add-book" className={({ isActive }) => navLinkClass(isActive)}>
                ➕ Add Book
              </NavLink>
              <NavLink to="/reading-list" className={({ isActive }) => navLinkClass(isActive)}>
                My Reading List
              </NavLink>
              <button
                onClick={logout}
                className="text-sm px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
              <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => navLinkClass(isActive)}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => navLinkClass(isActive)}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          <div className="flex flex-col space-y-2">
            {user ? (
              <>
                <NavLink onClick={closeMenu} to="/" className={({ isActive }) => navLinkClass(isActive)}>
                  Browse
                </NavLink>
                <NavLink onClick={closeMenu} to="/add-book" className={({ isActive }) => navLinkClass(isActive)}>
                  ➕ Add Book
                </NavLink>
                <NavLink
                  onClick={closeMenu}
                  to="/reading-list"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  My Reading List
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="text-sm text-left px-4 py-2 rounded-md text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
                <span className="px-4 text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <NavLink onClick={closeMenu} to="/login" className={({ isActive }) => navLinkClass(isActive)}>
                  Login
                </NavLink>
                <NavLink onClick={closeMenu} to="/register" className={({ isActive }) => navLinkClass(isActive)}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
