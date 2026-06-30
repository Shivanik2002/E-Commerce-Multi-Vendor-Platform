import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="empty">
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
          <h3>Your shopping cart is empty</h3>
          <p style={{ marginBottom: '24px' }}>Browse products and add items to your cart to checkout.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Marketplace →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex-between">
        <h1 className="page-title" style={{ margin: 0 }}>Shopping Cart</h1>
        <button className="btn btn-danger btn-sm" onClick={clearCart}>
          Clear All Items
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', marginTop: '24px' }}>
        {/* Items List */}
        <div className="card" style={{ padding: '24px' }}>
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              {/* Product Thumbnail */}
              <div
                style={{
                  width: 90,
                  height: 90,
                  flexShrink: 0,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)'
                }}
              >
                <img
                  src={
                    item.images?.length > 0
                      ? item.images[0].image
                      : '/placeholder-product.png'
                  }
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              </div>

              {/* Item Info */}
              <div className="cart-item-info">
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
                  {item.name}
                </h4>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '4px 0' }}>
                  Store: {item.vendor_name}
                </p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>
                  ₹{parseFloat(item.price).toLocaleString()}
                </p>
              </div>

              {/* Qty Controls */}
              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateQty(item.id, item.qty - 1)}
                >
                  −
                </button>
                <span
                  style={{
                    fontWeight: 700,
                    minWidth: 24,
                    textAlign: 'center',
                    fontSize: '15px'
                  }}
                >
                  {item.qty}
                </span>
                <button
                  className="qty-btn"
                  onClick={() => updateQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div
                style={{
                  minWidth: 110,
                  textAlign: 'right',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: 'var(--text)'
                }}
              >
                ₹{(parseFloat(item.price) * item.qty).toLocaleString()}
              </div>

              {/* Delete Item */}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.id)}
                style={{ padding: '8px 12px', minWidth: 'auto' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              Order Summary
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--muted)' }}>
                  <span style={{ maxWidth: '70%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.name} <span style={{ color: 'var(--text)' }}>× {item.qty}</span>
                  </span>
                  <span>₹{(parseFloat(item.price) * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px', fontWeight: '800' }}>
                ₹{total.toLocaleString()}
              </span>
            </div>

            {user ? (
              <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
                Proceed to Checkout →
              </button>
            ) : (
              <button className="btn btn-primary btn-block" onClick={() => navigate('/login?redirect=checkout')}>
                🔐 Login to Place Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
