import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFeaturedProducts = useCallback(async () => {
    try {
      const response = await api.get('/api/products');
      setFeaturedProducts(response.data.slice(0, 6));
    } catch (err) {
      console.error('Error loading featured products:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-5xl md:text-7xl mb-6">
            PREMIUM CAPS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Factory-direct quality. Wholesale prices. Custom caps for every style and occasion.
          </p>
          <Link
            to="/products"
            className="inline-block bg-accent text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-accent/90 active:scale-95 transition-all"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Quality Assured</h3>
              <p className="text-secondary">Every cap undergoes strict quality control before shipping.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Wholesale Pricing</h3>
              <p className="text-secondary">Direct from factory prices for bulk orders.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">Fast Dispatch</h3>
              <p className="text-secondary">Quick processing and shipping on all orders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl mb-4">Featured Products</h2>
            <p className="text-secondary text-lg">Discover our most popular caps</p>
          </div>

          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/products"
                  className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition-all"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Ready to Place Your Order?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Browse our complete collection and find the perfect caps for your needs.
          </p>
          <Link
            to="/products"
            className="inline-block bg-accent text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-accent/90 active:scale-95 transition-all"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
