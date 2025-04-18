import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import axios from 'axios';

const ProductManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    productName: '',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    phoneNumber: '',
    address: '',
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/product', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setProducts(response.data);

        const categoriesResponse = await axios.get('http://localhost:5000/api/category/categories', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (categoriesResponse.data.categories?.categories) {
          setCategories(categoriesResponse.data.categories.categories);
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };


    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const productData = {
        category: formData.category,
        productName: formData.productName,
        quantity: formData.quantity,
        price: formData.price,
        date: formData.date,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      };
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const response = await axios.post('http://localhost:5000/api/product/add', productData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setProducts([...products, response.data.product]);
      setShowForm(false);
      setFormData({
        category: '',
        productName: '',
        quantity: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        phoneNumber: '',
        address: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    alert('Are you sure you want to delete this product? This action cannot be undone.');
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/product/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
      );
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  
  const filteredProducts = products.filter(product => {
    const lowerQuery = searchQuery.toLowerCase();
    const productName = product.productDetails.productName.toLowerCase();
    const customerName = product.customerDetails.customerName.toLowerCase();
    const mobileNumber = product.customerDetails.phoneNumber.toLowerCase();

    
    return (
      productName.includes(lowerQuery) ||
      customerName.includes(lowerQuery) ||
      mobileNumber.includes(lowerQuery)
    ) 
  });


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
          >
            {showForm ? <FiX className="mr-2" /> : <FiPlus className="mr-2" />}
            {showForm ? 'Close Form' : 'Add Product'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Inline Product Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Customer Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
                {/* Search input */}
                <div className="mb-4">
                  <div className="flex items-center border rounded-md">
                    <FiSearch className="ml-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by name, customer name, or mobile number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="py-2 px-4 w-full border-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading && !showForm ? (
            <div className="p-6 text-center">Loading products...</div>
          ) : (
            
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.productDetails.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.productDetails.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{parseFloat(product.productDetails.price).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(product.productDetails.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{product.customerDetails.customerName}</div>
                          <div className="text-gray-500 text-xs">{product.customerDetails.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={loading}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No products found. Click "Add Product" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;