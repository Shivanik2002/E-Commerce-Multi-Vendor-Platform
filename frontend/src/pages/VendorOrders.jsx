import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUS_CLASS = { pending:'badge-pending', shipped:'badge-shipped', delivered:'badge-delivered', cancelled:'badge-cancelled' };
const NEXT_STATUS  = { pending:'shipped', shipped:'delivered' };

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = () => api.get('/orders/').then(r => setOrders(Array.isArray(r.data) ? r.data : r.data.results || [])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/`, { status });
    load();
  };

  const filteredOrders = orders.filter(o => {
    const term = search.toLowerCase();
    const matchesSearch = 
      String(o.id).includes(term) ||
      (o.customer_email || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === '' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading container">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Customer Orders</h1>

      <div className="flex-gap" style={{ marginBottom: '20px' }}>
        <input
          className="input"
          placeholder="Search orders by ID or customer email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select
          className="input"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order #</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filteredOrders.length === 0
                ? <tr><td colSpan={6} style={{textAlign:'center', color:'var(--muted)', padding:24}}>No orders matched your search/filter.</td></tr>
                : filteredOrders.map(o => (
                  <tr key={o.id}>
                    <td><b>#{o.id}</b></td>
                    <td>{o.customer_email}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td style={{fontWeight:600}}>₹{parseFloat(o.total_amount).toLocaleString()}</td>
                    <td><span className={`badge ${STATUS_CLASS[o.status]}`}>{o.status}</span></td>
                    <td>
                      {NEXT_STATUS[o.status] && (
                        <button className="btn btn-primary btn-sm" onClick={() => updateStatus(o.id, NEXT_STATUS[o.status])}>
                          Mark {NEXT_STATUS[o.status]}
                        </button>
                      )}
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
