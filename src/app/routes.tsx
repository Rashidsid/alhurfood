import { createBrowserRouter } from 'react-router';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminInventory from './pages/AdminInventory';
import AdminPromoCodes from './pages/AdminPromoCodes';
import AdminOrders from './pages/AdminOrders';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: CustomerLayout,
    children: [
      { index: true, Component: Home },
      { path: 'products/:category', Component: Products },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'order-confirmation/:orderId', Component: OrderConfirmation },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    Component: ProtectedRoute,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'products', Component: AdminProducts },
          { path: 'inventory', Component: AdminInventory },
          { path: 'promo-codes', Component: AdminPromoCodes },
          { path: 'orders', Component: AdminOrders },
        ],
      },
    ],
  },
]);
