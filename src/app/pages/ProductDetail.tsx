import { useParams, Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart, openCartDrawer } = useCart();
  const { isAdminAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl mb-4">Product Not Found</h1>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`);
    openCartDrawer();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div>
            <Badge className="mb-4">
              {product.category === 'dehydrated-fruits' ? 'Dehydrated Fruits' : 'Pickles'}
            </Badge>
            {product.featured && (
              <Badge variant="secondary" className="ml-2 mb-4">
                Featured
              </Badge>
            )}

            <h1 className="text-4xl mb-4">{product.name}</h1>
            <p className="text-3xl text-orange-600 mb-6">Rs. {product.price.toFixed(2)}</p>
            
            <p className="text-gray-700 text-lg mb-6">{product.description}</p>

            <Card className="mb-6">
              <CardContent className="p-4">
                {product.stock > 0 && (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-lg">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl w-12 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={incrementQuantity}
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleAddToCart}>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </>
                )}
                {product.stock === 0 && (
                  <Button className="w-full" size="lg" disabled>
                    Out of Stock
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl mb-3">Product Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ 100% Natural ingredients</li>
                <li>✓ No artificial preservatives</li>
                <li>✓ Premium quality assured</li>
                <li>✓ Carefully packaged for freshness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
