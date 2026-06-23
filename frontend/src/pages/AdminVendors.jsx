import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/vendors/').then(r => setVendors(Array.isArray(r.data) ? r.data : r.data.results || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const approve = async id => { await api.patch(`/vendors/${id}/approve/`); load(); };
  const reject  = async id => { await api.patch(`/vendors/${id}/reject/`);  load(); };

  if (loading) return <div className="loading container">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Vendor Management</h1>
      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>
                    No vendors registered yet.
                  </td>
                </tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <b>{v.shop_name}</b>
                    </td>

                    <td>{v.username}</td>

                    <td>{v.email}</td>

                    <td>
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          v.is_approved
                            ? 'badge-approved'
                            : 'badge-pending-approval'
                        }`}
                      >
                        {v.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>

                    <td>
                      <div className="flex-gap">
                        {!v.is_approved && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => approve(v.id)}
                          >
                            Approve
                          </button>
                        )}

                        {v.is_approved && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => reject(v.id)}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
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
