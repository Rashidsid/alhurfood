import { Link } from 'react-router';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order?.total || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 20);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Alhur Foods Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order?.customerInfo?.name || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rs. {(order?.total || 0).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order?.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order?.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        order?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order?.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/admin/orders">
              <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700">
                View all orders →
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-600 text-center py-4">All products have sufficient stock</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {product.category.replace('-', ' ')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.stock === 0 ? 'bg-red-100 text-red-800' :
                      product.stock < 10 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/admin/inventory">
              <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700">
                Manage inventory →
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
