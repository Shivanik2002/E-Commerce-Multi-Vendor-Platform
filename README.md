# E-Commerce Multi-Vendor Platform
### SASTRA Deemed University — CAPOL510 IS Development Laboratory

**Stack:** Django REST Framework (Backend) + React.js (Frontend)

---

## Project Structure

```
ecommerce-multivendor/
├── backend/               Django REST API
│   ├── config/            Settings, URLs, WSGI
│   ├── users/             Custom User model (customer/vendor/admin), JWT auth
│   ├── vendors/           Vendor profiles, admin approval
│   ├── products/          Products + Categories (vendor-owned)
│   ├── orders/            Cart, Order, OrderItem with stock deduction
│   ├── dashboard/         Role-aware statistics API
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/              React SPA
    ├── src/
    │   ├── context/       AuthContext (JWT + user), CartContext
    │   ├── services/      Axios instance with JWT interceptor + auto-refresh
    │   ├── components/    Navbar, ProductCard
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductList.jsx      Search + category filter
    │   │   ├── ProductDetail.jsx
    │   │   ├── Login.jsx            JWT login → role-based redirect
    │   │   ├── Register.jsx         Customer / Vendor registration
    │   │   ├── Cart.jsx             Add/remove/update cart items
    │   │   ├── Checkout.jsx         Place order with delivery address
    │   │   ├── Orders.jsx           Customer order history
    │   │   ├── VendorDashboard.jsx  Vendor stats (products, orders, revenue)
    │   │   ├── VendorProducts.jsx   CRUD product management
    │   │   ├── VendorOrders.jsx     View + update order status
    │   │   ├── AdminDashboard.jsx   Platform-wide stats
    │   │   ├── AdminVendors.jsx     Approve / revoke vendors
    │   │   └── AdminOrders.jsx      All orders view
    │   ├── App.jsx                  React Router + Protected routes
    │   ├── main.jsx                 Entry point with providers
    │   └── styles.css               Complete design system
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations users vendors products orders dashboard
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

> Django API runs at: http://localhost:8000

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

> React app runs at: http://localhost:5173

---

## User Roles

| Role     | Capabilities |
|----------|-------------|
| Customer | Browse products, add to cart, checkout, view orders |
| Vendor   | Register shop, manage products, view & update orders |
| Admin    | Approve vendors, view all orders, platform stats |

---

## Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register user |
| POST | /api/auth/login/ | Login (returns JWT) |
| GET  | /api/auth/me/ | Get current user |
| GET  | /api/products/ | List products (search + filter) |
| POST | /api/products/ | Add product (vendor only) |
| GET  | /api/orders/ | Orders (role-filtered) |
| POST | /api/orders/ | Place order (customer) |
| PATCH| /api/orders/:id/ | Update status (vendor/admin) |
| GET  | /api/vendors/ | All vendors (admin only) |
| PATCH| /api/vendors/:id/approve/ | Approve vendor |
| GET  | /api/dashboard/stats/ | Role-aware stats |

---

## Default Admin Login
After `createsuperuser`, use Django admin at: http://localhost:8000/admin/
