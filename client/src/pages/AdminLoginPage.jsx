import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? 'Email is required' : '',
        password: !formData.password ? 'Password is required' : ''
      });
      return;
    }

    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/admin');
    } else {
      toast.error(result.message || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-3xl text-primary hover:text-accent transition-colors">
            THE FACTORY
          </Link>
          <p className="text-secondary mt-2">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-surface rounded-lg shadow-card p-8">
          <h1 className="font-display font-semibold text-2xl mb-6 text-center">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="admin@factory.com"
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.password ? 'border-danger' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-danger text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-white py-3 rounded-md font-semibold hover:bg-accent/90 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-secondary">
            <p>Demo credentials:</p>
            <p className="font-mono text-xs mt-1">admin@factory.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
