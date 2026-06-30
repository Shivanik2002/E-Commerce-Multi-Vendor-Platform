import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, clearCart } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const dropdownRef = useRef();

  const cls = (path) => (pathname === path ? 'active' : '');

  const handleLogout = () => {
    setDropdownOpen(false);
    clearCart();
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Sync theme with body class
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🛒 MultiVendor
      </Link>

      <div className="nav-group">
        <Link to="/" className={cls('/')}>
          Home
        </Link>

        <Link to="/products" className={cls('/products')}>
          Products
        </Link>

        <Link to="/vendors" className={cls('/vendors')}>
          Stores
        </Link>

        <a href="/report/index.html" target="_blank" rel="noopener noreferrer">
          Report
        </a>

        {(!user || user.role === 'customer') && (
          <Link to="/cart" className={cls('/cart')} title="Cart">
            🛒 {count > 0 && `(${count})`}
          </Link>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px',
            marginLeft: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          title="Toggle Light/Dark Mode"
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤 {user.username} <span style={{ fontSize: '10px' }}>▼</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  {user.role.toUpperCase()} ACCOUNT
                </div>
                
                <Link to="/profile" className="dropdown-item">
                  ⚙️ My Profile
                </Link>

                {/* Customer Menu */}
                {user.role === 'customer' && (
                  <Link to="/orders" className="dropdown-item">
                    📦 My Orders
                  </Link>
                )}

                {/* Vendor Menu */}
                {user.role === 'vendor' && (
                  <>
                    <Link to="/vendor" className="dropdown-item">
                      📊 Dashboard
                    </Link>
                    <Link to="/vendor/products" className="dropdown-item">
                      🏷️ My Products
                    </Link>
                    <Link to="/vendor/orders" className="dropdown-item">
                      📋 Received Orders
                    </Link>
                  </>
                )}

                {/* Admin Menu */}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="dropdown-item">
                      📊 Dashboard
                    </Link>
                    <Link to="/admin/vendors" className="dropdown-item">
                      🤝 Manage Vendors
                    </Link>
                    <Link to="/admin/products" className="dropdown-item">
                      🏷️ Manage Products
                    </Link>
                    <Link to="/admin/orders" className="dropdown-item">
                      📋 Manage Orders
                    </Link>
                    <Link to="/admin/users" className="dropdown-item">
                      👥 Manage Users
                    </Link>
                    <Link to="/admin/customers" className="dropdown-item">
                      👤 Manage Customers
                    </Link>
                  </>
                )}

                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={cls('/login')}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}