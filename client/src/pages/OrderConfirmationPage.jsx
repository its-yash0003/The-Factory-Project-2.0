import { useLocation, Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId?.slice(-8) || 'N/A';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display font-bold text-3xl mb-4">Order Confirmed!</h1>

        <p className="text-secondary mb-6">
          Thank you for your order. We'll process it shortly and send you a confirmation email.
        </p>

        {/* Order ID */}
        <div className="bg-surface rounded-lg shadow-card p-6 mb-8">
          <p className="text-sm text-secondary mb-2">Order ID</p>
          <p className="font-mono font-bold text-primary text-lg">#{orderId.toUpperCase()}</p>
        </div>

        {/* Next Steps */}
        <div className="text-left bg-surface rounded-lg shadow-card p-6 mb-8">
          <h2 className="font-semibold mb-4">What's Next?</h2>
          <ul className="space-y-3 text-sm text-secondary">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-sm font-medium">1</span>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-sm font-medium">2</span>
              <span>We'll process your order within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-sm font-medium">3</span>
              <span>Shipping details will be sent once your order dispatches</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-accent text-white px-8 py-3 rounded-md font-semibold hover:bg-accent/90 transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="border-2 border-primary text-primary px-8 py-3 rounded-md font-semibold hover:bg-primary hover:text-white transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
