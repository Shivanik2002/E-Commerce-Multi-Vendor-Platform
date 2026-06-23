import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="container">
      <div className="empty"><h3>Please login to view cart</h3><Link to="/login" className="btn btn-primary" style={{marginTop:12}}>Login</Link></div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="container">
      <div className="empty"><h3>Your cart is empty</h3><p>Browse products and add items to your cart.</p>
        <Link to="/products" className="btn btn-primary" style={{marginTop:12}}>Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="flex-between">
        <h1 className="page-title" style={{margin:0}}>Shopping Cart</h1>
        <button className="btn btn-danger btn-sm" onClick={clearCart}>Clear Cart</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 300px', gap:24, marginTop:16}}>
        <div className="card">
          {cart.map(item => (
            <div className="cart-item" key={item.id}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  flexShrink: 0
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
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #eee'
                  }}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              </div>

              <div className="cart-item-info">
                <h4>{item.name}</h4>

                <p>
                  ₹{parseFloat(item.price).toLocaleString()} each
                </p>

                <p>
                  Vendor: {item.vendor_name}
                </p>

                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--muted)'
                  }}
                >
                  Stock: {item.stock}
                </p>
              </div>

              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() =>
                    updateQty(item.id, item.qty - 1)
                  }
                >
                  −
                </button>

                <span
                  style={{
                    fontWeight: 600,
                    minWidth: 20,
                    textAlign: 'center'
                  }}
                >
                  {item.qty}
                </span>

                <button
                  className="qty-btn"
                  onClick={() =>
                    updateQty(item.id, item.qty + 1)
                  }
                >
                  +
                </button>
              </div>

              <div
                style={{
                  minWidth: 100,
                  textAlign: 'right',
                  fontWeight: 700
                }}
              >
                ₹
                {(
                  parseFloat(item.price) * item.qty
                ).toLocaleString()}
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div>
          <div className="card">
            <h3 style={{marginBottom:12}}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6, color:'var(--muted)'}}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{(parseFloat(item.price) * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="cart-total" style={{marginTop:12}}>
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
