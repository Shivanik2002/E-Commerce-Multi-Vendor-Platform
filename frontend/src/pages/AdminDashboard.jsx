import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api.get('/dashboard/stats/')
      .then((r) => {
        setStats(r.data);
      })
      .catch(() => {
        setStats(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const statItems = stats
    ? [
        {
          label: '👥 Total Users',
          value: stats.users || 0,
          link: '/admin/users'
        },
        {
          label: '🏪 Vendors',
          value: stats.vendors || 0,
          link: '/admin/vendors'
        },
        {
          label: '🛍️ Customers',
          value: stats.customers || 0,
          link: '/admin/customers'
        },
        {
          label: '📦 Products',
          value: stats.products || 0,
          link: '/admin/vendors'
        },
        {
          label: '🛒 Total Orders',
          value: stats.orders || 0,
          link: '/admin/orders'
        },
        {
          label: '⏳ Pending Orders',
          value: stats.pending_orders || 0,
          link: '/admin/orders'
        },
        {
          label: '💰 Revenue',
          value: `₹${parseFloat(
            stats.revenue || 0
          ).toLocaleString()}`,
          link: '/admin/orders'
        }
      ]
    : [];

  return (
    <div className="container">
      <h1 className="page-title">
        ⚙️ Admin Dashboard
      </h1>

      <p
        className="text-muted"
        style={{ marginBottom: 32 }}
      >
        System Overview & Management
      </p>

      {loading ? (
        <div className="loading">
          <div style={{ fontSize: '20px' }}>
            ⏳ Loading dashboard data...
          </div>
        </div>
      ) : stats ? (
        <>
          <div className="grid-stat">
            {statItems.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div
                  className="stat-card"
                  style={{
                    cursor: 'pointer',
                    height: '100%'
                  }}
                >
                  <div className="stat-label">
                    {item.label}
                  </div>

                  <div className="stat-value">
                    {item.value}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2
            className="section-title"
            style={{ marginTop: 40 }}
          >
            Management Tools
          </h2>

          <div className="grid-2">
            <div className="card">
              <h3>🏪 Vendor Management</h3>

              <p>
                Approve or reject vendor
                registrations, monitor vendor
                activity, and manage vendor
                accounts.
              </p>

              <Link
                to="/admin/vendors"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 16 }}
              >
                Manage Vendors →
              </Link>
            </div>

            <div className="card">
              <h3>📋 Order Management</h3>

              <p>
                View and manage all customer
                orders across all vendors,
                track order status, and
                handle issues.
              </p>

              <Link
                to="/admin/orders"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 16 }}
              >
                View All Orders →
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="empty">
          <h3>
            ⚠️ Unable to load dashboard
          </h3>

          <p>
            Please try refreshing the page
          </p>
        </div>
      )}
    </div>
  );
}