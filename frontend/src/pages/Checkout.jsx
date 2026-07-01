import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || cart.length === 0) { navigate('/cart'); return null; }

  const submit = async e => {
    e.preventDefault();
    if (!address.trim()) { setError('Please enter a delivery address.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/orders/', {
        address,
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty }))
      });
      clearCart();
      navigate('/orders', { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Order placement failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <h1 className="page-title">Checkout</h1>
      <div className="sidebar-layout">
        <form onSubmit={submit} className="card">
          <h3 style={{marginBottom:16}}>Delivery Information</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Full Name</label>
            <input className="input" value={user.username} readOnly style={{background:'var(--bg)'}} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="input" value={user.email} readOnly style={{background:'var(--bg)'}} />
          </div>
          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea className="input" rows={4} required placeholder="Enter your full delivery address..." value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <div style={{padding:'12px 0', borderTop:'1px solid var(--border)', marginTop:8}}>
            <p style={{fontSize:13, color:'var(--muted)'}}>💳 Payment is Cash on Delivery (simulated)</p>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString()}`}
          </button>
        </form>

        <div className="card" style={{alignSelf:'start'}}>
          <h3 style={{marginBottom:12}}>Order Items</h3>
          {cart.map(item => (
            <div key={item.id} style={{display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:14}}>
              <div>
                <div style={{fontWeight:500}}>{item.name}</div>
                <div style={{fontSize:12, color:'var(--muted)'}}>Qty: {item.qty} × ₹{parseFloat(item.price).toLocaleString()}</div>
              </div>
              <div style={{fontWeight:600}}>₹{(parseFloat(item.price)*item.qty).toLocaleString()}</div>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
