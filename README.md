# Inventory Management Client 📦

A modern, robust, and responsive Inventory Management System dashboard built with Next.js, React, and TypeScript. This application empowers users to efficiently manage products, categories, brands, stock movements, and transaction reports — all from a polished, role-aware interface.

## 🚀 Key Features

### Dashboard & Analytics
* **Overview Dashboard**: At-a-glance stats for total products, categories, and transactions with quick action shortcuts.
* **Dark Mode Support**: Seamless light/dark theme toggle across the entire application.

### Product Management
* **Full CRUD**: Create, view, edit, and manage products with details like barcode, cost price, sale price, brand, and category.
* **Product Archiving**: Soft-delete products by archiving them to an "Inactive" tab; restore anytime.
* **Inline Stock Management**: Manage stock directly from the products table via a dedicated Stock Modal (Stock In / Stock Out).
* **Product Details Modal**: View complete product information including pricing, margins, stock levels, and metadata.

### Categories & Brands
* **Category Management**: Create, edit, and delete product categories with descriptions.
* **Brand Management**: Create, edit, and delete brands with descriptions.
* **Searchable Tables**: All list pages feature paginated tables with real-time search.

### Transaction Reports
* **Three-Tab View**: Approved, Pending (Admin-only), and Rejected (Admin-only) transaction tabs.
* **Report Approval System**: Admins can approve or reject pending transactions submitted by employees.
* **Date Range Filtering**: Filter approved reports by weekly or monthly time ranges.
* **CSV Download**: Export approved transaction reports for external use.
* **Edit Transactions**: Correct quantities on existing transactions with automatic profit/loss recalculation.

### Role-Based Access Control (RBAC)
* **Admin Role**: Full access to all features including employee management, report approvals, and settings.
* **Employee Role**: Scoped access — can create transactions and view approved reports, but cannot manage employees or approve reports.
* **Employee Management**: Admins can create, view, and manage employee accounts from the Settings page.

### Authentication
* **Secure Login**: Cookie-based JWT authentication with protected routes.
* **Password Recovery**: Forgot password and set new password flows.
* **Profile Settings**: View account details and change password.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Ant Design](https://ant.design/)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
* **Persistence:** [Redux Persist](https://github.com/rt2zz/redux-persist)
* **Icons:** [Ant Design Icons](https://ant.design/components/icon) & [Lucide React](https://lucide.dev/)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
* **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)

---

## 🚦 Getting Started

### Prerequisites

* Node.js (v18.17 or newer)
* npm, yarn, pnpm, or bun

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/mu-senpai/inventory-management-client.git
cd inventory-management-client
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1
```

### 3. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (pages, layouts, middleware)
│   ├── (auth)/           # Authentication routes (login, forgot-password, set-password)
│   └── (dashboard)/      # Protected dashboard routes
│       └── dashboard/
│           ├── overview/      # Dashboard analytics overview
│           ├── categories/    # Category management
│           ├── brands/        # Brand management
│           ├── products/      # Product management with archiving & stock
│           ├── reports/       # Transaction reports with approval system
│           └── settings/      # Profile, password, and employee management
├── components/
│   ├── pages/dashboard/  # Dashboard-specific components
│   │   ├── BrandModal.tsx
│   │   ├── CategoryModal.tsx
│   │   ├── ProductModal.tsx
│   │   ├── ViewProductModal.tsx
│   │   ├── StockModal.tsx
│   │   ├── EditReportModal.tsx
│   │   ├── CreateEmployeeModal.tsx
│   │   ├── EmployeeManagementTab.tsx
│   │   ├── DashboardNavbar.tsx
│   │   └── DashboardSidebar.tsx
│   └── shared/           # Generic reusable components (Logo, TablePagination)
├── redux/
│   ├── api/              # RTK Query API slices
│   │   ├── baseApi.ts        # Base API with auth headers
│   │   ├── analyticsApi.ts   # Dashboard analytics
│   │   ├── productApi.ts     # Products CRUD + archiving
│   │   ├── categoryApi.ts    # Categories CRUD
│   │   ├── brandApi.ts       # Brands CRUD
│   │   ├── reportApi.ts      # Reports + approval system
│   │   └── userApi.ts        # Employee management
│   ├── features/
│   │   └── authSlice.ts      # Authentication state
│   └── store.ts              # Redux store with persist config
├── type/
│   └── type.ts           # Centralized TypeScript definitions
└── middleware.ts         # Edge middleware for route protection
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm start` | Starts the production server |
| `npm run lint` | Runs ESLint |

---

## 📖 User Guide

### Accessing the Dashboard
1. Navigate to the login page and enter your credentials.
2. You'll be redirected to the Dashboard Overview with stats and quick actions.

### Managing Products
1. Go to **Products** from the sidebar.
2. Click **Add Product** to create a new product with all details.
3. Use the action buttons on each row to **View**, **Edit**, **Manage Stock**, or **Archive** products.
4. Switch between **Active Products** and **Archived** tabs to manage product lifecycle.

### Stock Operations
1. From the Products table, click the **Stock** icon (↔) on any product.
2. Choose **Stock In** or **Stock Out**, enter the quantity, and submit.
3. The transaction is recorded and the product's stock is updated in real-time.

### Viewing & Managing Reports
* **Approved**: View finalized transactions with weekly/monthly date filtering and CSV export.
* **Pending** (Admin): Review and approve or reject employee-submitted transactions.
* **Rejected** (Admin): View rejected transactions with the option to re-approve.

### Employee Management (Admin Only)
1. Go to **Settings** → **Employee Management** tab.
2. Create new employee accounts or view existing ones.
3. Employees get scoped access based on their role.
