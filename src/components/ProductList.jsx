import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import QRCode from 'react-qr-code';
import { FiDownload, FiPrinter, FiX, FiSearch } from 'react-icons/fi';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const qrRef = useRef(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/product', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDownload = () => {
    // Format products for Excel export
    const formattedProducts = filteredProducts.map(product => ({
      'Product Name': product.productDetails.productName,
      'Category': product.category,
      'Price': product.productDetails.price,
      'Quantity': product.productDetails.quantity,
      'Customer Name': product.customerDetails.customerName,
      'Mobile Number': product.customerDetails.phoneNumber,
      'Date': new Date(product.productDetails.date).toLocaleDateString()
    }));

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    const worksheet = XLSX.utils.json_to_sheet(formattedProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, `products_list_${dateString}.xlsx`, { compression: true });
  };

  const generateQR = (product) => {
    const data = {
      name: product.productDetails.productName,
      price: product.productDetails.price,
      id: product._id,
      category: product.category,
      date: product.productDetails.date
    };
    setQrData({
      text: JSON.stringify(data),
      productName: product.productDetails.productName,
      productPrice: product.productDetails.price
    });
    setShowQrModal(true);
  };

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const qrSize = 180;
    const padding = 20;
    const textHeight = 40;
    canvas.width = qrSize + padding * 2;
    canvas.height = qrSize + padding * 2 + textHeight * 2;

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000000";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      const maxWidth = qrSize;
      const productName = qrData.productName;

      const lines = [];
      let line = '';
      const words = productName.split(' ');
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, padding + (i * 18));
      });

      ctx.drawImage(img, padding, padding + (lines.length * 18), qrSize, qrSize);

      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#2b6cb0";
      ctx.fillText(`₹${qrData.productPrice.toFixed(2)}`, canvas.width / 2, padding + qrSize + (lines.length * 18) + 30);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${qrData.productName.replace(/\s+/g, "_")}_qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const filteredProducts = products.filter(product => {
    const lowerQuery = searchQuery.toLowerCase();
    const productName = product.productDetails.productName.toLowerCase();
    const customerName = product.customerDetails.customerName.toLowerCase();
    const mobileNumber = product.customerDetails.phoneNumber.toLowerCase();

    // Date filter logic
    const productDate = new Date(product.productDetails.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const isInDateRange =
      (!start || productDate >= start) &&
      (!end || productDate <= end);

    return (
      productName.includes(lowerQuery) ||
      customerName.includes(lowerQuery) ||
      mobileNumber.includes(lowerQuery)
    ) && isInDateRange;
  });

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Inventory</h2>
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

        {/* Date filter */}
        <div className="mb-4 flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="py-2 px-4 border rounded-md"
          />
          <span className="text-gray-600">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="py-2 px-4 border rounded-md"
          />
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">

          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.productDetails.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{product.productDetails.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.productDetails.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.customerDetails.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.customerDetails.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.productDetails.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => generateQR(product)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Generate QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {products.length > 0 && (
          <div className="fixed bottom-40 right-6">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FiDownload className="mr-2" />
              Export to Excel
            </button>
          </div>
        )}

        {showQrModal && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Product QR Code</h3>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div
                id="qr-code-element"
                ref={qrRef}
                className="print-area bg-white p-4 rounded-lg border border-gray-200 mb-4 flex flex-col items-center"
              >
                <h4 className="text-lg font-medium text-gray-800 mb-1">{qrData?.productName}</h4>
                <p className="text-blue-600 font-semibold mb-3">₹{qrData?.productPrice?.toFixed(2)}</p>
                <QRCode
                  value={qrData?.text || ''}
                  size={180}
                  level="Q"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
                <p className="text-xs text-gray-500 mt-3">Scan for product details</p>
              </div>

              <div className="flex space-x-3 w-full no-print">
                <button
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <FiDownload className="mr-2" />
                  Download
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FiPrinter className="mr-2" />
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;