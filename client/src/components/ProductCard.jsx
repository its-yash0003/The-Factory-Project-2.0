import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes?.[0] || 'M';
    addToCart(product, defaultSize, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="bg-surface rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <Link to={`/products/${product._id}`}>
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={`http://localhost:5000${product.images[0]}`}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-display font-semibold text-lg text-primary mb-1 hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-secondary text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-lg">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 active:scale-95 transition-all"
          >
            Add to Cart
          </button>
        </div>

        {/* Size Badges */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {product.sizes.slice(0, 5).map(size => (
              <span
                key={size}
                className="bg-gray-100 text-secondary text-xs px-2 py-1 rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-secondary text-xs px-1 py-1">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
