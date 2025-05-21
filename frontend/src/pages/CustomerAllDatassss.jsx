// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Table, Card, Button, Form, Modal, Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';

// const CustomerAllData = () => {
//     const [customers, setCustomers] = useState([]);
//     const [filteredCustomers, setFilteredCustomers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//     const [selectedCustomer, setSelectedCustomer] = useState(null);
//     const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);

//     useEffect(() => {
//         fetchCustomers();
//     }, []);

//     const fetchCustomers = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch('http://localhost:5000/api/customers');

//             if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//             }

//             const result = await response.json();
//             // Assuming your API returns { data: [...] }
//             const customerList = Array.isArray(result.data) ? result.data : [];

//             setCustomers(customerList);
//             setFilteredCustomers(customerList);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching customer data:', error);
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
//         if (!confirmDelete) return;

//         try {
//             const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to delete customer. Status: ${response.status}`);
//             }

//             toast.success('Customer deleted successfully!');
//             // Refetch fresh data from server after delete
//             fetchCustomers();
//         } catch (error) {
//             console.error('Error deleting customer:', error);
//             toast.error('Failed to delete customer. Please try again.');
//         }
//     };

//     const handleUpdate = (id) => {
//         const customer = customers.find(c => c._id === id);
//         if (!customer) return;

//         setSelectedCustomer(customer);
//         setIsUpdateModalOpen(true);
//     };

//     // Sort function
//     const requestSort = (key) => {
//         let direction = 'asc';
//         if (sortConfig.key === key && sortConfig.direction === 'asc') {
//             direction = 'desc';
//         }
//         setSortConfig({ key, direction });
        
//         const sortedData = [...filteredCustomers].sort((a, b) => {
//             if (a[key] < b[key]) {
//                 return direction === 'asc' ? -1 : 1;
//             }
//             if (a[key] > b[key]) {
//                 return direction === 'asc' ? 1 : -1;
//             }
//             return 0;
//         });
        
//         setFilteredCustomers(sortedData);
//     };
    
//     // Pagination logic - ensure we calculate this correctly
//     const totalItems = filteredCustomers.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
    
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    
//     const paginate = (pageNumber) => {
//         setCurrentPage(pageNumber);
//         // Force scroll to top when changing page
//         window.scrollTo(0, 0);
//     };
    
//     // Generate page numbers for pagination
//     const getPageNumbers = () => {
//         const pageNumbers = [];
//         const maxPageNumbersToShow = 5;
        
//         if (totalPages <= maxPageNumbersToShow) {
//             // If we have fewer pages than max to show, display all page numbers
//             for (let i = 1; i <= totalPages; i++) {
//                 pageNumbers.push(i);
//             }
//         } else {
//             // Always include first page, last page, current page and one page before and after current
//             const startPage = Math.max(1, currentPage - 1);
//             const endPage = Math.min(totalPages, currentPage + 1);
            
//             if (startPage > 1) {
//                 pageNumbers.push(1);
//                 if (startPage > 2) {
//                     pageNumbers.push('...');
//                 }
//             }
            
//             for (let i = startPage; i <= endPage; i++) {
//                 pageNumbers.push(i);
//             }
            
//             if (endPage < totalPages) {
//                 if (endPage < totalPages - 1) {
//                     pageNumbers.push('...');
//                 }
//                 pageNumbers.push(totalPages);
//             }
//         }
        
//         return pageNumbers;
//     };

//     // Modal close handler
//     const closeModal = () => {
//         setIsUpdateModalOpen(false);
//         setSelectedCustomer(null);
//     };

//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return 'Invalid Date';
        
//         return new Intl.DateTimeFormat('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//         }).format(date);
//     };
    
//     // Get relative time for display
//     const getRelativeTime = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
        
//         const now = new Date();
//         const diffInSeconds = Math.floor((now - date) / 1000);
        
//         if (diffInSeconds < 60) return 'Just now';
//         if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//         if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//         if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//         return '';
//     };

//     // Update form submit handler
//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();
//         const form = e.target;
//         const updatedCustomer = {
//             name: form[0].value.trim(),
//             phoneNumber: form[1].value.trim(),
//             reference: form[2].value.trim(),
//             createdAt: form[3].value || selectedCustomer.createdAt || new Date().toISOString(),
//             remark: form[4].value.trim(),
//         };

//         try {
//             const response = await fetch(`http://localhost:5000/api/customers/${selectedCustomer._id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(updatedCustomer),
//             });

//             if (response.ok) {
//                 toast.success('Customer updated successfully!');
//                 closeModal();
//                 fetchCustomers();
//             } else {
//                 toast.error('Failed to update customer. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error updating customer:', error);
//             toast.error('Failed to update customer. Please try again.');
//         }
//     };

//     // Search functionality (keeping commented for now, but could be enabled)
//     /*
//     const handleSearchChange = (selectedOption) => {
//         if (!selectedOption) {
//             setFilteredCustomers(customers);
//         } else {
//             const searchTerm = selectedOption.value.toLowerCase();
//             const results = customers.filter(customer => 
//                 (customer.name && customer.name.toLowerCase().includes(searchTerm)) ||
//                 (customer.phoneNumber && customer.phoneNumber.includes(searchTerm))
//             );
//             setFilteredCustomers(results);
//         }
//         // Reset to first page whenever search results change
//         setCurrentPage(1);
//     };
    
//     // Format options for search dropdown
//     const options = customers.map(customer => ({
//         value: customer.name || customer.phoneNumber || customer._id,
//         label: `${customer.name || 'N/A'} (${customer.phoneNumber || 'No Phone'})`
//     }));
//     */

//     if (error) return (
//         <Container className="mt-5">
//             <Alert variant="danger">
//                 <Alert.Heading>Error Loading Data</Alert.Heading>
//                 <p>{error}</p>
//             </Alert>
//         </Container>
//     );
    
//     if (loading) return (
//         <Container className="d-flex justify-content-center mt-5">
//             <div className="text-center">
//                 <Spinner animation="border" variant="primary" />
//                 <p className="mt-2">Loading customer data...</p>
//             </div>
//         </Container>
//     );

//     return (
//         <Container fluid className="py-4">
//             <Card className="shadow-sm border-0">
//                 <Card.Header className="bg-primary bg-gradient text-white">
//                     <Row className="align-items-center">
//                         <Col>
//                             <h2 className="mb-0">Customer Data</h2>
//                         </Col>
//                         <Col xs="auto">
//                             <Badge bg="light" text="dark" pill>
//                                 {filteredCustomers.length} Records
//                             </Badge>
//                         </Col>
//                     </Row>
//                 </Card.Header>
//                 <Card.Body>
//                     <Row className="mb-4">
//                         <Col md={6} lg={4}>
//                             {/* Search box would go here, removed for now */}
//                         </Col>
//                     </Row>

//                     {filteredCustomers.length === 0 ? (
//                         <Alert variant="info" className="text-center">
//                             <i className="bi bi-info-circle me-2"></i>
//                             No customers found. Please adjust your search criteria.
//                         </Alert>
//                     ) : (
//                         <>
//                             <div className="table-responsive">
//                                 <Table hover responsive className="align-middle">
//                                     <thead className="bg-light">
//                                         <tr>
//                                             <th className="cursor-pointer">
//                                                 #
//                                             </th>
//                                             <th 
//                                                 onClick={() => requestSort('name')} 
//                                                 className="cursor-pointer"
//                                                 style={{ cursor: 'pointer' }}
//                                             >
//                                                 Name
//                                                 {sortConfig.key === 'name' && (
//                                                     <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
//                                                 )}
//                                             </th>
//                                             <th 
//                                                 onClick={() => requestSort('phoneNumber')} 
//                                                 className="cursor-pointer"
//                                                 style={{ cursor: 'pointer' }}
//                                             >
//                                                 Phone Number
//                                                 {sortConfig.key === 'phoneNumber' && (
//                                                     <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
//                                                 )}
//                                             </th>
//                                             <th 
//                                                 onClick={() => requestSort('reference')} 
//                                                 className="cursor-pointer"
//                                                 style={{ cursor: 'pointer' }}
//                                             >
//                                                 Reference
//                                                 {sortConfig.key === 'reference' && (
//                                                     <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
//                                                 )}
//                                             </th>
//                                             <th>Remark</th>
//                                             <th 
//                                                 onClick={() => requestSort('createdAt')} 
//                                                 className="cursor-pointer"
//                                                 style={{ cursor: 'pointer' }}
//                                             >
//                                                 Date & Time
//                                                 {sortConfig.key === 'createdAt' && (
//                                                     <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
//                                                 )}
//                                             </th>
//                                             <th className="text-center">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody style={{color:"#363636"}}>
//                                         {currentItems.map((customer, idx) => (
//                                             <tr key={customer._id || idx}>
//                                                 <td className="text-muted small">
//                                                     {indexOfFirstItem + idx + 1}
//                                                 </td>
//                                                 <td>
//                                                     <div className="fw-semibold">{customer.name || 'N/A'}</div> 
//                                                 </td>
//                                                 <td>{customer.phoneNumber || 'N/A'}</td>
//                                                 <td>{customer.reference || 'N/A'}</td>
//                                                 <td>
//                                                     <div className="text-wrap" style={{maxWidth: "200px", maxHeight: "60px", overflow: "hidden"}}>
//                                                         {customer.remark || 'N/A'}
//                                                     </div>
//                                                 </td>
//                                                 <td>
//                                                     <div className="d-flex flex-column">
//                                                         {formatDate(customer.createdAt)}
//                                                         <small className="text-muted">{getRelativeTime(customer.createdAt)}</small>
//                                                     </div>
//                                                 </td>
//                                                 <td>
//                                                     <div className="d-flex justify-content-center gap-2">
//                                                         <Button
//                                                             variant="outline-primary"
//                                                             size="sm"
//                                                             onClick={() => handleUpdate(customer._id)}
//                                                         >
//                                                             Edit
//                                                         </Button>
//                                                         <Button
//                                                             variant="outline-danger"
//                                                             size="sm"
//                                                             onClick={() => handleDelete(customer._id)}
//                                                         >
//                                                             Delete
//                                                         </Button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>
//                             </div>
                            
//                             {/* Pagination Controls - Always show if we have data */}
//                             {filteredCustomers.length > 0 && (
//                                 <div className="d-flex justify-content-between align-items-center mt-3">
//                                     <div className="text-muted small">
//                                         Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} entries
//                                     </div>
//                                     <nav aria-label="Customer data pagination">
//                                         <ul className="pagination pagination-sm mb-0">
//                                             <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                                                 <Button 
//                                                     variant="link" 
//                                                     className="page-link" 
//                                                     onClick={() => paginate(currentPage - 1)}
//                                                     disabled={currentPage === 1}
//                                                     aria-label="Previous page"
//                                                 >
//                                                     Previous
//                                                 </Button>
//                                             </li>
                                            
//                                             {getPageNumbers().map((number, index) => (
//                                                 <li 
//                                                     key={index} 
//                                                     className={`page-item ${number === currentPage ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}
//                                                 >
//                                                     {number === '...' ? (
//                                                         <span className="page-link">...</span>
//                                                     ) : (
//                                                         <Button 
//                                                             variant="link" 
//                                                             className="page-link" 
//                                                             onClick={() => paginate(number)}
//                                                             aria-label={`Page ${number}`}
//                                                             aria-current={number === currentPage ? "page" : null}
//                                                         >
//                                                             {number}
//                                                         </Button>
//                                                     )}
//                                                 </li>
//                                             ))}
                                            
//                                             <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                                                 <Button 
//                                                     variant="link" 
//                                                     className="page-link" 
//                                                     onClick={() => paginate(currentPage + 1)}
//                                                     disabled={currentPage === totalPages}
//                                                     aria-label="Next page"
//                                                 >
//                                                     Next
//                                                 </Button>
//                                             </li>
//                                         </ul>
//                                     </nav>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Toast container for notifications */}
//             <ToastContainer position="top-right" autoClose={3000} />

//             {/* Update Modal */}
//             <Modal 
//                 show={isUpdateModalOpen} 
//                 onHide={closeModal} 
//                 centered
//                 backdrop="static"
//                 size="lg"
//             >
//                 <Modal.Header closeButton className="bg-light">
//                     <Modal.Title>Update Customer</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedCustomer && (
//                         <Form onSubmit={handleUpdateSubmit}>
//                             <Row>
//                                 <Col md={6}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Name</Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             defaultValue={selectedCustomer.name}
//                                             required
//                                             placeholder="Enter customer name"
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                                 <Col md={6}>
//                                     <Form.Group className="mb-3">
//                                         <Form.Label>Phone Number</Form.Label>
//                                         <Form.Control
//                                             type="text"
//                                             defaultValue={selectedCustomer.phoneNumber}
//                                             required
//                                             placeholder="Enter phone number"
//                                         />
//                                     </Form.Group>
//                                 </Col>
//                             </Row>
                            
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Reference</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     defaultValue={selectedCustomer.reference}
//                                     placeholder="Enter reference information"
//                                 />
//                             </Form.Group>
                            
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Date & Time of Form Submission</Form.Label>
//                                 <Form.Control
//                                     type="datetime-local"
//                                     defaultValue={selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toISOString().slice(0, 16) : ''}
//                                     placeholder="Select date and time"
//                                 />
//                                 <Form.Text className="text-muted">
//                                     When was this form filled out?
//                                 </Form.Text>
//                             </Form.Group>
                            
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Remark</Form.Label>
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     defaultValue={selectedCustomer.remark}
//                                     placeholder="Enter any additional notes"
//                                 />
//                             </Form.Group>
                            
//                             <div className="d-flex justify-content-end gap-2 mt-4">
//                                 <Button variant="secondary" onClick={closeModal}>
//                                     Cancel
//                                 </Button>
//                                 <Button variant="primary" type="submit">
//                                     Save Changes
//                                 </Button>
//                             </div>
//                         </Form>
//                     )}
//                 </Modal.Body>
//             </Modal>
//         </Container>
//     );
// };

// export default CustomerAllData;



import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Tagging from './Tagging'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Card, Button, Form, Modal, Container, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import Pagination from './Pagination'; // Import the separate Pagination component

const CustomerAllData = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Service options for dropdown
    const serviceOptions = [
        { value: 'website Design', label: 'website Design' },
        { value: 'Website Development', label: 'Website Development' },
        { value: 'Company profile', label: 'Company profile' },
        { value: 'Logo', label: 'Logo' },
        { value: 'Brouchure', label: 'Brouchure' },
        { value: 'catelog', label: 'catelog' },
        { value: 'ERP', label: 'ERP' },
        { value: 'CRM', label: 'CRM' },
        { value: 'Complete Branding', label: 'Complete Branding' },
        { value: 'SMM', label: 'SMM' },
        { value: 'SEO', label: 'SEO' },
        { value: 'PPT', label: 'PPT' },
        { value: 'G-suite', label: 'G-suite' }
    ];
    
    // Status options and their colors
    const statusOptions = [
        { value: 'Quotation Sent', label: 'Quotation Sent', color: '#FFF9C4' }, // Light yellow
        { value: 'Payment Done', label: 'payment done', color: '#BBDEFB' }, // Light blue
        { value: 'Lead Lost', label: 'lead lost', color: '#C8E6C9' }, // Light green
        { value: 'Follow Up', label: 'follow up', color: '#FFCDD2' }, // Light red
        // { value: 'onHold', label: 'On Hold', color: '#E1BEE7' } // Light purple
    ];

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Use useEffect to handle data changes and pagination reset
    useEffect(() => {
        if (customers.length > 0) {
            setFilteredCustomers(customers);
            setCurrentPage(1); // Reset to first page when data changes
        }
    }, [customers]);

    // Format demo data for testing if API call is failing
    const addDemoData = () => {
        const demoCustomers = [];
        for (let i = 1; i <= 35; i++) {
            demoCustomers.push({
                _id: `demo_${i}`,
                name: `Demo Customer ${i}`,
                phoneNumber: `555-${100 + i}`,
                reference: `Ref-${i}`,
                createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                remark: `This is a demo customer ${i}`,
                // Assign service as before
                service: i % 13 === 0 ? 'G-suite' :
                         i % 12 === 0 ? 'PPT' :
                         i % 11 === 0 ? 'SEO' :
                         i % 10 === 0 ? 'SMM' :
                         i % 9 === 0 ? 'Complete Branding' :
                         i % 8 === 0 ? 'CRM' :
                         i % 7 === 0 ? 'ERP' :
                         i % 6 === 0 ? 'catelog' :
                         i % 5 === 0 ? 'Brouchure' :
                         i % 4 === 0 ? 'Logo' :
                         i % 3 === 0 ? 'Company profile' :
                         i % 2 === 0 ? 'Website Development' : 'website Design',
                // Assign option and statusColor according to the new statusOptions
                option: i % 4 === 0 ? 'Quotation Sent' :
                        i % 3 === 0 ? 'Payment Done' :
                        i % 2 === 0 ? 'Lead Lost' : 'Follow Up',
                statusColor: i % 4 === 0 ? '#FFF9C4' : // Quotation Sent
                            i % 3 === 0 ? '#BBDEFB' : // Payment Done
                            i % 2 === 0 ? '#C8E6C9' : // Lead Lost
                            '#FFCDD2'                  // Follow Up
            });
        }
        setCustomers(demoCustomers);
        setFilteredCustomers(demoCustomers);
        setLoading(false);
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/customers`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const customerList = Array.isArray(result.data) ? result.data : [];

            if (customerList.length === 0) {
                // If no data from API, use demo data for testing pagination
                console.warn("No customers found in API, using demo data");
                addDemoData();
                return;
            }

            setCustomers(customerList);
            setFilteredCustomers(customerList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            // Use demo data if API fails
            console.warn("API error, using demo data instead");
            addDemoData();
            setError(null); // Clear the error since we're using demo data
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete customer. Status: ${response.status}`);
            }

            toast.success('Customer deleted successfully!');
            // Refetch fresh data from server after delete
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('Failed to delete customer. Please try again.');
        }
    };

    const handleUpdate = (id) => {
        const customer = customers.find(c => c._id === id);
        if (!customer) return;

        setSelectedCustomer(customer);
        setIsUpdateModalOpen(true);
    };

    // Sort function
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        
        const sortedData = [...filteredCustomers].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        setFilteredCustomers(sortedData);
    };
    
    // Calculate pagination variables
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Get current items to display
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    
    // Pagination change handler
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Modal close handler
    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedCustomer(null);
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };
    
    // Get relative time for display
    const getRelativeTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return '';
    };

    // Get status label from value
    const getStatusLabel = (value) => {
        const option = statusOptions.find(opt => opt.value === value);
        return option ? option.label : 'N/A';
    };

    // Get service label from value
    const getServiceLabel = (value) => {
        const option = serviceOptions.find(opt => opt.value === value);
        return option ? option.label : 'N/A';
    };

    // Update form submit handler
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        
        // Find selected status option to get its color
        const selectedStatus = statusOptions.find(status => status.value === form.status.value);
        const statusColor = selectedStatus ? selectedStatus.color : null;
        
        const updatedCustomer = {
            name: form.name.value.trim(),
            phoneNumber: form.phoneNumber.value.trim(),
            reference: form.reference.value.trim(),
            createdAt: form.createdAt.value || selectedCustomer.createdAt || new Date().toISOString(),
            remark: form.remark.value.trim(),
            service: form.service.value,
            option: form.status.value,
            statusColor: statusColor
        };

        try {
            const response = await fetch(`http://localhost:5000/api/customers/${selectedCustomer._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCustomer),
            });

            if (response.ok) {
                toast.success('Customer updated successfully!');
                closeModal();
                fetchCustomers();
            } else {
                toast.error('Failed to update customer. Please try again.');
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error('Failed to update customer. Please try again.');
        }
    };

    if (error) return (
        <Container className="mt-5">
            <Alert variant="danger">
                <Alert.Heading>Error Loading Data</Alert.Heading>
                <p>{error}</p>
            </Alert>
        </Container>
    );
    
    if (loading) return (
        <Container className="d-flex justify-content-center mt-5">
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading customer data...</p>
            </div>
        </Container>
    );

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary bg-gradient text-white">
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="mb-0">Customer Data</h2>
                        </Col>
                        <Col xs="auto">
                            <Badge bg="light" text="dark" pill>
                                {filteredCustomers.length} Records
                            </Badge>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-4">
                        <Col md={6} lg={4}>
                            {/* Search box could go here */}
                        </Col>
                    </Row>

                    {filteredCustomers.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            <i className="bi bi-info-circle me-2"></i>
                            No customers found. Please adjust your search criteria.
                        </Alert>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <Table hover responsive className="align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="cursor-pointer">
                                                #
                                            </th>
                                            <th 
                                                onClick={() => requestSort('name')} 
                                                className="cursor-pointer"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Name
                                                {sortConfig.key === 'name' && (
                                                    <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                                                )}
                                            </th>
                                            <th 
                                                onClick={() => requestSort('phoneNumber')} 
                                                className="cursor-pointer"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Phone Number
                                                {sortConfig.key === 'phoneNumber' && (
                                                    <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                                                )}
                                            </th>
                                            <th 
                                                onClick={() => requestSort('reference')} 
                                                className="cursor-pointer"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Reference
                                                {sortConfig.key === 'reference' && (
                                                    <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                                                )}
                                            </th>
                                            <th>Service</th>
                                            <th>Status</th>
                                            <th>Remark</th>
                                            <th 
                                                onClick={() => requestSort('createdAt')} 
                                                className="cursor-pointer"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Date & Time
                                                {sortConfig.key === 'createdAt' && (
                                                    <i className={`ms-1 bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}`}></i>
                                                )}
                                            </th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{color:"#363636"}}>
                                        {currentItems.map((customer, idx) => (
                                            <tr 
                                                key={customer._id || idx} 
                                                style={{ backgroundColor: customer.statusColor || '' }}
                                            >
                                                <td className="text-muted small">
                                                    {indexOfFirstItem + idx + 1}
                                                </td>
                                                <td>
                                                    <div className="fw-semibold">{customer.name || 'N/A'}</div> 
                                                </td>
                                                <td>{customer.phoneNumber || 'N/A'}</td>
                                                <td>{customer.reference || 'N/A'}</td>
                                                <td>{getServiceLabel(customer.service) || 'N/A'}</td>
                                                <td>
                                                    {customer.option && (
                                                        <Badge 
                                                            bg="light" 
                                                            style={{ 
                                                                backgroundColor: customer.statusColor || '#f8f9fa',
                                                                color: '#333',
                                                                border: '1px solid #ddd'
                                                            }}
                                                        >
                                                            {getStatusLabel(customer.option)}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="text-wrap" style={{maxWidth: "200px", maxHeight: "60px", overflow: "hidden"}}>
                                                        {customer.remark || 'N/A'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        {formatDate(customer.createdAt)}
                                                        <small className="text-muted">{getRelativeTime(customer.createdAt)}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleUpdate(customer._id)}
                                                        >
                                                            Tagging
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(customer._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            
                            {/* Using the separate Pagination component */}
                            <Pagination 
                                currentPage={currentPage}
                                totalItems={filteredCustomers.length}
                                itemsPerPage={itemsPerPage}
                                paginate={paginate}
                            />
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Update Modal */}
            <Modal 
                show={isUpdateModalOpen} 
                onHide={closeModal} 
                centered
                backdrop="static"
                size="lg"
            >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>Update Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCustomer && (
                        <Form onSubmit={handleUpdateSubmit}>
                            {/* <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            defaultValue={selectedCustomer.name}
                                            required
                                            placeholder="Enter customer name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="phoneNumber"
                                            defaultValue={selectedCustomer.phoneNumber}
                                            required
                                            placeholder="Enter phone number"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row> */}
                            
                            {/* <Form.Group className="mb-3">
                                <Form.Label>Reference</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="reference"
                                    defaultValue={selectedCustomer.reference}
                                    placeholder="Enter reference information"
                                />
                            </Form.Group> */}
                            
                            {/* <Form.Group className="mb-3">
                                <Form.Label>Date & Time of Form Submission</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="createdAt"
                                    defaultValue={selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toISOString().slice(0, 16) : ''}
                                    placeholder="Select date and time"
                                />
                                <Form.Text className="text-muted">
                                    When was this form filled out?
                                </Form.Text>
                            </Form.Group> */}
                            
                                <Form.Group className="mb-3">
                                <Form.Label>Add Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="remark"
                                    defaultValue={selectedCustomer.remark}
                                    placeholder="Enter any additional notes"
                                />
                            </Form.Group>

                            {/* New Service Dropdown */}
                            <Form.Group className="mb-3">
                                <Form.Label>Service</Form.Label>
                                <Form.Select
                                    name="service"
                                    defaultValue={selectedCustomer.service || ''}
                                >
                                    <option value="">Select Service</option>
                                    {serviceOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            
                            {/* New Status Dropdown (this will change row color) */}
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    defaultValue={selectedCustomer.option || ''}
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map((option) => (
                                        <option 
                                            key={option.value} 
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Selecting a status will change the row color in the table.
                                </Form.Text>
                            </Form.Group>
                            
                        
                            
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default CustomerAllData;