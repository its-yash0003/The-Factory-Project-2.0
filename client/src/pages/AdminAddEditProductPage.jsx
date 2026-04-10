import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AdminAddEditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [],
    stock: '100',
    isActive: true
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const loadProduct = useCallback(async (abortController) => {
    if (!isEditMode) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get(`/api/products/${id}`, {
        signal: abortController?.signal
      });
      const product = response.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        sizes: product.sizes || [],
        stock: product.stock?.toString() || '100',
        isActive: product.isActive ?? true
      });
      setExistingImages(product.images || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading product:', err);
        toast.error('Failed to load product');
        navigate('/admin');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    const abortController = new AbortController();
    loadProduct(abortController);
    return () => abortController.abort();
  }, [loadProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + existingImages.length - imagesToRemove.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    setImages(files);
  };

  const handleRemoveExistingImage = (imagePath) => {
    setImagesToRemove(prev => [...prev, imagePath]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }

    setIsSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('sizes', JSON.stringify(formData.sizes));
      submitData.append('stock', formData.stock);
      submitData.append('isActive', formData.isActive);

      if (imagesToRemove.length > 0) {
        submitData.append('removeImages', JSON.stringify(imagesToRemove));
      }

      images.forEach(image => {
        submitData.append('images', image);
      });

      if (isEditMode) {
        await api.put(`/api/products/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/api/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully');
      }

      navigate('/admin');
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-accent" />
          <p className="mt-4 text-secondary">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="text-secondary hover:text-primary transition-colors mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="font-display font-bold text-3xl">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-card p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Product Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., Classic Navy Snapback"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Price ($) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="24.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g., Snapback"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {allSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-md font-medium transition-all ${
                    formData.sizes.includes(size)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded focus:ring-primary/20"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-secondary">
              Product is active (visible on store)
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Product Images (max 4)
            </label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img)}
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        imagesToRemove.includes(img) ? 'bg-green-500' : 'bg-danger'
                      }`}
                    >
                      {imagesToRemove.includes(img) ? '✓' : '×'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-secondary mt-1">
              {images.length} new image(s) selected.
              {existingImages.length - imagesToRemove.length + images.length} / 4 total
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-accent text-white py-3 rounded-md font-semibold hover:bg-accent/90 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Product' : 'Create Product'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 border-2 border-gray-300 rounded-md font-semibold text-secondary hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddEditProductPage;
