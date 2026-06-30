import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import Home           from './pages/Home';
import ProductList    from './pages/ProductList';
import ProductDetail  from './pages/ProductDetail';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Cart           from './pages/Cart';
import Checkout       from './pages/Checkout';
import Orders         from './pages/Orders';
import VendorDashboard from './pages/VendorDashboard';
import VendorProducts  from './pages/VendorProducts';
import VendorOrders    from './pages/VendorOrders';
import AdminDashboard  from './pages/AdminDashboard';
import AdminVendors    from './pages/AdminVendors';
import AdminOrders     from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminCustomers from './pages/AdminCustomers';
import AdminProducts from './pages/AdminProducts';
import Profile from './pages/Profile';
import Vendors from './pages/Vendors';

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading">Loading...</div>;
  
  if (!user) {
    const path = location.pathname.substring(1) + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(path)}`} replace />;
  }
  
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"              element={<Home />} />
        <Route path="/products"      element={<ProductList />} />
        <Route path="/vendors"       element={<Vendors />} />
        <Route path="/products/:id"  element={<ProductDetail />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />

        {/* Profile (all authenticated users) */}
        <Route path="/profile"  element={<Protected><Profile /></Protected>} />

        {/* Customer */}
        <Route path="/cart"     element={<Cart />} />
        <Route path="/checkout" element={<Protected role="customer"><Checkout /></Protected>} />
        <Route path="/orders"   element={<Protected><Orders /></Protected>} />

        {/* Vendor */}
        <Route path="/vendor"          element={<Protected role="vendor"><VendorDashboard /></Protected>} />
        <Route path="/vendor/products" element={<Protected role="vendor"><VendorProducts /></Protected>} />
        <Route path="/vendor/orders"   element={<Protected role="vendor"><VendorOrders /></Protected>} />

        {/* Admin */}
        <Route path="/admin"          element={<Protected role="admin"><AdminDashboard /></Protected>} />
        <Route path="/admin/vendors"  element={<Protected role="admin"><AdminVendors /></Protected>} />
        <Route path="/admin/orders"   element={<Protected role="admin"><AdminOrders /></Protected>} />

        <Route
          path="/admin/users"
          element={
            <Protected role="admin">
              <AdminUsers />
            </Protected>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <Protected role="admin">
              <AdminCustomers />
            </Protected>
          }
        />

        <Route
          path="/admin/products"
          element={
            <Protected role="admin">
              <AdminProducts />
            </Protected>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
