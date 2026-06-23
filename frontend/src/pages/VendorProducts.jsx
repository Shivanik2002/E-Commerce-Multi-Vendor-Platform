import { useEffect, useState } from 'react';
import api from '../services/api';

const EMPTY_FORM = {
  name:'',
  description:'',
  price:'',
  stock:'',
  category:'',
  images:[]
};

export default function VendorProducts() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editing, setEditing]       = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const load = () => api.get('/products/').then(r => setProducts(Array.isArray(r.data) ? r.data : r.data.results || []));

  useEffect(() => {
    load();
    api.get('/products/categories/').then(r => setCategories(Array.isArray(r.data) ? r.data : []));
  }, []);

  const openAdd  = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); setError(''); };
  const openEdit = (p) => { setForm({ name:p.name, description:p.description, price:p.price, stock:p.stock, category:p.category }); setEditing(p.id); setShowForm(true); setError(''); };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('category', form.category);

      form.images.forEach((image) => {
        formData.append('images', image);
      });

      if (editing) {
        await api.put(`/products/${editing}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/products/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setShowForm(false);
      load();

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        'Failed to save product.'
      );
    } finally {
      setLoading(false);
    }
  };

  const del = async id => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}/`); load();
  };

  return (
    <div className="container">
      <div className="flex-between">
        <h1 className="page-title" style={{margin:0}}>My Products</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="card" style={{marginBottom:20, marginTop:16}}>
          <h3 style={{marginBottom:16}}>{editing ? 'Edit Product' : 'Add New Product'}</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div className="form-group">
                <label>Product Name</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="input" required value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input className="input" type="number" min="0" step="0.01" required value={form.price} onChange={e => setForm({...form, price:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input className="input" type="number" min="0" required value={form.stock} onChange={e => setForm({...form, stock:e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="input" rows={3} required value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
            </div>
            <div className="form-group">
              <label>Product Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    images: Array.from(e.target.files)
                  })
                }
              />
            </div>
            <div className="flex-gap" style={{marginTop:8}}>
              <button className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0
                ? <tr><td colSpan={5} style={{textAlign:'center', color:'var(--muted)', padding:24}}>No products yet. Click "Add Product" to start.</td></tr>
                : products.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.images?.length > 0 ? (
                        <img
                          src={p.images[0].image}
                          alt={p.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </td>
                    <td><b>{p.name}</b></td>
                    <td>{p.category_name}</td>
                    <td>₹{parseFloat(p.price).toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="flex-gap">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => del(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
