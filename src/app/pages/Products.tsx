import { useParams, Link } from 'react-router';
import { useProducts } from '../context/ProductContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';

export default function Products() {
  const { category } = useParams<{ category: string }>();
  const { getProductsByCategory } = useProducts();

  const products = category ? getProductsByCategory(category) : [];

  const categoryTitle =
    category === 'dehydrated-fruits' ? 'Dehydrated Fruits' : 'Traditional Pickles';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl mb-8">{categoryTitle}</h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-600 py-12">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">0.0 (0)</span>
                    </div>
                    <h3 className="text-base mb-3 hover:text-orange-600 font-semibold line-clamp-2">{product.name}</h3>
                    <p className="text-2xl text-orange-600 font-bold">Rs {product.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
