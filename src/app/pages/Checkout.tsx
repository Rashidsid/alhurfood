import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { usePromoCodes } from '../context/PromoCodeContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Tag } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { validatePromoCode } = usePromoCodes();
  const { addOrder } = useOrders();
  const { updateProduct } = useProducts();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getCartTotal();
  const discount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
  const deliveryCharges = deliveryLocation === 'inside-valley' ? 100 : deliveryLocation === 'outside-valley' ? 160 : 0;
  const total = subtotal - discount + deliveryCharges;

  const handleApplyPromo = () => {
    const validated = validatePromoCode(promoCode);
    if (validated) {
      setAppliedPromo(validated);
      toast.success(`Promo code applied! ${validated.discount}% discount`);
    } else {
      toast.error('Invalid or expired promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.info('Promo code removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.deliveryAddress || !deliveryLocation) {
      toast.error('Please fill in all required fields including delivery location');
      return;
    }

    // Update product stock
    items.forEach(item => {
      updateProduct(item.product.id, {
        stock: item.product.stock - item.quantity
      });
    });

    // Create order
    const orderId = addOrder({
      items,
      total,
      subtotal,
      discount,
      deliveryCharges,
      promoCode: appliedPromo?.code,
      customerInfo: {
        ...formData,
        deliveryLocation: deliveryLocation === 'inside-valley' ? 'Inside Valley' : 'Outside Valley'
      },
      status: 'pending',
    });

    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-5xl mb-12 font-bold">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-lg">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-lg">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-lg">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="location" className="text-lg">Location *</Label>
                    <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
                      <SelectTrigger id="location" className="h-12 text-lg">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inside-valley" className="text-base">Inside Valley (Rs. 100)</SelectItem>
                        <SelectItem value="outside-valley" className="text-base">Outside Valley (Rs. 160)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deliveryAddress" className="text-lg">Delivery Address *</Label>
                    <Textarea
                      id="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      placeholder="Street address, apartment, suite, etc."
                      rows={4}
                      className="text-lg p-4"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.product.id} className="flex justify-between text-lg">
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="promo" className="text-lg">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        disabled={!!appliedPromo}
                        className="h-12 text-lg"
                      />
                      {appliedPromo ? (
                        <Button type="button" variant="outline" onClick={handleRemovePromo} className="h-12 text-base">
                          Remove
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" onClick={handleApplyPromo} className="h-12">
                          <Tag className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                    {appliedPromo && (
                      <p className="text-base text-green-600 font-semibold">
                        ✓ {appliedPromo.discount}% discount applied
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-6 border-t">
                    <div className="flex justify-between text-lg">
                      <span>Subtotal:</span>
                      <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-lg text-green-600 font-semibold">
                        <span>Discount:</span>
                        <span>-Rs. {discount.toFixed(2)}</span>
                      </div>
                    )}
                    {deliveryCharges > 0 && (
                      <div className="flex justify-between text-lg">
                        <span>Delivery Charges:</span>
                        <span className="font-semibold">Rs. {deliveryCharges}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-2xl pt-4 border-t font-bold">
                      <span>Total:</span>
                      <span className="text-orange-600">Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold" size="lg">
                    Place Order
                  </Button>

                  <p className="text-base text-gray-600 text-center">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
