import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">SkillSwap</Link>
          <div className="hidden md:flex items-center space-x-6 text-gray-700 text-sm">
            <span className="cursor-pointer">SkillSwap Pro ▼</span>
            <span className="cursor-pointer">Explore ▼</span>
            <span className="cursor-pointer">English</span>
            <span className="cursor-pointer">Become a seller</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!user ? (
            <>
              <Link to="/login">
                <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md font-medium hover:bg-blue-50">Log In</button>
              </Link>
              <Link to="/signup">
                <button className="bg-blue-600 text-white px-4 py-1 rounded-md font-medium hover:bg-blue-700">Sign Up</button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center focus:outline-none"
              >
                <span className="inline-flex h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center  text-blue-700 font-bold text-lg">
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/connections"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Connections
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
