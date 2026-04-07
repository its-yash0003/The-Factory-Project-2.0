import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSkeleton from './components/LoadingSkeleton';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminAddEditProductPage = lazy(() => import('./pages/AdminAddEditProductPage'));

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><LoadingSkeleton count={3} /></div>}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderConfirmationPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products/new"
                    element={
                      <ProtectedRoute>
                        <AdminAddEditProductPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products/:id/edit"
                    element={
                      <ProtectedRoute>
                        <AdminAddEditProductPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
