import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUS_CLASS = { pending:'badge-pending', shipped:'badge-shipped', delivered:'badge-delivered', cancelled:'badge-cancelled' };
const NEXT_STATUS  = { pending:'shipped', shipped:'delivered' };

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/orders/').then(r => setOrders(Array.isArray(r.data) ? r.data : r.data.results || [])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/`, { status });
    load();
  };

  if (loading) return <div className="loading container">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Customer Orders</h1>
      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order #</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {orders.length === 0
                ? <tr><td colSpan={6} style={{textAlign:'center', color:'var(--muted)', padding:24}}>No orders yet.</td></tr>
                : orders.map(o => (
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
