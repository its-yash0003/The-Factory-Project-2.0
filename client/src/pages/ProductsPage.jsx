import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const loadProducts = useCallback(async (abortController) => {
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (sizeFilter) params.append('size', sizeFilter);

      const response = await api.get(`/api/products?${params}`, {
        signal: abortController?.signal
      });
      setProducts(response.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading products:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, sizeFilter]);

  useEffect(() => {
    const abortController = new AbortController();
    loadProducts(abortController);
    return () => abortController.abort();
  }, [loadProducts]);

  const clearFilters = () => {
    setCategoryFilter('');
    setSizeFilter('');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">All Products</h1>
          <p className="text-secondary">Browse our complete collection</p>
        </div>

        {/* Filters */}
        <div className="bg-surface rounded-lg shadow-card p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Size
                </label>
                <select
                  value={sizeFilter}
                  onChange={e => setSizeFilter(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">All Sizes</option>
                  {allSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(categoryFilter || sizeFilter) && (
              <button
                onClick={clearFilters}
                className="text-accent hover:text-accent/80 font-medium text-sm self-end"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-secondary mb-4">
          {isLoading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Products Grid */}
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-secondary text-lg">No products found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-accent hover:text-accent/80 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
