import { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Eye, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Order } from '../types';

const formatDate = (dateString: string | Date | undefined) => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  } catch {
    return 'Invalid Date';
  }
};

const getCustomerInfo = (order: any) => {
  if (!order) return {};
  const info = order.customer_info || order.customerInfo || {};
  if (typeof info === 'string') {
    try {
      return JSON.parse(info);
    } catch {
      return {};
    }
  }
  return info;
};



export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o?.status === filterStatus);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    toast.success('Order status updated!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl text-yellow-600">
              {orders.filter(o => o?.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-3xl text-blue-600">
              {orders.filter(o => o?.status === 'processing').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Shipped</p>
            <p className="text-3xl text-purple-600">
              {orders.filter(o => o?.status === 'shipped').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Delivered</p>
            <p className="text-3xl text-green-600">
              {orders.filter(o => o?.status === 'delivered').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Orders</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No orders found</p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const info = getCustomerInfo(order);
                return (
                  <div key={order?.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">#{order?.id}</h3>
                        <Badge className={getStatusColor(order?.status || 'pending')}>
                          {order?.status || 'pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {info?.name || 'N/A'} • {formatDate(order?.created_at || order?.createdAt)}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-medium">Rs. {(order?.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{(order?.items?.length || 0)} items</p>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (() => {
                            const info = getCustomerInfo(selectedOrder);
                            return (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600">Order ID</p>
                                    <p className="font-medium">#{selectedOrder?.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Date</p>
                                    <p className="font-medium">{formatDate(selectedOrder?.created_at || selectedOrder?.createdAt)}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-gray-600 mb-2">Customer Information</p>
                                  <div className="bg-gray-50 p-3 rounded space-y-1">
                                    <p><strong>Name:</strong> {info?.name || 'N/A'}</p>
                                    <p><strong>Email:</strong> {info?.email || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {info?.phone || 'N/A'}</p>
                                    <p><strong>Delivery Address:</strong> {info?.deliveryAddress || 'N/A'}</p>
                                    {info?.deliveryLocation && (
                                      <p><strong>Delivery Location:</strong> {info.deliveryLocation}</p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm text-gray-600 mb-2">Items</p>
                                  <div className="space-y-2">
                                    {(selectedOrder?.items || []).map((item: any) => (
                                      <div key={item?.product?.id} className="flex justify-between bg-gray-50 p-2 rounded">
                                        <span>{item?.product?.name || 'N/A'} x {item?.quantity || 0}</span>
                                        <span>Rs. {((item?.product?.price || 0) * (item?.quantity || 0)).toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="border-t pt-3">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>Rs. {(selectedOrder?.subtotal || 0).toFixed(2)}</span>
                                  </div>
                                  {(selectedOrder?.discount || 0) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Discount ({selectedOrder?.promo_code || selectedOrder?.promoCode || 'N/A'}):</span>
                                      <span>-Rs. {(selectedOrder?.discount || 0).toFixed(2)}</span>
                                    </div>
                                  )}
                                  {(selectedOrder?.delivery_charges || selectedOrder?.deliveryCharges || 0) > 0 && (
                                    <div className="flex justify-between">
                                      <span>Delivery Charges:</span>
                                      <span>Rs. {(selectedOrder?.delivery_charges || selectedOrder?.deliveryCharges || 0)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-lg pt-2 border-t mt-2 font-bold">
                                    <span>Total:</span>
                                    <span className="text-orange-600">Rs. {(selectedOrder?.total || 0).toFixed(2)}</span>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm text-gray-600 mb-2 block">Update Status</Label>
                                  <Select
                                    value={selectedOrder?.status || 'pending'}
                                    onValueChange={(value) => {
                                      handleStatusChange(selectedOrder?.id || '', value as Order['status']);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            );
                          })()}
                        </DialogContent>
                      </Dialog>
                      <Select
                        value={order?.status || 'pending'}
                        onValueChange={(value) => handleStatusChange(order?.id || '', value as Order['status'])}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}