import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const AdminDashboardPage = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error loading products:', err);
      toast.error('Failed to load products');
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const response = await api.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error loading orders:', err);
      toast.error('Failed to load orders');
    }
  }, []);

  useEffect(() => {
    Promise.all([loadProducts(), loadOrders()]).then(() => {
      setIsLoading(false);
    });
  }, [loadProducts, loadOrders]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Manage products and orders</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/products/new"
                className="bg-accent text-white px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition-all text-sm"
              >
                + Add Product
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-accent" />
            <p className="mt-4 text-secondary">Loading...</p>
          </div>
        ) : activeTab === 'products' ? (
          /* Products Tab */
          <div className="bg-surface rounded-lg shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-secondary">
                        No products found. <Link to="/admin/products/new" className="text-accent hover:underline">Add one</Link>
                      </td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] ? (
                              <img
                                src={`http://localhost:5000${product.images[0]}`}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-primary">{product.name}</p>
                              <p className="text-sm text-secondary line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary">{product.category || '-'}</td>
                        <td className="px-4 py-3 font-medium">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">{product.stock}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${product.isActive ? 'text-success' : 'text-danger'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className="text-primary hover:text-accent transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                              className="text-danger hover:text-danger/80 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Orders Tab */
          <div className="bg-surface rounded-lg shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-secondary">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr
                        key={order._id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?._id === order._id ? 'bg-gray-50' : ''}`}
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      >
                        <td className="px-4 py-3 font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-secondary">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{order.items.length} items</td>
                        <td className="px-4 py-3 font-medium">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedOrder(selectedOrder?._id === order._id ? null : order);
                            }}
                            className="text-primary hover:text-accent transition-colors"
                          >
                            {selectedOrder?._id === order._id ? 'Close' : 'View'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Order Details Panel */}
            {selectedOrder && (
              <div className="border-t p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Customer Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-secondary">Name:</span> {selectedOrder.customerName}</p>
                      <p><span className="text-secondary">Email:</span> {selectedOrder.customerEmail}</p>
                      <p><span className="text-secondary">Phone:</span> {selectedOrder.customerPhone}</p>
                      <p className="mt-2"><span className="text-secondary">Address:</span></p>
                      <p className="text-secondary">{selectedOrder.shippingAddress.street}</p>
                      <p className="text-secondary">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.productName} (Size: {item.size}) x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-secondary bg-white p-3 rounded">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4">
                  <label className="text-sm font-medium text-secondary">Update Status:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={e => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status} className="capitalize">{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
