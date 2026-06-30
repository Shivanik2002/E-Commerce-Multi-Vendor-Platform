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
          label: '🏪 Active Vendors',
          value: stats.vendors || 0,
          link: '/admin/vendors'
        },
        {
          label: '🛍️ Customers Registered',
          value: stats.customers || 0,
          link: '/admin/customers'
        },
        {
          label: '📦 Products Cataloged',
          value: stats.products || 0,
          link: '/admin/products'
        },
        {
          label: '🛒 Combined Orders',
          value: stats.orders || 0,
          link: '/admin/orders'
        },
        {
          label: '⏳ Pending Orders',
          value: stats.pending_orders || 0,
          link: '/admin/orders'
        },
        {
          label: '💰 Platform Revenue',
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
        ⚙️ Admin Panel
      </h1>

      <p className="text-muted" style={{ marginBottom: 32 }}>
        System-wide statistics, audit tracking, vendor registrations, order pipelines, and database directories.
      </p>

      {loading ? (
        <div className="loading">
          ⏳ Loading platform statistics...
        </div>
      ) : stats ? (
        <>
          <div className="grid-stat">
            {statItems.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="stat-card" style={{ height: '100%' }}>
                  <div className="stat-label">
                    {item.label}
                  </div>
                  <div className="stat-value" style={{ fontSize: '24px', marginTop: '12px' }}>
                    {item.value}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="section-title" style={{ marginTop: 48 }}>
            ⚡ System Administration Controls
          </h2>

          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="card">
              <h3>🏪 Vendor Registrations</h3>
              <p>
                Monitor incoming seller registration requests, approve new shop requests, reject inactive vendors, and review store logs.
              </p>
              <Link
                to="/admin/vendors"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 20 }}
              >
                Manage Vendors →
              </Link>
            </div>

            <div className="card">
              <h3>📋 Global Orders Ledger</h3>
              <p>
                Oversee and track checkout orders across all platform vendors, inspect details, update fulfillment statuses, and manage cancellations.
              </p>
              <Link
                to="/admin/orders"
                className="btn btn-primary btn-sm"
                style={{ marginTop: 20 }}
              >
                View Global Orders →
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="empty">
          <h3>⚠️ Unable to load database stats</h3>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      )}
    </div>
  );
}