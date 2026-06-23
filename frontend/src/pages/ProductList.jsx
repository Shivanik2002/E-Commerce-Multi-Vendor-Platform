import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [products,   setProducts]  = useState([]);
  const [categories, setCategories]= useState([]);
  const [search,   setSearch]      = useState('');
  const [category, setCategory]    = useState('');
  const [loading,  setLoading]     = useState(false);

  useEffect(() => {
    api.get('/products/categories/').then(r => setCategories(Array.isArray(r.data) ? r.data : []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)   params.append('search', search);
    if (category) params.append('category', category);
    api.get(`/products/?${params}`).then(r => {
      setProducts(Array.isArray(r.data) ? r.data : r.data.results || []);
    }).finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="container">
      <h1 className="page-title">All Products</h1>
      <div className="search-bar">
        <input className="input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input" style={{ maxWidth:200 }} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        {(search || category) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setCategory(''); }}>Clear</button>
        )}
      </div>
      {loading ? <div className="loading">Loading...</div> :
        products.length === 0
          ? <div className="empty"><h3>No products found</h3><p>Try a different search or category.</p></div>
          : <div className="grid-3">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
      }
    </div>
  );
}
