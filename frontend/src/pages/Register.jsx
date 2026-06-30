import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ username:'', email:'', password:'', role:'customer' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await api.post('/auth/register/', form);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const d = err.response?.data;
      setError(d?.email?.[0] || d?.username?.[0] || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)' }}>
      <form className="form-card" onSubmit={submit} style={{ width: '100%' }}>
        <h1>Sign Up</h1>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="form-group">
          <label>Username</label>
          <input
            className="input"
            required
            placeholder="johndoe"
            value={form.username}
            onChange={e => setForm({...form, username:e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            className="input"
            type="email"
            required
            placeholder="john@example.com"
            value={form.email}
            onChange={e => setForm({...form, email:e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={e => setForm({...form, password:e.target.value})}
              style={{ paddingRight: '48px' }}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Register As</label>
          <select
            className="input"
            value={form.role}
            onChange={e => setForm({...form, role:e.target.value})}
          >
            <option value="customer">🛍️ Customer (Browse and Buy)</option>
            <option value="vendor">🏪 Vendor (Sell Products)</option>
          </select>
        </div>

        <button className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '16px' }}>
          {loading ? '📝 Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-muted" style={{ textAlign:'center', marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color:'var(--primary)', fontWeight: '600' }}>Log In</Link>
        </p>
      </form>
    </div>
  );
}
