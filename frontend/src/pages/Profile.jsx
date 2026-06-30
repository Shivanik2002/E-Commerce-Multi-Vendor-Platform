import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    shop_name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/auth/me/')
      .then(res => {
        const d = res.data;
        setForm({
          username: d.username || '',
          email: d.email || '',
          phone: d.phone || '',
          address: d.address || '',
          shop_name: d.shop_name || '',
          description: d.description || '',
        });
      })
      .catch(err => {
        setError('Failed to fetch profile details.');
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };

      if (user?.role === 'vendor') {
        payload.shop_name = form.shop_name;
        payload.description = form.description;
      }

      const res = await api.patch('/auth/me/', payload);
      setSuccess('Profile details saved successfully!');
      setUser(res.data);
    } catch (err) {
      const d = err.response?.data;
      setError(d?.detail || d?.email?.[0] || d?.username?.[0] || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading container">⏳ Loading profile details...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 className="page-title">Settings</h1>

      <form className="card" onSubmit={submit} style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>
          👤 Personal Account Information
        </h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label>Username</label>
            <input
              className="input"
              type="text"
              required
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Account Role</label>
            <input
              className="input"
              type="text"
              value={user?.role?.toUpperCase() || ''}
              disabled
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', cursor: 'not-allowed', color: 'var(--primary)', fontWeight: '700' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="input"
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              className="input"
              type="text"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label>Delivery Address</label>
          <textarea
            className="input"
            rows="3"
            placeholder="Enter shipping address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            style={{ resize: 'vertical' }}
          />
        </div>

        {user?.role === 'vendor' && (
          <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>
              🏪 Vendor Shop Settings
            </h2>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>Shop Name</label>
              <input
                className="input"
                type="text"
                required
                value={form.shop_name}
                onChange={e => setForm({ ...form, shop_name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Shop Description / Bio</label>
              <textarea
                className="input"
                rows="4"
                placeholder="Enter description of your shop"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        <button className="btn btn-primary" disabled={loading} style={{ width: '200px', marginTop: '12px' }}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
