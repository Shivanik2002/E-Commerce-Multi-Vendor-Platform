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
      <div
        style={{
          textAlign: 'center',
          padding: '32px 0 24px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 28
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--primary)',
            marginBottom: 8
          }}
        >
          E-Commerce Multi-Vendor Platform
        </h1>

        <p
          style={{
            color: 'var(--muted)',
            fontSize: 15
          }}
        >
          Buy from multiple vendors — one seamless checkout.
        </p>

        <div
          className="flex-gap"
          style={{
            justifyContent: 'center',
            marginTop: 16
          }}
        >
          {/* Guest */}
          {!user && (
            <>
              <Link
                to="/products"
                className="btn btn-primary"
              >
                Browse Products
              </Link>

              <Link
                to="/register"
                className="btn btn-secondary"
              >
                Sell with us
              </Link>
            </>
          )}

          {/* Customer */}
          {user?.role === 'customer' && (
            <>
              <Link
                to="/products"
                className="btn btn-primary"
              >
                Browse Products
              </Link>

              <Link
                to="/orders"
                className="btn btn-secondary"
              >
                My Orders
              </Link>
            </>
          )}

          {/* Vendor */}
          {user?.role === 'vendor' && (
            <>
              <Link
                to="/vendor"
                className="btn btn-primary"
              >
                Vendor Dashboard
              </Link>

              <Link
                to="/vendor/products"
                className="btn btn-secondary"
              >
                Manage Products
              </Link>
            </>
          )}

          {/* Admin */}
          {user?.role === 'admin' && (
            <>
              <Link
                to="/admin"
                className="btn btn-primary"
              >
                Admin Dashboard
              </Link>

              <Link
                to="/admin/orders"
                className="btn btn-secondary"
              >
                Manage Orders
              </Link>
            </>
          )}
        </div>
      </div>

      <h2 className="section-title">
        Latest Products
      </h2>

      {products.length === 0 ? (
        <p className="text-muted">
          No products yet.
          {!user && (
            <>
              {' '}
              <Link to="/register">
                Register as vendor
              </Link>{' '}
              to add some.
            </>
          )}
        </p>
      ) : (
        <div className="grid-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>
      )}
    </div>
  );
}