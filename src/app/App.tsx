import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { PromoCodeProvider } from './context/PromoCodeContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <PromoCodeProvider>
            <OrderProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" />
            </OrderProvider>
          </PromoCodeProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
