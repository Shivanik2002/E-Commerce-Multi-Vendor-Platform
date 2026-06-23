import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]   = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'vendor')  navigate('/vendor');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/products');
    } catch {
      setError('Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <form className="form-card" onSubmit={submit}>
        <h1>Login</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input className="input" type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="input" type="password" required value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <p className="text-muted" style={{ textAlign:'center', marginTop:12 }}>
          No account? <Link to="/register" style={{ color:'var(--primary)' }}>Register</Link>
        </p>
      </form>
    </div>
  );
}
