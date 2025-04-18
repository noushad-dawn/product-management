import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [inputCategories, setInputCategories] = useState([
        { categoryName: '', description: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch existing categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/category/categories', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCategories(response.data.categories?.categories || []);
            } catch (err) {
                setError('Failed to fetch categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (categoryName) => {
        if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            setLoading(true);
            const response = await axios.delete(
                `http://localhost:5000/api/category/categories/${categoryName}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCategories(response.data.categories);
            setSuccess(`Category "${categoryName}" deleted successfully`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete category');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCategories = [...inputCategories];
        updatedCategories[index] = {
            ...updatedCategories[index],
            [name]: value
        };
        setInputCategories(updatedCategories);
    };

    const addInputField = () => {
        setInputCategories([...inputCategories, { categoryName: '', description: '' }]);
    };

    const removeInputField = (index) => {
        const updatedCategories = [...inputCategories];
        updatedCategories.splice(index, 1);
        setInputCategories(updatedCategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate at least one category has a name
        const hasValidCategory = inputCategories.some(
            cat => cat.categoryName.trim() !== ''
        );

        if (!hasValidCategory) {
            setError('At least one category name is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            setLoading(true);

            // Filter out empty category names and prepare new categories
            const newCategories = inputCategories
                .filter(cat => cat.categoryName.trim() !== '')
                .map(cat => ({
                    categoryName: cat.categoryName.trim(),
                    description: cat.description.trim()
                }));

            // Combine with existing categories
            const updatedCategories = [...categories, ...newCategories];

            const response = await axios.post('http://localhost:5000/api/category/categories',
                { categories: updatedCategories },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCategories(response.data.categories.categories);
            setInputCategories([{ categoryName: '', description: '' }]);
            setSuccess('Categories saved successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Category Management</h1>

            {/* Add Categories Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Add New Categories</h2>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {inputCategories.map((input, index) => (
                        <div key={index} className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full mr-2">
                                        {index + 1}
                                    </span>
                                    <h3 className="font-medium text-gray-700">Category Details</h3>
                                </div>
                                {inputCategories.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeInputField(index)}
                                        className="text-gray-500 hover:text-red-600 transition-colors flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-1">Remove</span>
                                    </button>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={input.categoryName}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter category name"
                                    required={index === 0}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={input.description}
                                    onChange={(e) => handleInputChange(index, e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    rows="3"
                                    placeholder="Enter category description (optional)"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-wrap gap-4 mt-2">
                        <button
                            type="button"
                            onClick={addInputField}
                            className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Another Category
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save All Categories
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Current Categories Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                    <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Current Categories</h2>
                </div>

                {loading && categories.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No categories found</h3>
                        <p className="text-gray-500">Add your first category using the form above</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {categories.map((category, index) => (
                            <div key={index} className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-lg text-gray-800 flex items-center">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                                {index + 1}
                                            </span>
                                            {category.categoryName}
                                        </h3>
                                        {category.description && (
                                            <p className="text-gray-600 mt-2 pl-6">{category.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(category.categoryName)}
                                        disabled={loading}
                                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 flex items-center"
                                        title="Delete category"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;