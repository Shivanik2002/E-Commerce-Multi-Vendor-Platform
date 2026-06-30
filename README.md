# E-Commerce Multi-Vendor Platform
### SASTRA Deemed University — School of Computing
#### CAPOL510 – IS Development Laboratory (Mini Project Submission)

---

## 🎓 Academic Submission Metadata
* **Course:** Master of Computer Applications (MCA - Online)
* **Semester:** Semester 3
* **Laboratory Subject:** CAPOL510 – IS Development Laboratory
* **Project Title:** Multi-Vendor E-Commerce Platform
* **Submitted By:** Shivani Kushwah (Register No: `25113110500`)
* **Submitted To:** School of Computing Faculty Panel

---

## 📝 Abstract Overview
This project presents the design, implementation, and testing of a complete stateless **Multi-Vendor E-Commerce Platform**. 

The system is decoupled into:
1. A stateless RESTful backend built with **Django REST Framework (DRF)**, utilizing secure **JSON Web Token (SimpleJWT)** authentication with automatic access/refresh token rotation.
2. A responsive Frontend Single-Page Application (SPA) built using **React 18** and **Vite**, featuring a global authentication state provider, automatic Axios interceptors, responsive CSS design, and role-based interface rendering.

The database supports transaction safety for cart checkouts, inventory stock deduction, and role-based permissions separating Customers, Vendors, and Platform Administrators.

---

## 📂 Project Organization & Directory Layout
The repository contains the complete codebase, presentation assets, Word documents, and the formatted university submission report dossier:

```
ecommerce-multivendor/
├── backend/                  # Django REST API (Python 3.10+)
│   ├── config/               # Settings, URLs, WSGI
│   ├── users/                # Custom User Model & SimpleJWT Auth Flow
│   ├── vendors/              # Vendor Profile and Approvals
│   ├── products/             # Category & Product Catalog Models/Views
│   ├── orders/               # Shopping Cart, Orders, & Transaction Checks
│   ├── dashboard/            # Role-aware Analytics APIs
│   ├── requirements.txt      # Python dependencies
│   └── manage.py             # Entry script
│
├── frontend/                 # React SPA (Vite + React 18)
│   ├── src/
│   │   ├── context/          # Global AuthContext & CartContext
│   │   ├── services/         # Axios instance with Interceptors
│   │   ├── components/       # Shared UI (Navbar, ProductCard)
│   │   ├── pages/            # View Containers (Customer, Vendor, Admin)
│   │   ├── App.jsx           # App routes with Protected Router
│   │   ├── main.jsx          # Providers wrapper
│   │   └── styles.css        # Clean UI styling & design system
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite config
│
├── report/                   # 🎓 9-Chapter Submission Dossier (HTML)
│   ├── index.html            # Cover Page & Abstract Overview
│   ├── chapter1.html         # Introduction & Problem Statement
│   ├── chapter2.html         # Software Project Plan & Schedule
│   ├── chapter3.html         # Software Requirements Specification (SRS)
│   ├── chapter4.html         # System Analysis (Use Case & DFD Diagrams)
│   ├── chapter5.html         # System Design (ERD & Architecture Diagrams)
│   ├── chapter6.html         # Coding & Code Snippets
│   ├── chapter7.html         # System Testing (Unit, Integration & validation)
│   ├── chapter8.html         # Implementation (Problems Faced & Lessons Learnt)
│   ├── chapter9.html         # Future Plans & Extensions
│   ├── report.css            # Common print-friendly theme stylesheet
│   └── script.js             # Sidebar navigator and light/dark theme manager
│
├── ppt/                      # Presentation Slides
└── docs/                     # Word Documents & Reports
```

---

## 🎓 HTML Project Report Dossier
A comprehensive **9-Chapter Project Report** has been built directly inside the repository in `/report/`. It features vector SVG diagrams, clean typography, tables, and a unified sidebar navigator with Dark/Light mode support.

To open the report and navigate the chapters:
1. Double-click the cover page entry point at [index.html](file:///home/kapil/Music/FinalMultivendor/ecommerce-multivendor/report/index.html) in your browser.
2. Toggle the theme button in the sidebar footer to switch between Light and Dark mode.
3. Access detailed UML Diagrams in **Chapter 4** (Use Cases, DFDs) and **Chapter 5** (ERD, Architecture).

---

## 🛠️ Installation & Setup Instructions

### 1. Django Backend Setup
Ensure you have Python 3.10+ installed on your system.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install required packages
pip install -r requirements.txt

# Run migrations to generate database tables
python manage.py makemigrations users vendors products orders dashboard
python manage.py migrate

# Create the primary system administrator account
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```
> The Django REST API server will run at: **`http://localhost:8000`**  
> Access the Django Admin interface at: **`http://localhost:8000/admin/`**

---

### 2. React Frontend Setup
Ensure you have Node.js (v18+) and npm installed.

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development build server
npm run dev
```
> The frontend application will launch at: **`http://localhost:5173`**

---

## 👥 User Roles & Access Matrix

The system enforces strict Role-Based Access Control (RBAC) across three distinct user roles:

| User Role | Credentials / Setup | Interface Capabilities |
| :--- | :--- | :--- |
| **Customer** | Register via `/register` with role = customer | Browse active products, search and filter catalog, manage persistent shopping cart, checkout, view order history. |
| **Vendor** | Register via `/register` with role = vendor. Must be approved by Admin. | Access vendor dashboard. Manage storefront products (CRUD). View received orders and update order dispatch status (`pending` &rarr; `shipped` &rarr; `delivered`). |
| **Admin** | Create via `python manage.py createsuperuser` | Manage global categories. Approve or revoke vendor store status. View platform-wide metrics and audit transactions. |

---

## 🔌 Core REST API Contracts

| Method | Endpoint | Authentication | Payload Details | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register/` | Public | `{email, username, password, role}` | `201 Created` |
| **POST** | `/api/auth/login/` | Public | `{email, password}` | `200 OK` (access/refresh JWT) |
| **GET** | `/api/auth/me/` | JWT (Bearer) | None | `200 OK` (user profile details) |
| **GET** | `/api/products/` | Public | None | `200 OK` (paginated product list) |
| **POST** | `/api/products/` | JWT (Vendor) | `{name, price, stock, category_id}` | `201 Created` |
| **PUT** | `/api/products/{id}/` | JWT (Vendor-owner) | `{name, price, stock, is_active}` | `200 OK` |
| **DELETE** | `/api/products/{id}/` | JWT (Vendor-owner) | None | `204 No Content` |
| **POST** | `/api/orders/` | JWT (Customer) | `{items: [{product, quantity}], address}` | `201 Created` |
| **GET** | `/api/orders/` | JWT (Role-aware) | None | `200 OK` (filtered order history) |
| **PATCH** | `/api/orders/{id}/` | JWT (Vendor/Admin) | `{status: "shipped"}` | `200 OK` |
| **GET** | `/api/dashboard/stats/` | JWT (Role-aware) | None | `200 OK` (revenue and items count) |

---

## 🔒 Security & Transaction Integrity
* **Stateless Auth:** Secure authentication using short-lived JWT access tokens and long-lived refresh tokens.
* **CORS Headers:** Standard security policy config preventing unauthorized domain resource requests.
* **Transaction Safe:** Stock deduction checks are enclosed within Django database atomic transactions to prevent double-spending or race conditions.
* **SQL Injection Protection:** Queries use Django's ORM parameterized APIs.
