import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const STATUS_CLASS = { pending:'badge-pending', shipped:'badge-shipped', delivered:'badge-delivered', cancelled:'badge-cancelled' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { state } = useLocation();

  useEffect(() => {
    api.get('/orders/').then(r => setOrders(Array.isArray(r.data) ? r.data : r.data.results || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(o => {
    const term = search.toLowerCase();
    const matchesSearch = 
      String(o.id).includes(term) ||
      (o.address || '').toLowerCase().includes(term) ||
      (o.items || []).some(item => (item.product_name || '').toLowerCase().includes(term));
    const matchesStatus = statusFilter === '' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading container">Loading orders...</div>;

  return (
    <div className="container">
      <h1 className="page-title">My Orders</h1>
      {state?.success && <div className="alert alert-success">✅ Order placed successfully!</div>}

      <div className="flex-gap" style={{ marginBottom: '20px' }}>
        <input
          className="input"
          placeholder="Search orders by ID, address, or product name..."
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

      {filteredOrders.length === 0
        ? <div className="empty"><h3>No orders matched your search</h3><p>Place your first order from the products page or modify your search filters.</p></div>
        : (
          <div className="card" style={{padding:0}}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <>
                      <tr key={o.id}>
                        <td>
                          <b>#{o.id}</b>
                        </td>

                        <td>
                          <div>
                            <strong>{o.customer_email}</strong>
                          </div>
                        </td>

                        <td>
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>

                        <td>
                          {o.items?.length || 0} item(s)
                        </td>

                        <td style={{ fontWeight: 600 }}>
                          ₹{parseFloat(o.total_amount).toLocaleString()}
                        </td>

                        <td>
                          <span className={`badge ${STATUS_CLASS[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                            {expanded === o.id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {expanded === o.id && (
                        <tr key={`${o.id}-detail`}>
                          <td colSpan={7} style={{background:'var(--bg)', padding:16}}>
                            <div
                              style={{
                                marginBottom: 12,
                                padding: 12,
                                background: '#192334',
                                borderRadius: 8
                              }}
                            >
                              <p>
                                <strong>Customer:</strong>{' '}
                                {o.customer_email}
                              </p>

                              <p>
                                <strong>Customer ID:</strong>{' '}
                                #{o.customer}
                              </p>

                              <p>
                                <strong>Delivery Address:</strong>{' '}
                                {o.address}
                              </p>

                              <p>
                                <strong>Order Status:</strong>{' '}
                                {o.status}
                              </p>
                            </div>
                            {o.items?.map(item => (
                              <div key={item.id} style={{display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4}}>
                                <span>{item.product_name} × {item.quantity}</span>
                                <span>₹{parseFloat(item.price).toLocaleString()}</span>
                              </div>
                            ))}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    </div>
  );
}
