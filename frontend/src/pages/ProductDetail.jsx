import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');

    api
      .get(`/products/${id}/`)
      .then((response) => {
        setProduct(response.data);
        if (response.data.images?.length > 0) {
          setSelectedImage(response.data.images[0].image);
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.detail ||
          'Failed to load product.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading container">
        ⏳ Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ maxWidth: '600px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/products')}
        >
          ← Back to Marketplace
        </button>

        <div className="empty" style={{ marginTop: 24 }}>
          <h3>Unable to load product</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="empty">
          <h3>Product not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 24 }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="product-detail card" style={{ padding: '32px' }}>
        {/* Images Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="product-img">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{ fontSize: '72px' }}>📦</div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={product.name}
                  onClick={() => setSelectedImage(img.image)}
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    border: selectedImage === img.image
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border)',
                    boxShadow: selectedImage === img.image
                      ? '0 0 10px rgba(6, 182, 212, 0.4)'
                      : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="product-info">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-delivered">
              {product.category_name}
            </span>
            {product.stock === 0 && (
              <span className="badge badge-cancelled">
                Out of Stock
              </span>
            )}
          </div>

          <h1 style={{ marginTop: '12px' }}>{product.name}</h1>

          <p className="text-muted" style={{ fontSize: '14px' }}>
            Vendor Store: <b style={{ color: 'var(--text)' }}>{product.vendor_name}</b>
          </p>

          <div className="price">
            ₹{parseFloat(product.price).toLocaleString()}
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              margin: '12px 0 16px',
              fontSize: '14.5px',
              lineHeight: '1.6',
              color: 'var(--muted)'
            }}
          >
            {product.description || <span style={{ fontStyle: 'italic' }}>No description provided.</span>}
          </div>

          <p className="text-muted" style={{ marginBottom: '24px' }}>
            Available Inventory Count: <b style={{ color: 'var(--text)' }}>{product.stock}</b>
          </p>

          {(!user || user.role === 'customer') && product.stock > 0 && (
            <button
              className="btn btn-primary"
              style={{ padding: '16px 32px', fontSize: '15px' }}
              onClick={() => {
                addToCart(product);
                navigate('/cart');
              }}
            >
              🛒 Add to Shopping Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}