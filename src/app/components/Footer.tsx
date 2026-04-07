import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🍊</div>
              <span className="text-xl">Alhur Foods</span>
            </div>
            <p className="text-gray-400">
              Premium dehydrated fruits and traditional pickles for your healthy lifestyle.
            </p>
          </div>

          <div>
            <h3 className="text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/products/dehydrated-fruits" className="hover:text-white">
                  Dehydrated Fruits
                </Link>
              </li>
              <li>
                <Link to="/products/pickles" className="hover:text-white">
                  Pickles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:alhurfoods@gmail.com" className="hover:text-white hover:underline">
                  Email: alhurfoods@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+977976437549" className="hover:text-white hover:underline">
                  Phone: +977 9764375492
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Contact Us</li>
              <li>Shipping Info</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Alhur Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
