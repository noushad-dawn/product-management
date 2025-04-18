import React, { useState, useRef } from 'react';
import { FiDownload, FiPrinter, FiX } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import * as XLSX from 'xlsx';

const UserTable = () => {
  // Sample user data
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '123-456-7890',
      address: '123 Main St, New York, NY'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phoneNumber: '234-567-8901',
      address: '456 Oak Ave, Los Angeles, CA'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phoneNumber: '345-678-9012',
      address: ''
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      phoneNumber: '456-789-0123',
      address: '789 Pine Rd, Chicago, IL'
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phoneNumber: '567-890-1234',
      address: '321 Elm Blvd, Houston, TX'
    }
  ];


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Directory</h2>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.address || 'Not provided'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserTable;