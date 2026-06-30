import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]   = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        navigate('/' + decodeURIComponent(redirect));
      } else {
        if (user.role === 'vendor')  navigate('/vendor');
        else if (user.role === 'admin') navigate('/admin');
        else navigate('/products');
      }
    } catch {
      setError('Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 180px)' }}>
      <form className="form-card" onSubmit={submit} style={{ width: '100%' }}>
        <h1>Log In</h1>
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            className="input"
            type="email"
            required
            placeholder="name@example.com"
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
              placeholder="••••••••"
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

        <button className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '16px' }}>
          {loading ? '🔐 Authenticating...' : 'Log In'}
        </button>

        <p className="text-muted" style={{ textAlign:'center', marginTop: 20 }}>
          New to the platform? <Link to="/register" style={{ color:'var(--primary)', fontWeight: '600' }}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
