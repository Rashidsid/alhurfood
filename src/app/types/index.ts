export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'dehydrated-fruits' | 'pickles';
  image: string;
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number; // percentage
  active: boolean;
  expiryDate?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  deliveryCharges?: number;
  promoCode?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    deliveryLocation?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}
