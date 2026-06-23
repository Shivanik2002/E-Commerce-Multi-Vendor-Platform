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
    console.log('Product ID:', id);

    setLoading(true);
    setError('');

    api
      .get(`/products/${id}/`)
      .then((response) => {
        console.log('Product Response:', response.data);

        setProduct(response.data);

        if (response.data.images?.length > 0) {
          setSelectedImage(response.data.images[0].image);
        }
      })
      .catch((err) => {
        console.error('Product Error:', err);
        console.error('Response:', err.response?.data);

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
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/products')}
        >
          ← Back
        </button>

        <div className="empty" style={{ marginTop: 20 }}>
          <h3>Unable to load product</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <h3>Product not found</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <button
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="product-detail">
        <div style={{ flex: 1 }}>
          <div
            style={{
              border: '1px solid #eee',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 12
            }}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div
                style={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 80
                }}
              >
                📦
              </div>
            )}
          </div>

          {product.images?.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap'
              }}
            >
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt={product.name}
                  onClick={() => setSelectedImage(img.image)}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    borderRadius: 8,
                    border:
                      selectedImage === img.image
                        ? '2px solid #2563eb'
                        : '1px solid #ddd'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <span className="badge badge-delivered">
            {product.category_name}
          </span>

          <h1 style={{ marginTop: 8 }}>
            {product.name}
          </h1>

          <p className="text-muted">
            Sold by: <b>{product.vendor_name}</b>
          </p>

          <div className="price">
            ₹{parseFloat(product.price).toLocaleString()}
          </div>

          <p>{product.description}</p>

          <p className="text-muted">
            In stock: {product.stock}
          </p>

          {user &&
            user.role === 'customer' &&
            product.stock > 0 && (
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={() => {
                  addToCart(product);
                  navigate('/cart');
                }}
              >
                Add to Cart
              </button>
            )}
        </div>
      </div>
    </div>
  );
}