import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVendor, setEditingVendor] = useState(null);
  const [editForm, setEditForm] = useState({ shop_name: '', description: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => api.get('/vendors/').then(r => setVendors(Array.isArray(r.data) ? r.data : r.data.results || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const approve = async id => { await api.patch(`/vendors/${id}/approve/`); load(); };
  const reject  = async id => { await api.patch(`/vendors/${id}/reject/`);  load(); };

  const startEdit = v => {
    setEditingVendor(v);
    setEditForm({ shop_name: v.shop_name, description: v.description || '' });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await api.patch(`/vendors/${editingVendor.id}/`, editForm);
      setEditingVendor(null);
      load();
    } catch (err) {
      alert('Failed to update vendor details.');
    }
  };

  const filteredVendors = vendors.filter(v => {
    const term = search.toLowerCase();
    const matchesSearch = (v.shop_name || '').toLowerCase().includes(term) || 
                          (v.username || '').toLowerCase().includes(term) ||
                          (v.email || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === '' ||
                          (statusFilter === 'approved' && v.is_approved) ||
                          (statusFilter === 'pending' && !v.is_approved);
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading container">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Vendor Management</h1>

      <div className="flex-gap" style={{ marginBottom: '20px' }}>
        <input
          className="input"
          placeholder="Search vendors by shop name, username, or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          className="input"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending Approval</option>
        </select>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Description</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>
                    No vendors matched your search/filter.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <b>{v.shop_name}</b>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {v.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description</span>}
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
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => startEdit(v)}
                        >
                          Edit
                        </button>

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

      {editingVendor && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px', padding: '24px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Edit Vendor Details</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Shop Name</label>
                <input
                  className="input"
                  required
                  value={editForm.shop_name}
                  onChange={e => setEditForm({ ...editForm, shop_name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                <textarea
                  className="input"
                  rows="4"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  style={{ width: '100%', resize: 'vertical', minHeight: '80px' }}
                />
              </div>
              <div className="flex-gap" style={{ justifyContent: 'flex-end', display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingVendor(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
