import React, { useState, useEffect } from 'react';
import {
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiCircle,
  FiCheckCircle,
  FiTruck,
  FiSearch
} from 'react-icons/fi';
import axios from 'axios';

const ProcessDashboard = () => {
  // State for process types fetched from backend
  const [processTypes, setProcessTypes] = useState([]);
  const [isLoadingProcessTypes, setIsLoadingProcessTypes] = useState(true);
  const [errorProcessTypes, setErrorProcessTypes] = useState(null);

  // State for product data fetched from the product API
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);

  // State for search term (product/customer name)
  const [searchTerm, setSearchTerm] = useState('');
  // State for selected process status filter
  const [processStatusFilter, setProcessStatusFilter] = useState('');

  // Get unique process statuses from products
// Get unique process statuses from all steps in all products
const uniqueProcessStatuses = [...new Set(
  products.flatMap(product => 
    product.processStatus?.map(status => status.stepName) || []
  )
)].filter(Boolean);

  // Filtered products based on search term and process status
  const filteredProducts = products.filter(product => {
    const productName = product.productDetails?.productName?.toLowerCase() || '';
    const customerName = product.customerDetails?.customerName?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = productName.includes(searchLower) || customerName.includes(searchLower);

    const currentProductStatus = product.processStatus && product.processStatus.length > 0
      ? product.processStatus[product.currentStepIndex - 1]?.stepName
      : null;
    const statusMatch = !processStatusFilter || currentProductStatus === processStatusFilter;

    return nameMatch && statusMatch;
  });

  // Fetch process types from backend
  const fetchProcessTypes = async () => {
    try {
      setIsLoadingProcessTypes(true);
      const response = await axios.get('http://localhost:5000/api/process/process-flow', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.flow) {
        const mappedProcesses = response.data.flow.steps.map((step, index) => ({
          id: `process${index + 1}`,
          name: step.description || `Process ${index + 1}`,
          color: getColorForProcess(index)
        }));
        setProcessTypes(mappedProcesses);
      }
    } catch (err) {
      setErrorProcessTypes('Failed to fetch process types');
      console.error(err);
    } finally {
      setIsLoadingProcessTypes(false);
    }
  };

  // Fetch product data from the product API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await axios.get('http://localhost:5000/api/product', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(response.data);
    } catch (err) {
      setErrorProducts('Failed to fetch product data');
      console.error(err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Helper function to assign colors based on process index
  const getColorForProcess = (index) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-orange-100 text-orange-600',
      'bg-red-100 text-red-600',
      'bg-yellow-100 text-yellow-600',
      'bg-indigo-100 text-indigo-600',
      'bg-pink-100 text-pink-600'
    ];
    return colors[index % colors.length];
  };

  // Calculate process counts for the dashboard cards based on fetched products
  const calculateProductProcessCounts = () => {
    const counts = {};
    processTypes.forEach(type => {
      counts[type.name] = 0; // Use process name from processTypes
    });

    products.forEach(product => {
      if (product.processStatus && product.processStatus.length > 0) {
        const currentStep = product.processStatus[product.currentStepIndex - 1]?.stepName;
        if (currentStep && counts[currentStep] !== undefined) {
          counts[currentStep]++;
        }
      }
    });
    return counts;
  };

  const [productProcessCounts, setProductProcessCounts] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchProcessTypes();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (processTypes.length > 0 && products.length > 0) {
      const counts = calculateProductProcessCounts();
      setProductProcessCounts(counts);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [processTypes, products]);

  const toggleProcessView = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const refreshData = () => {
    fetchProcessTypes();
    fetchProducts();
    setProductProcessCounts(calculateProductProcessCounts());
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const getProcessIcon = (processId) => {
    if (processId === 'delivery') return <FiTruck size={20} />;
    return <FiCircle size={20} />;
  };

  if (isLoadingProcessTypes || isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (errorProcessTypes || errorProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorProcessTypes || errorProducts}</span>
        </div>
      </div>
    );
  }

  if (!processTypes.length === 0 || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Process Monitoring Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-3">Last updated: {lastUpdated}</span>
            <button
              onClick={refreshData}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiRefreshCw className="mr-1" /> Refresh
            </button>
          </div>
        </div>

        {/* Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {processTypes.map((process) => (
            <div key={process.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className={`p-4 ${process.color}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{process.name}</p>
                    <p className="text-2xl font-bold mt-1">
                      {productProcessCounts[process.name] || '0'}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-white bg-opacity-30">
                    {getProcessIcon(process.id)}
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
                <span className="font-medium">Products in this stage</span>
              </div>
            </div>
          ))}
        </div>

        {/* Product Data Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Product Order Details</h3>
            <div className="flex items-center space-x-4">
              {/* Process Status Dropdown */}
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={processStatusFilter}
                  onChange={(e) => setProcessStatusFilter(e.target.value)}
                >
                  <option value="">All Process Statuses</option>
                  {uniqueProcessStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown className="h-5 w-5" />
                </div>
              </div>
              {/* Search Bar */}
              <div className="relative rounded-md shadow-sm w-64"> {/* Increased width */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by Product or Customer Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <React.Fragment key={product._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.productDetails.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.productDetails.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productDetails.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.customerDetails.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleProcessView(product._id)}
                          className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                        >
                          {expandedProductId === product._id ? (
                            <>
                              <FiChevronUp className="mr-1" /> Hide
                            </>
                          ) : (
                            <>
                              <FiChevronDown className="mr-1" /> View
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedProductId === product._id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {product.processStatus && product.processStatus.map((status) => {
                              const processInfo = processTypes.find(p => p.name === status.stepName);
                              if (!processInfo) return null;

                              return (
                                <div key={status._id} className="border p-4 rounded-lg">
                                  <div className="flex items-center">
                                    <div className={`p-2 rounded-full ${processInfo.color} mr-3`}>
                                      {getProcessIcon(processInfo.id)} {/* Use processInfo.id for icon */}
                                    </div>
                                    <h3 className="font-bold text-gray-700">{processInfo.name}</h3>
                                  </div>
                                  <div className="mt-3">
                                    <p className="text-sm text-gray-600">
                                      Updated:{' '}
                                      <span className="font-medium">
                                        {new Date(status.updatedAt).toLocaleDateString()} at{' '}
                                        {new Date(status.updatedAt).toLocaleTimeString()}
                                      </span>
                                    </p>
                                    {status.userId && (
                                      <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-medium">User ID:</span> {status.userId}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {!product.processStatus || product.processStatus.length === 0 && (
                              <div className="col-span-full text-gray-500">
                                No process status available for this product.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDashboard;