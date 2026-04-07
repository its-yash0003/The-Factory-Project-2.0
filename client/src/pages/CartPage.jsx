import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  const handleRemove = (productId, size) => {
    removeFromCart(productId, size);
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, size, newQuantity);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-16">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-secondary mb-6">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-block bg-accent text-white px-8 py-3 rounded-md font-semibold hover:bg-accent/90 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.productId}-${item.size}`} className="bg-surface rounded-lg shadow-card p-4 flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  {item.image ? (
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-1">{item.productName}</h3>
                  <p className="text-secondary text-sm mb-2">Size: {item.size}</p>
                  <p className="font-bold text-accent">${item.price.toFixed(2)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.size, item.quantity - 1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.size, item.quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.productId, item.size)}
                  className="text-danger hover:text-danger/80 transition-colors self-start"
                  aria-label="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg shadow-card p-6 sticky top-24">
              <h2 className="font-display font-semibold text-xl mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-secondary">
                  <span>Items ({getCartCount()})</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span className="text-success">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-accent text-white py-3 rounded-md font-semibold hover:bg-accent/90 active:scale-95 transition-all"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-secondary hover:text-primary mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
