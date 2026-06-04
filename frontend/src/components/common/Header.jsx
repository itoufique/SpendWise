import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="text-xl md:text-2xl font-semibold tracking-tight text-white">
          SpendWise AI
        </Link>
        <nav className="flex items-center gap-4 md:gap-6 text-sm md:text-base text-slate-300">
          <Link className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition" to="/products">Products</Link>
          <Link className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition" to="/support">Support</Link>
          {user && <Link className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition" to="/wishlist">Wishlist</Link>}
          {user && <Link className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition" to="/dashboard">Dashboard</Link>}
          {user?.role === 'admin' && <Link className="px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition" to="/admin">Admin</Link>}
          {user ? (
            <button onClick={() => { logout(); navigate('/'); }} className="rounded-full bg-accent px-4 py-2 text-white transition hover:bg-purple-500">
              Logout
            </button>
          ) : (
            <Link className="rounded-full bg-white/10 px-4 py-2 text-white transition hover:bg-white/20" to="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
