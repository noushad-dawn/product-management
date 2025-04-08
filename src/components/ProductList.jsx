import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import QRCode from 'react-qr-code';
import { FiDownload, FiPrinter, FiX } from 'react-icons/fi';

const dummyProducts = [
  {
    id: 1,
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 25.99,
    quantity: 10,
    userId: 'U001',
  },
  {
    id: 2,
    name: 'T-Shirt',
    category: 'Clothing',
    price: 15.49,
    quantity: 5,
    userId: 'U002',
  },
  {
    id: 3,
    name: 'Sofa Set',
    category: 'Furniture',
    price: 599.99,
    quantity: 2,
    userId: 'U003',
  },
  {
    id: 4,
    name: 'Bluetooth Headphones',
    category: 'Electronics',
    price: 89.99,
    quantity: 8,
    userId: 'U004',
  },
  {
    id: 5,
    name: 'Coffee Table',
    category: 'Furniture',
    price: 129.99,
    quantity: 3,
    userId: 'U005',
  },
  // Add more products as needed
];

const ProductList = () => {
  const [qrData, setQrData] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const qrRef = useRef(null);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(dummyProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products_list.xlsx", { compression: true });
  };

  const generateQR = (product) => {
    const data = {
      name: product.name,
      price: product.price,
      id: product.id,
      category: product.category
    };
    setQrData({
      text: JSON.stringify(data),
      productName: product.name,
      productPrice: product.price
    });
    setShowQrModal(true);
  };

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgSize = 200;
    canvas.width = svgSize;
    canvas.height = svgSize;

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${qrData.productName.replace(/\s+/g, "_")}_qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Inventory</h2>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.userId}</td>
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

        {/* Excel download button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FiDownload className="mr-2" />
            Export to Excel
          </button>
        </div>

        {/* QR Modal */}
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
                <p className="text-blue-600 font-semibold mb-3">${qrData?.productPrice?.toFixed(2)}</p>
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
    </div >
  );
};

export default ProductList;
