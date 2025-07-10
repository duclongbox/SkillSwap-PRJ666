import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();


  const handleLogout = async () => {
    await logout();
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
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-1 rounded-md font-medium hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;