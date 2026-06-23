import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ username:'', email:'', password:'', role:'customer' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
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
    <div className="container">
      <form className="form-card" onSubmit={submit}>
        <h1>Create Account</h1>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="form-group">
          <label>Username</label>
          <input className="input" required value={form.username} onChange={e => setForm({...form, username:e.target.value})} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="input" type="email" required value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="input" type="password" required minLength={6} value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
        </div>
        <div className="form-group">
          <label>Register as</label>
          <select className="input" value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        <p className="text-muted" style={{ textAlign:'center', marginTop:12 }}>
          Already registered? <Link to="/login" style={{ color:'var(--primary)' }}>Login</Link>
        </p>
      </form>
    </div>
  );
}
