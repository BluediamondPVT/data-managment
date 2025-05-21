import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState({
        name: '',
        phoneNumber: '',
        reference: '',
        remark: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    // const navigate = useNavigate();

    // Fetch all customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                console.log('Fetching data from API...');
                const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/customers`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Data received:', data);
                
                // Handle different data structures
                if (Array.isArray(data)) {
                    setCustomers(data);
                } else if (data && typeof data === 'object') {
                    const customersArray = data.customers || data.data || data.results || [];
                    setCustomers(Array.isArray(customersArray) ? customersArray : []);
                } else {
                    setCustomers([]);
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching customer data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Add new customer
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentCustomer),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newCustomer = await response.json();
            setCustomers([...customers, newCustomer]);
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            console.error('Error adding customer:', error);
            alert(`Failed to add customer: ${error.message}`);
        }
    };

    // Update customer
    const handleUpdateCustomer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/customers/${currentCustomer._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentCustomer),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedCustomer = await response.json();
            setCustomers(customers.map(customer => 
                customer._id === currentCustomer._id ? updatedCustomer : customer
            ));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating customer:', error);
            alert(`Failed to update customer: ${error.message}`);
        }
    };

    // Delete customer
    const handleDeleteCustomer = async () => {
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/customers/${currentCustomer._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setCustomers(customers.filter(customer => customer._id !== currentCustomer._id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert(`Failed to delete customer: ${error.message}`);
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCustomer({ ...currentCustomer, [name]: value });
    };

    // Reset form
    const resetForm = () => {
        setCurrentCustomer({
            name: '',
            phoneNumber: '',
            reference: '',
            remark: ''
        });
    };

    // Open edit modal with customer data
    const openEditModal = (customer) => {
        setCurrentCustomer(customer);
        setShowEditModal(true);
    };

    // Open delete modal with customer data
    const openDeleteModal = (customer) => {
        setCurrentCustomer(customer);
        setShowDeleteModal(true);
    };

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer => 
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        customer.phoneNumber?.includes(searchTerm) ||
        customer.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.remark?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    onClick={() => setShowAddModal(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Customer
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
                        placeholder="Search customers by name, phone, reference or remark..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-lg">
                        {searchTerm ? "No customers match your search criteria." : "No customers found. Add one to get started!"}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3 px-6">ID</th>
                                <th scope="col" className="py-3 px-6">Name</th>
                                <th scope="col" className="py-3 px-6">Phone Number</th>
                                <th scope="col" className="py-3 px-6">Reference</th>
                                <th scope="col" className="py-3 px-6">Remark</th>
                                <th scope="col" className="py-3 px-6">Created Date</th>
                                <th scope="col" className="py-3 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer, index) => (
                                <tr key={customer._id || index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="py-4 px-6">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{customer.name}</td>
                                    <td className="py-4 px-6">{customer.phoneNumber}</td>
                                    <td className="py-4 px-6">{customer.reference || '-'}</td>
                                    <td className="py-4 px-6">{customer.remark || '-'}</td>
                                    <td className="py-4 px-6">{formatDate(customer.createdAt)}</td>
                                    <td className="py-4 px-6 flex space-x-2">
                                        <button 
                                            onClick={() => openEditModal(customer)}
                                            className="font-medium text-blue-600 hover:text-blue-900"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => openDeleteModal(customer)}
                                            className="font-medium text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">Add New Customer</h3>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomer} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name*
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={currentCustomer.name} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                                    Phone Number*
                                </label>
                                <input 
                                    type="text" 
                                    id="phoneNumber" 
                                    name="phoneNumber" 
                                    value={currentCustomer.phoneNumber} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reference">
                                    Reference
                                </label>
                                <input 
                                    type="text" 
                                    id="reference" 
                                    name="reference" 
                                    value={currentCustomer.reference} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remark">
                                    Remark
                                </label>
                                <textarea 
                                    id="remark" 
                                    name="remark" 
                                    value={currentCustomer.remark} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-end p-4 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Customer Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Customer</h3>
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateCustomer} className="p-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                                    Name*
                                </label>
                                <input 
                                    type="text" 
                                    id="edit-name" 
                                    name="name" 
                                    value={currentCustomer.name} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-phoneNumber">
                                    Phone Number*
                                </label>
                                <input 
                                    type="text" 
                                    id="edit-phoneNumber" 
                                    name="phoneNumber" 
                                    value={currentCustomer.phoneNumber} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-reference">
                                    Reference
                                </label>
                                <input 
                                    type="text" 
                                    id="edit-reference" 
                                    name="reference" 
                                    value={currentCustomer.reference} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-remark">
                                    Remark
                                </label>
                                <textarea 
                                    id="edit-remark" 
                                    name="remark" 
                                    value={currentCustomer.remark} 
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-end p-4 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Update Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-5">Confirm Delete</h3>
                            <p className="text-sm text-gray-500 mb-5">
                                Are you sure you want to delete the customer <span className="font-medium">{currentCustomer.name}</span>? 
                                This action cannot be undone.
                            </p>
                            <div className="flex items-center justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleDeleteCustomer}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;