import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/vendors/')
      .then(res => {
        setVendors(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredVendors = vendors.filter(v => {
    const term = search.toLowerCase();
    return (v.shop_name || '').toLowerCase().includes(term) ||
           (v.description || '').toLowerCase().includes(term);
  });

  if (loading) return <div className="loading container">⏳ Loading verified stores...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Verified Stores</h1>
      
      <p className="text-muted" style={{ marginBottom: '28px' }}>
        Browse verified seller boutiques and purchase directly from local shops.
      </p>

      <div className="search-bar" style={{ marginBottom: '32px' }}>
        <input
          className="input"
          placeholder="🔍 Search stores by name or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {filteredVendors.length === 0 ? (
        <div className="empty">
          <h3>No stores found</h3>
          <p>No verified stores matched your search query.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredVendors.map(v => (
            <div className="card" key={v.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>🏪</span>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{v.shop_name}</h3>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '64px', margin: 0 }}>
                  {v.description || <span style={{ fontStyle: 'italic' }}>No shop details provided.</span>}
                </p>
              </div>
              <Link to={`/products?vendor=${v.id}`} className="btn btn-primary btn-sm" style={{ marginTop: '16px', width: '100%' }}>
                View Shop Products →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
