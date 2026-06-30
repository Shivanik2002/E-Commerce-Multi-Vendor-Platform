import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const image =
    product.images?.length > 0
      ? product.images[0].image
      : '/placeholder-product.png';

  return (
    <Link
      to={`/products/${product.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
      }}
    >
      <div
        className="card"
        style={{
          cursor: 'pointer',
          height: '100%'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '12px 0'
          }}
        >
          <img
            src={image}
            alt={product.name}
            className="product-image"
            style={{
              width: '100%',
              height: '220px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        </div>

        <h3>{product.name}</h3>

        <p>{product.vendor_name}</p>

        <p>{product.category_name}</p>

        <div className="price">
          ₹{parseFloat(product.price).toLocaleString()}
        </div>

        <p style={{ fontSize: 12 }}>
          Stock: {product.stock}
        </p>

        {(!user || user.role === 'customer') &&
          product.stock > 0 && (
            <button
              className="btn btn-primary btn-sm"
              style={{
                marginTop: 10,
                width: '100%'
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          )}
      </div>
    </Link>
  );
}