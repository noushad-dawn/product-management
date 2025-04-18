import React, { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiX, FiList } from 'react-icons/fi';
import axios from 'axios';

const ProcessManager = ({ clientId }) => {
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Process 1', value: '' },
    { id: 2, name: 'Process 2', value: '' },
    { id: 3, name: 'Process 3', value: '' }
  ]);
  const [currentProcesses, setCurrentProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing process flow when component mounts
  useEffect(() => {
    const fetchProcessFlow = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/process/process-flow', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.flow) {
          const mappedProcesses = response.data.flow.steps.map((step, index) => ({
            id: index + 1,
            name: `Process ${index + 1}`,
            value: step.description
          }));
          
          // Fill in any additional processes beyond the initial 3
          const additionalProcesses = [];
          for (let i = mappedProcesses.length; i < processes.length; i++) {
            additionalProcesses.push({
              id: i + 1,
              name: `Process ${i + 1}`,
              value: ''
            });
          }
          
          setProcesses([...mappedProcesses, ...additionalProcesses]);
          setCurrentProcesses(response.data.flow.steps);
        }
      } catch (err) {
        setError('Failed to fetch process flow');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

 
      fetchProcessFlow();

  }, []);

  const handleProcessChange = (id, value) => {
    setProcesses(processes.map(process => 
      process.id === id ? { ...process, value } : process
    ));
  };

  const addNewProcess = () => {
    const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([...processes, { id: newId, name: `Process ${newId}`, value: '' }]);
  };

  const assignProcesses = async () => {
    try {
      setIsLoading(true);
      const steps = processes
        .filter(process => process.value.trim() !== '')
        .map(process => ({
          stepName: process.name,
          description: process.value
        }));
      
      const response = await axios.post('http://localhost:5000/api/process/process-flow', { steps }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setCurrentProcesses(steps);
      setProcesses(processes.map(process => ({
        ...process,
        value: process.value.trim() !== '' ? process.value : ''
      })));
    } catch (err) {
      setError('Failed to save process flow');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter(process => process.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
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
                disabled={!processes.some(p => p.value.trim() !== '') || isLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  processes.some(p => p.value.trim() !== '') && !isLoading
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2 h-4 w-4" />
                    Save Process Flow
                  </>
                )}
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
                        {process.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {process.stepName}
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