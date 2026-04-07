import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function Header() {
  const { getItemCount, openCartDrawer } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl">🍊</div>
            <span className="text-xl">Alhur Foods</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-orange-600">
              Home
            </Link>
            <Link to="/products/dehydrated-fruits" className="hover:text-orange-600">
              Dehydrated Fruits
            </Link>
            <Link to="/products/pickles" className="hover:text-orange-600">
              Pickles
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCartDrawer}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
