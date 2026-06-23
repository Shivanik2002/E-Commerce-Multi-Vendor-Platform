import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}