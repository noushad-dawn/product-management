import React, { useState } from 'react';
import { FiPlus, FiCheck, FiX, FiList } from 'react-icons/fi';


const ProcessManager = () => {
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Process 1', value: '' },
    { id: 2, name: 'Process 2', value: '' },
    { id: 3, name: 'Process 3', value: '' }
  ]);
  const [currentProcesses, setCurrentProcesses] = useState([]);

  const handleProcessChange = (id, value) => {
    setProcesses(processes.map(process => 
      process.id === id ? { ...process, value } : process
    ));
  };

  const addNewProcess = () => {
    const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([...processes, { id: newId, name: `Process ${newId}`, value: '' }]);
  };

  const assignProcesses = () => {
    const assigned = processes
      .filter(process => process.value.trim() !== '')
      .map(process => ({
        name: process.name,
        value: process.value
      }));
    
    setCurrentProcesses(assigned);
    setProcesses(processes.map(process => ({
      ...process,
      value: ''
    })));
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter(process => process.id !== id));
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <FiList className="h-6 w-6" />
            <h2 className="text-xl font-bold">Process Workflow Manager</h2>
          </div>
          <p className="mt-1 text-blue-100">Define and manage your operational processes</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {processes.map(process => (
              <div key={process.id} className="flex items-start space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {process.name}
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value={process.value}
                      onChange={(e) => handleProcessChange(process.id, e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`e.g. ${process.name.replace('Process', '').trim() === '1' ? 'Washing' : process.name.replace('Process', '').trim() === '2' ? 'Ironing' : 'Packing'}`}
                    />
                    {process.id > 3 && (
                      <button 
                        onClick={() => removeProcess(process.id)}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={addNewProcess}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Process Step
              </button>
              
              <button
                onClick={assignProcesses}
                disabled={!processes.some(p => p.value.trim() !== '')}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  processes.some(p => p.value.trim() !== '') 
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <FiCheck className="mr-2 h-4 w-4" />
                Save Process Flow
              </button>
            </div>
          </div>

          {currentProcesses.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiList className="mr-2 text-blue-500" />
                Current Workflow
              </h3>
              <ul className="mt-4 space-y-3">
                {currentProcesses.map((process, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {process.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {process.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessManager;