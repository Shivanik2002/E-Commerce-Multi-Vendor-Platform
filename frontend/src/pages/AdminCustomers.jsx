import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users/')
      .then((r) => {
        const allUsers = Array.isArray(r.data)
          ? r.data
          : r.data.results || [];

        setCustomers(
          allUsers.filter(
            (u) => u.role === 'customer'
          )
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter(c => {
    const term = search.toLowerCase();
    return (c.email || '').toLowerCase().includes(term) || 
           (c.username || '').toLowerCase().includes(term);
  });

  if (loading) {
    return (
      <div className="loading container">
        Loading Customers...
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">
        🛍️ Customers
      </h1>

      <div className="flex-gap" style={{ marginBottom: '20px' }}>
        <input
          className="input"
          placeholder="Search customers by email or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>
                    No customers matched your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.username || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No username</span>}</td>
                    <td>{c.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}