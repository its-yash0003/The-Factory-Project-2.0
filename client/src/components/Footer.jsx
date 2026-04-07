import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-display font-bold text-xl mb-4">THE FACTORY</h3>
            <p className="text-gray-400 text-sm">
              Premium quality caps for every style. Manufacturing excellence since day one.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-accent transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-accent transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@thefactory.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Industrial Ave, Factory City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} THE FACTORY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
