import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [products,   setProducts]  = useState([]);
  const [categories, setCategories]= useState([]);
  const [search,   setSearch]      = useState('');
  const [category, setCategory]    = useState('');
  const [loading,  setLoading]     = useState(false);
  const [vendorName, setVendorName]= useState('');

  const { search: urlSearch } = useLocation();
  const queryParams = new URLSearchParams(urlSearch);
  const vendorParam = queryParams.get('vendor');

  useEffect(() => {
    api.get('/products/categories/').then(r => setCategories(Array.isArray(r.data) ? r.data : []));
  }, []);

  useEffect(() => {
    if (vendorParam) {
      api.get(`/vendors/${vendorParam}/`)
        .then(res => {
          setVendorName(res.data.shop_name);
        })
        .catch(() => {
          setVendorName('Vendor Store');
        });
    } else {
      setVendorName('');
    }
  }, [vendorParam]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)   params.append('search', search);
    if (category) params.append('category', category);
    if (vendorParam) params.append('vendor', vendorParam);

    api.get(`/products/?${params}`).then(r => {
      setProducts(Array.isArray(r.data) ? r.data : r.data.results || []);
    }).finally(() => setLoading(false));
  }, [search, category, vendorParam]);

  return (
    <div className="container">
      <h1 className="page-title">
        {vendorName ? `🛒 Products from ${vendorName}` : 'Marketplace'}
      </h1>

      {vendorName && (
        <div style={{ marginBottom: '20px' }}>
          <Link to="/products" className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setCategory(''); }}>
            ← View All Shops
          </Link>
        </div>
      )}

      {/* Modern category filter pills */}
      <div className="pill-scroll">
        <button
          className={`pill ${category === '' ? 'active' : ''}`}
          onClick={() => setCategory('')}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`pill ${category === c.slug ? 'active' : ''}`}
            onClick={() => setCategory(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="search-bar" style={{ marginBottom: '32px' }}>
        <input
          className="input"
          placeholder="🔍 Search products by name or details..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '260px' }}
        />
        {(search || category || vendorParam) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setSearch(''); setCategory(''); }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">
          ⏳ Loading marketplace products...
        </div>
      ) : products.length === 0 ? (
        <div className="empty">
          <h3>No products found</h3>
          <p>Try entering a different query or browsing a different category.</p>
        </div>
      ) : (
        <div className="grid-3">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
