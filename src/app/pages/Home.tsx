import { Link } from 'react-router';
import { useProducts } from '../context/ProductContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Apple, Salad, Star, Facebook, Instagram, Music2 } from 'lucide-react';

export default function Home() {
  const { products } = useProducts();

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl mb-4">Welcome to Alhur Foods</h1>
          <p className="text-xl mb-8">All-natural pickles & dehydrated fruits<br />Healthy snacking, anytime • anywhere</p>
          <div className="flex gap-4 justify-center">
            <Link to="/products/dehydrated-fruits">
              <Button size="lg" variant="secondary">
                <Apple className="mr-2 h-5 w-5" />
                Shop Fruits
              </Button>
            </Link>
            <Link to="/products/pickles">
              <Button size="lg" variant="secondary">
                <Salad className="mr-2 h-5 w-5" />
                Shop Pickles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
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
        </div>

        {/* Social Media Icons - Floating Right Side */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-40">
          <a
            href="https://www.facebook.com/share/1CEtmg2FNu/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/alhur_foods?igsh=MWRrdGx2djBrdmhlcg=="
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 transition-colors"
            title="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://www.tiktok.com/@alhur.foods?_r=1&_t=ZS-957YLNvQBFd"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
            title="TikTok"
          >
            <Music2 className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <Link to="/products/dehydrated-fruits">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src="/images/fruits.jpeg"
                  alt="Dehydrated Fruits"
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl mb-2">Dehydrated Fruits</h3>
                  <p className="text-gray-600">Naturally sweet and nutritious dried fruits</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/products/pickles">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <img
                  src="/images/pickles.jpeg"
                  alt="Pickles"
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl mb-2">Traditional Pickles</h3>
                  <p className="text-gray-600">Authentic spicy pickles made with love</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl mb-6">Why Choose Alhur Foods?</h2>
          <p className="text-lg text-gray-700 mb-8">
            At Alhur Foods, we're committed to bringing you the finest quality dehydrated fruits and traditional pickles. 
            Our products are carefully crafted using premium ingredients and time-honored recipes, ensuring 
            exceptional taste and nutritional value in every bite.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-2">🌱</div>
              <h3 className="text-xl mb-2">100% Natural</h3>
              <p className="text-gray-600">No artificial preservatives or colors</p>
            </div>
            <div>
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-600">Carefully selected ingredients</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🚚</div>
              <h3 className="text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}