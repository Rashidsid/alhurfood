import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { LayoutDashboard, Package, Warehouse, Tag, ShoppingBag, LogOut, Home } from 'lucide-react';

export default function AdminLayout() {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/inventory', label: 'Inventory', icon: Warehouse },
    { path: '/admin/promo-codes', label: 'Promo Codes', icon: Tag },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-2xl">🍊</div>
            <span className="text-xl">Alhur Foods</span>
          </div>
          <p className="text-sm text-gray-600">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-100 text-orange-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Link to="/">
            <Button variant="outline" className="w-full mb-2">
              <Home className="mr-2 h-4 w-4" />
              View Store
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
