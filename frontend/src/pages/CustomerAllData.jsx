import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Card, Button, Form, Modal, Container, Row, Col, Spinner, Alert, Badge, InputGroup } from 'react-bootstrap';
import { Search } from 'lucide-react';

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
    const [searchPhone, setSearchPhone] = useState('');
    const [searching, setSearching] = useState(false);

    // Fetch customers from API
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/customers`);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const result = await response.json();
            const customerList = Array.isArray(result.data) ? result.data : [];
            
            setCustomers(customerList);
            setFilteredCustomers(customerList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Phone number search handler
    const handlePhoneSearch = async () => {
        if (!searchPhone.trim()) {
            setFilteredCustomers(customers);
            return;
        }

        try {
            setSearching(true);
            const response = await fetch(`http://localhost:5000/api/customers/search/phone/${searchPhone}`);

            if (!response.ok) throw new Error(`Search failed! Status: ${response.status}`);
            
            const result = await response.json();
            const searchResults = Array.isArray(result.data) ? result.data : [];
            
            setFilteredCustomers(searchResults);
            setCurrentPage(1); // Reset to first page after search
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed. Please try again.');
        } finally {
            setSearching(false);
        }
    };

    // Reset search
    const handleResetSearch = () => {
        setSearchPhone('');
        setFilteredCustomers(customers);
        setCurrentPage(1);
    };

    const serviceOptions = [
        { value: 'website Design', label: 'Website Design' },
        { value: 'Website Development', label: 'Website Development' },
        { value: 'Company profile', label: 'Company Profile' },
        { value: 'Logo', label: 'Logo' },
        { value: 'Brouchure', label: 'Brochure' },
        { value: 'catelog', label: 'Catalog' },
        { value: 'ERP', label: 'ERP' },
        { value: 'CRM', label: 'CRM' },
        { value: 'Complete Branding', label: 'Complete Branding' },
        { value: 'SMM', label: 'SMM' },
        { value: 'SEO', label: 'SEO' },
        { value: 'PPT', label: 'PPT' },
        { value: 'G-suite', label: 'G-Suite' }
    ];

    const statusOptions = [
        { value: 'Quotation Sent', label: 'Quotation Sent', color: '#FFF9C4' },
        { value: 'Payment Done', label: 'Payment Done', color: '#BBDEFB' },
        { value: 'Lead Lost', label: 'Lead Lost', color: '#C8E6C9' },
        { value: 'Follow Up', label: 'Follow Up', color: '#FFCDD2' }
    ];

    // Delete customer handler
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error(`Failed to delete. Status: ${response.status}`);

            toast.success('Customer deleted!');
            setFilteredCustomers(prev => prev.filter(c => c._id !== id));
            setCustomers(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete customer');
        }
    };

    // Update customer handlers
    const handleUpdateClick = (customer) => {
        setSelectedCustomer(customer);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            source: e.target.source.value,
            service: e.target.service.value,
            remark: e.target.remark.value
        };

        try {
            const response = await fetch(`http://localhost:5000/api/customers/${selectedCustomer._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update');
            }

            // Update both customers and filtered customers
            const updateCustomer = (prev) => prev.map(c => 
                c._id === selectedCustomer._id ? { ...c, ...formData } : c
            );

            setCustomers(updateCustomer);
            setFilteredCustomers(updateCustomer);

            toast.success("Updated successfully!");
            setIsUpdateModalOpen(false);

        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message);
        }
    };

    // Sorting functionality
    const requestSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' 
            ? 'desc' 
            : 'asc';
        
        const sortedData = [...filteredCustomers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setSortConfig({ key, direction });
        setFilteredCustomers(sortedData);
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        const validatedPage = Math.max(1, Math.min(pageNumber, totalPages));
        setCurrentPage(validatedPage);
        window.scrollTo(0, 0);
    };

    // Table headers configuration
    const tableHeaders = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'phoneNumber', label: 'Phone', sortable: true },
        { key: 'source', label: 'Source', sortable: true },
        { key: 'service', label: 'Service', sortable: true },
        { key: 'createdAt', label: 'Date', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false }
    ];

    // Date formatting helpers
    const formatDate = (dateString) => 
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

    const getRelativeTime = (dateString) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <Container fluid className="py-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <Row className="align-items-center">
                        <Col>
                            <h3 className="mb-0">Customer Management</h3>
                        </Col>
                        <Col xs="auto">
                            <Badge bg="light" text="dark" pill>
                                {filteredCustomers.length} records
                            </Badge>
                        </Col>
                    </Row>
                </Card.Header>

                <Card.Body>
                    {/* Search Bar */}
                    <Row className="mb-4">
                        <Col md={6}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by phone number..."
                                    value={searchPhone}
                                    onChange={(e) => setSearchPhone(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handlePhoneSearch()}
                                />
                                <Button 
                                    variant="outline-primary" 
                                    onClick={handlePhoneSearch}
                                    disabled={searching}
                                >
                                    {searching ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <Search size={20} />
                                    )}
                                </Button>
                                {searchPhone && (
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleResetSearch}
                                    >
                                        Reset
                                    </Button>
                                )}
                            </InputGroup>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Loading customer data...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            Error loading data: {error}
                        </Alert>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            {tableHeaders.map(({ key, label, sortable }) => (
                                                <th
                                                    key={key}
                                                    onClick={() => sortable && requestSort(key)}
                                                    style={{ cursor: sortable ? 'pointer' : 'default' }}
                                                >
                                                    {label}
                                                    {sortable && sortConfig.key === key && (
                                                        <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-2`} />
                                                    )}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.length > 0 ? (
                                            currentItems.map((customer, index) => (
                                                <tr key={customer._id}>
                                                    <td>{indexOfFirstItem + index + 1}</td>
                                                    <td>{customer.name}</td>
                                                    <td>{customer.phoneNumber}</td>
                                                    <td>{customer.source || 'N/A'}</td>
                                                    <td>{customer.service || 'N/A'}</td>
                                                    <td>
                                                        <div>{formatDate(customer.createdAt)}</div>
                                                        <small className="text-muted">
                                                            {getRelativeTime(customer.createdAt)}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleUpdateClick(customer)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleDelete(customer._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="text-center py-4">
                                                    No records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {filteredCustomers.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <div>
                                        Showing {indexOfFirstItem + 1} to{' '}
                                        {Math.min(indexOfLastItem, filteredCustomers.length)} of{' '}
                                        {filteredCustomers.length} entries
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            variant="outline-primary"
                                            disabled={currentPage === 1}
                                            onClick={() => paginate(currentPage - 1)}
                                        >
                                            Previous
                                        </Button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(page => 
                                                page === 1 || 
                                                page === totalPages || 
                                                Math.abs(currentPage - page) <= 1
                                            )
                                            .map((page, index, array) => (
                                                <React.Fragment key={page}>
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <span className="mx-1">...</span>
                                                    )}
                                                    <Button
                                                        variant={currentPage === page ? "primary" : "outline-primary"}
                                                        onClick={() => paginate(page)}
                                                    >
                                                        {page}
                                                    </Button>
                                                </React.Fragment>
                                            ))}
                                        <Button
                                            variant="outline-primary"
                                            disabled={currentPage === totalPages}
                                            onClick={() => paginate(currentPage + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Update Modal */}
            <Modal show={isUpdateModalOpen} onHide={() => setIsUpdateModalOpen(false)} size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>
                        <i className="bi bi-clock-history me-2"></i>
                        Edit Customer (Revision History)
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCustomer && (
                        <div className="d-flex flex-column" style={{ minHeight: '60vh' }}>
                            {/* Edit Form */}
                            <Form onSubmit={handleUpdateSubmit} className="mb-4">
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Service Type</Form.Label>
                                            <Form.Select
                                                name="service"
                                                defaultValue={selectedCustomer.service}
                                                className="form-select-lg"
                                            >
                                                <option value="">Select a Service</option>
                                                {serviceOptions.map(option => (
                                                    <option 
                                                        key={option.value} 
                                                        value={option.value}
                                                        className="text-capitalize"
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12} className="mb-3">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Current Status</Form.Label>
                                            <Form.Select
                                                name="source"
                                                defaultValue={selectedCustomer.source}
                                                className="form-select-lg"
                                                style={{ 
                                                    backgroundColor: statusOptions.find(
                                                        opt => opt.value === selectedCustomer.source
                                                    )?.color || '#fff',
                                                    borderLeft: '4px solid #666'
                                                }}
                                            >
                                                {statusOptions.map(option => (
                                                    <option 
                                                        key={option.value} 
                                                        value={option.value}
                                                        style={{ backgroundColor: option.color }}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12} className="mb-4">
                                        <Form.Group>
                                            <Form.Label className="fw-bold">Progress Notes</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="remark"
                                                defaultValue={selectedCustomer.remark || ''}
                                                placeholder="Add progress updates or client comments..."
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* History Section */}
                                <div className="border-top pt-3">
                                    <h5 className="mb-3">
                                        <i className="bi bi-archive me-2"></i>
                                        Revision History
                                    </h5>
                                    
                                    <div className="timeline-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {selectedCustomer.history?.reverse().map((entry, index) => (
                                            <div 
                                                key={index} 
                                                className="timeline-item mb-3 p-3 rounded"
                                                style={{ 
                                                    backgroundColor: '#f8f9fa',
                                                    borderLeft: `4px solid ${statusOptions.find(o => o.value === entry.changes.source?.new)?.color || '#6c757d'}`
                                                }}
                                            >
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <small className="text-muted">
                                                        <i className="bi bi-calendar me-2"></i>
                                                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </small>
                                                    <Badge bg="secondary" pill>
                                                        v{selectedCustomer.history.length - index}
                                                    </Badge>
                                                </div>

                                                {Object.entries(entry.changes).map(([field, changes]) => (
                                                    <div key={field} className="mb-1">
                                                        <strong className="text-capitalize">{field}:</strong>
                                                        <span className="text-danger ms-2">
                                                            {changes.old || <em>Empty</em>}
                                                        </span>
                                                        <i className="bi bi-arrow-right mx-2 text-muted"></i>
                                                        <span className="text-success">
                                                            {changes.new || <em>Empty</em>}
                                                        </span>
                                                    </div>
                                                ))}

                                                {entry.changes.remark && (
                                                    <div className="mt-2 p-2 bg-white rounded">
                                                        <small className="text-muted">Note:</small>
                                                        <p className="mb-0">{entry.changes.remark.new}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => setIsUpdateModalOpen(false)}
                                        className="px-4"
                                    >
                                        <i className="bi bi-x-lg me-2"></i>
                                        Close
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        className="px-4"
                                    >
                                        <i className="bi bi-save me-2"></i>
                                        Commit Changes
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </Container>
    );
};

export default CustomerAllData;