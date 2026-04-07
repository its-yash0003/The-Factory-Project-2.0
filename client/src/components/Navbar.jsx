import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();

  const cartCount = getCartCount();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/cart', label: 'Cart' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-display font-bold text-2xl tracking-wider hover:text-accent transition-colors">
            THE FACTORY
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors relative ${
                  isActive(link.path) ? 'text-accent' : 'hover:text-accent'
                }`}
              >
                {link.label}
                {link.path === '/cart' && cartCount > 0 && (
                  <span className="absolute -top-3 -right-4 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-primary/80 rounded transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/20 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-3 font-medium transition-colors ${
                  isActive(link.path) ? 'text-accent' : 'hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
                {link.path === '/cart' && cartCount > 0 && (
                  <span className="ml-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
