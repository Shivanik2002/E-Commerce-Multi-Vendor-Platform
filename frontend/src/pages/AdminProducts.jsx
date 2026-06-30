import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products/')
      .then((r) => {
        setProducts(
          Array.isArray(r.data)
            ? r.data
            : r.data.results || []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => {
    const term = search.toLowerCase();
    return (p.name || '').toLowerCase().includes(term) || 
           (p.category_name || '').toLowerCase().includes(term) ||
           (p.vendor_name || '').toLowerCase().includes(term);
  });

  if (loading) {
    return (
      <div className="loading container">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">
        📦 Products
      </h1>

      <div className="flex-gap" style={{ marginBottom: '20px' }}>
        <input
          className="input"
          placeholder="Search products by name, category, or vendor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>
                    No products matched your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.vendor_name}</td>
                    <td>{p.category_name}</td>
                    <td>₹{parseFloat(p.price).toLocaleString()}</td>
                    <td>{p.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}