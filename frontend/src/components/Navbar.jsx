import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const cls = (path) => (pathname === path ? 'active' : '');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🛒 MultiVendor
      </Link>

      <Link to="/" className={cls('/')}>
        Home
      </Link>

      <Link to="/products" className={cls('/products')}>
        Products
      </Link>

      {user ? (
        <>
          {/* Customer Only */}
          {user.role === 'customer' && (
            <>
              <Link to="/cart" className={cls('/cart')}>
                Cart {count > 0 && `(${count})`}
              </Link>

              <Link to="/orders" className={cls('/orders')}>
                My Orders
              </Link>
            </>
          )}

          {/* Vendor Only */}
          {user.role === 'vendor' && (
            <Link to="/vendor" className={cls('/vendor')}>
              Vendor Panel
            </Link>
          )}

          {/* Admin Only */}
          {user.role === 'admin' && (
            <Link to="/admin" className={cls('/admin')}>
              Admin Panel
            </Link>
          )}

          <button
            className="btn-logout"
            onClick={handleLogout}
          >
            Logout ({user.username})
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={cls('/login')}>
            Login
          </Link>

          <Link to="/register" className={cls('/register')}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
}