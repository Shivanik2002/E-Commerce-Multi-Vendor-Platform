import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api.get('/dashboard/stats/')
      .then((res) => {
        setStats(res.data);
      })
      .catch(() => {
        setStats(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const cards = stats ? [
    {
      title: '👥 Total Users',
      value: stats.users || 0,
      link: '/admin/users'
    },
    {
      title: '🏪 Vendors',
      value: stats.vendors || 0,
      link: '/admin/vendors'
    },
    {
      title: '🛍️ Customers',
      value: stats.customers || 0,
      link: '/admin/customers'
    },
    {
      title: '📦 Products',
      value: stats.products || 0,
      link: '/admin/products'
    },
    {
      title: '🛒 Orders',
      value: stats.orders || 0,
      link: '/admin/orders'
    }
  ] : [];

  return (
    <div className="container">
      <h1 className="page-title">📊 Dashboard</h1>

      {loading ? (
        <div className="loading">
          <div style={{ fontSize: '24px' }}>
            ⏳ Loading your dashboard...
          </div>
        </div>
      ) : stats ? (
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
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                <div className="stat-label">
                  {card.title}
                </div>

                <div className="stat-value">
                  {card.value}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>⚠️ Unable to load dashboard</h3>
          <p>Please try refreshing the page</p>
        </div>
      )}
    </div>
  );
}