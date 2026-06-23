import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUS_CLASS = {
  pending: 'badge-pending',
  shipped: 'badge-shipped',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadOrders = () => {
    setLoading(true);

    api
      .get('/orders/')
      .then((r) =>
        setOrders(
          Array.isArray(r.data)
            ? r.data
            : r.data.results || []
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);

      await api.patch(
        `/orders/${orderId}/update_status/`,
        { status }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="loading container">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">
        Order Management
      </h1>

      {orders.length === 0 ? (
        <div className="empty">
          <h3>No Orders Found</h3>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="card"
            style={{ marginBottom: 20 }}
          >
            <div className="flex-between">
              <div>
                <h3>
                  Order #{order.id}
                </h3>

                <p>
                  <strong>Customer:</strong>{' '}
                  {order.customer_email}
                </p>

                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Address:</strong>{' '}
                  {order.address}
                </p>

                <p>
                  <strong>Total:</strong>{' '}
                  ₹
                  {parseFloat(
                    order.total_amount
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <span
                  className={`badge ${STATUS_CLASS[order.status]}`}
                >
                  {order.status}
                </span>

                <div
                  style={{
                    marginTop: 10
                  }}
                >
                  <select
                    className="input"
                    value={order.status}
                    disabled={
                      updating === order.id
                    }
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <hr />

            <h4>Ordered Products</h4>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items?.map(
                    (item) => (
                      <tr key={item.id}>
                        <td>
                          {item.product_name}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          ₹
                          {parseFloat(
                            item.price
                          ).toLocaleString()}
                        </td>

                        <td>
                          ₹
                          {parseFloat(
                            item.subtotal
                          ).toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}