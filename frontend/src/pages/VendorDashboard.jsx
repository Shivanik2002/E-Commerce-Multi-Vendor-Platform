import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function VendorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats/')
      .then((r) => {
        setStats(r.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const cards = stats ? [
    {
      title: '📦 Products Listed',
      value: stats.products || 0,
      link: '/vendor/products'
    },
    {
      title: '🛒 Total Orders',
      value: stats.orders || 0,
      link: '/vendor/orders'
    },
    {
      title: '⏳ Pending Orders',
      value: stats.pending || 0,
      link: '/vendor/orders'
    },
    {
      title: '💰 Revenue',
      value: `₹${parseFloat(
        stats.revenue || 0
      ).toLocaleString()}`,
      link: '/vendor/orders'
    }
  ] : [];

  return (
    <div className="container">
      <div className="flex-between">
        <h1 className="page-title">
          🏪 Vendor Dashboard
        </h1>
      </div>

      <p
        className="text-muted"
        style={{ marginBottom: 32 }}
      >
        Welcome back,
        <strong>
          {' '}
          {user?.username || 'Vendor'}
        </strong>
        ! 👋
      </p>

      {loading ? (
        <div className="loading">
          <div style={{ fontSize: '20px' }}>
            ⏳ Loading your dashboard...
          </div>
        </div>
      ) : stats ? (
        <>
          <div className="grid-stat">
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div
                  className="stat-card"
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <div className="stat-label">
                    {card.title}
                  </div>

                  <div
                    className="stat-value"
                    style={{
                      fontSize: '24px'
                    }}
                  >
                    {card.value}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2
            className="section-title"
            style={{ marginTop: 40 }}
          >
            Quick Actions
          </h2>

          <div className="grid-2">
            <div className="card">
              <h3>📦 Manage Products</h3>

              <p>
                Add new products, edit listings,
                manage inventory, and update
                product details.
              </p>

              <Link
                to="/vendor/products"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 16 }}
              >
                Go to Products →
              </Link>
            </div>

            <div className="card">
              <h3>🧾 Manage Orders</h3>

              <p>
                View incoming customer orders,
                update status, and manage
                fulfillment.
              </p>

              <Link
                to="/vendor/orders"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 16 }}
              >
                View Orders →
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="empty">
          <h3>⚠️ Unable to load dashboard</h3>
          <p>Please try refreshing the page</p>
        </div>
      )}
    </div>
  );
}