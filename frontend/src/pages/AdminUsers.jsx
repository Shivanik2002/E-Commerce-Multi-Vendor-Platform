import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    api.get('/users/')
      .then((r) => {
        setUsers(
          Array.isArray(r.data)
            ? r.data
            : r.data.results || []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u => {
    const term = search.toLowerCase();
    const matchesSearch = (u.email || '').toLowerCase().includes(term) || 
                          (u.username || '').toLowerCase().includes(term);
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="loading container">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">
        👥 Users
      </h1>

      <div className="flex-gap" style={{ marginBottom: '20px' }}>
        <input
          className="input"
          placeholder="Search users by email or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          className="input"
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>
                    No users matched your search/filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No username</span>}</td>
                    <td>{u.email}</td>
                    <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
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