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
      link: '/vendor/products',
      icon: '🏷️'
    },
    {
      title: '🛒 Total Orders',
      value: stats.orders || 0,
      link: '/vendor/orders',
      icon: '📋'
    },
    {
      title: '⏳ Pending Orders',
      value: stats.pending || 0,
      link: '/vendor/orders',
      icon: '⏳'
    },
    {
      title: '💰 Revenue Earned',
      value: `₹${parseFloat(
        stats.revenue || 0
      ).toLocaleString()}`,
      link: '/vendor/orders',
      icon: '💰'
    }
  ] : [];

  return (
    <div className="container">
      <div className="flex-between">
        <h1 className="page-title" style={{ margin: 0 }}>
          🏪 Vendor Panel
        </h1>
      </div>

      <p className="text-muted" style={{ marginBottom: 32 }}>
        Welcome back, <strong style={{ color: 'var(--text)' }}>{user?.username || 'Vendor'}</strong>! Manage your products, fulfill incoming orders, and track your revenue.
      </p>

      {loading ? (
        <div className="loading">
          ⏳ Loading dashboard stats...
        </div>
      ) : stats ? (
        <>
          <div className="grid-stat">
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="stat-label">{card.title}</span>
                    <span style={{ fontSize: '20px' }}>{card.icon}</span>
                  </div>
                  <div className="stat-value" style={{ fontSize: '26px', marginTop: '12px' }}>
                    {card.value}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="section-title" style={{ marginTop: 48 }}>
            ⚡ Vendor Workspace Actions
          </h2>

          <div className="grid-2">
            <div className="card">
              <h3>📦 Manage Catalog</h3>
              <p>Add new product listings with multiple images, edit inventory, manage pricing, and adjust stock counts on the fly.</p>
              <Link
                to="/vendor/products"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 20 }}
              >
                Go to Products →
              </Link>
            </div>

            <div className="card">
              <h3>🧾 Process Customer Orders</h3>
              <p>Monitor status updates for incoming orders, fulfill orders, mark them as shipped/delivered, and download receipt information.</p>
              <Link
                to="/vendor/orders"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 20 }}
              >
                Go to Orders →
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="empty">
          <h3>⚠️ Unable to load dashboard</h3>
          <p>Please try refreshing the page or check your connection status.</p>
        </div>
      )}
    </div>
  );
}