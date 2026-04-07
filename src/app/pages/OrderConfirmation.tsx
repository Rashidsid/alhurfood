import { useParams, Link } from 'react-router';
import { useOrders } from '../context/OrderContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl mb-4">Order Not Found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <CheckCircle2 className="mx-auto h-20 w-20 text-green-600 mb-4" />
          <h1 className="text-4xl mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between pb-4 border-b">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono">#{order.id}</span>
            </div>
            <div className="flex justify-between pb-4 border-b">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between pb-4 border-b">
              <span className="text-gray-600">Status:</span>
              <span className="capitalize bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                {order.status}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-gray-600">Name: </span>
              <span>{order.customerInfo.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Email: </span>
              <span>{order.customerInfo.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone: </span>
              <span>{order.customerInfo.phone}</span>
            </div>
            <div>
              <span className="text-gray-600">Delivery Address: </span>
              <span>{order.customerInfo.deliveryAddress}</span>
            </div>
            {order.customerInfo.deliveryLocation && (
              <div>
                <span className="text-gray-600">Delivery Location: </span>
                <span>{order.customerInfo.deliveryLocation}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Items Ordered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.product.id} className="flex justify-between pb-3 border-b last:border-b-0">
                  <div>
                    <p>{item.product.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p>Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({order.promoCode}):</span>
                  <span>-Rs. {order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.deliveryCharges && order.deliveryCharges > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>Rs. {order.deliveryCharges}</span>
                </div>
              )}
              <div className="flex justify-between text-xl pt-2 border-t">
                <span>Total:</span>
                <span className="text-orange-600">Rs. {order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg mb-2">What's Next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ You'll receive an order confirmation email shortly</li>
            <li>✓ We'll notify you when your order ships</li>
            <li>✓ Expected delivery: 3-5 business days</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button size="lg" variant="outline">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
