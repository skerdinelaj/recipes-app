import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = currentUser
    ? `${currentUser.name[0]}${currentUser.surname[0]}`.toUpperCase()
    : '';

  return (
    <nav className="bg-white border-b border-amber-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/recipes" className="flex items-center gap-2 text-amber-600 font-bold text-xl">
          <span className="text-2xl">🍳</span>
          RecipeBook
        </Link>

        {currentUser && (
          <div className="flex items-center gap-4">
            <Link
              to="/add-recipe"
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              + Add Recipe
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                {initials}
              </div>
              <span className="text-sm text-gray-600 hidden sm:block">
                {currentUser.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
