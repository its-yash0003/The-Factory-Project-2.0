import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      newErrors.customerPhone = 'Phone must be 10 digits';
    }

    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        notes: formData.notes
      };

      const response = await api.post('/api/orders', orderData);

      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-success', { state: { orderId: response.data._id } });
    } catch (err) {
      console.error('Order creation error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-secondary mb-6">Add some products before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-accent text-white px-8 py-3 rounded-md font-semibold hover:bg-accent/90 transition-all"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-4xl mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-surface rounded-lg shadow-card p-6">
                <h2 className="font-display font-semibold text-xl mb-4">Contact Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.customerName ? 'border-danger' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.customerName && (
                      <p className="text-danger text-sm mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.customerEmail ? 'border-danger' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-danger text-sm mt-1">{errors.customerEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.customerPhone ? 'border-danger' : 'border-gray-300'
                        }`}
                        placeholder="9876543210"
                        maxLength="10"
                      />
                      {errors.customerPhone && (
                        <p className="text-danger text-sm mt-1">{errors.customerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-surface rounded-lg shadow-card p-6">
                <h2 className="font-display font-semibold text-xl mb-4">Shipping Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Street Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.street ? 'border-danger' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.street && (
                      <p className="text-danger text-sm mt-1">{errors.street}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.city ? 'border-danger' : 'border-gray-300'
                        }`}
                        placeholder="Mumbai"
                      />
                      {errors.city && (
                        <p className="text-danger text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        State <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.state ? 'border-danger' : 'border-gray-300'
                        }`}
                        placeholder="Maharashtra"
                      />
                      {errors.state && (
                        <p className="text-danger text-sm mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1">
                        Pincode <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.pincode ? 'border-danger' : 'border-gray-300'
                        }`}
                        placeholder="400001"
                        maxLength="6"
                      />
                      {errors.pincode && (
                        <p className="text-danger text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Any special instructions..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg shadow-card p-6 sticky top-24">
                <h2 className="font-display font-semibold text-xl mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-secondary">
                        {item.productName} (Size: {item.size}) x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-secondary">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Shipping</span>
                    <span className="text-success">Calculated later</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-accent text-white py-3 rounded-md font-semibold hover:bg-accent/90 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
