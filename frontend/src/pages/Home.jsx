import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/products/?limit=6')
      .then((r) => {
        setProducts(
          Array.isArray(r.data)
            ? r.data.slice(0, 6)
            : r.data.results?.slice(0, 6) || []
        );
      });
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>E-Commerce Multi-Vendor Platform</h1>
        <p>
          Discover products from independent trusted vendors, all combined into a single, high-performance checkout experience.
        </p>

        <div className="flex-gap" style={{ justifyContent: 'center' }}>
          {/* Guest */}
          {!user && (
            <>
              <Link to="/products" className="btn btn-secondary">
                Browse Marketplace
              </Link>
              <Link to="/login" className="btn btn-primary">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#fff' }}>
                Sign Up
              </Link>
            </>
          )}

          {/* Customer */}
          {user?.role === 'customer' && (
            <>
              <Link to="/products" className="btn btn-primary">
                Browse Marketplace →
              </Link>
              <Link to="/orders" className="btn btn-secondary">
                Track My Orders
              </Link>
            </>
          )}

          {/* Vendor */}
          {user?.role === 'vendor' && (
            <>
              <Link to="/vendor" className="btn btn-primary">
                Go to Vendor Dashboard
              </Link>
              <Link to="/vendor/products" className="btn btn-secondary">
                Manage My Products
              </Link>
            </>
          )}

          {/* Admin */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="btn btn-primary">
                Go to Admin Dashboard
              </Link>
              <Link to="/admin/orders" className="btn btn-secondary">
                Review System Orders
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature Value Props Grid */}
      <div className="grid-3" style={{ marginBottom: '56px' }}>
        <Link to="/products" className="card" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>One-Click Checkout</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>Combine multiple vendors' products into a single shopping cart and check out instantly.</p>
        </Link>
        <Link to="/vendors" className="card" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛡️</div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Verified Vendors</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>Shop with confidence. Every seller is vetted and approved by our system administrators.</p>
        </Link>
        <Link to={user ? "/profile" : "/register"} className="card" style={{ padding: '24px', textAlign: 'center', textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Modern Interface</h3>
          <p style={{ fontSize: '13px', margin: 0 }}>Enjoy an ultra-fast, visually polished dashboard customized with instant status updates.</p>
        </Link>
      </div>

      {/* Latest Products section */}
      <div className="flex-between" style={{ alignItems: 'baseline', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '24px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>
          🔥 Fresh Arrivals
        </h2>
        <Link to="/products" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>
          See all products →
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="empty">
          <h3>No products in marketplace</h3>
          <p>
            {!user ? (
              <>
                <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register as a vendor</Link> to list the first item!
              </>
            ) : 'Check back later.'}
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}