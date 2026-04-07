import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './ui/sheet';
import { Trash2, Plus, Minus, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export default function CartDrawer() {
  const { items, isCartDrawerOpen, closeCartDrawer, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={closeCartDrawer}>
      <SheetContent side="right" className="w-full sm:w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl">Shopping Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 py-4">
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-4 border-b pb-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                      <p className="text-orange-600 font-bold text-lg mb-3">
                        Rs. {item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-base">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-orange-600">Rs. {getCartTotal().toFixed(2)}</span>
              </div>
              <Button
                className="w-full h-14 text-lg font-bold"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
