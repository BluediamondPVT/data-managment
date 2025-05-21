import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';

const Tagging = () => {
  // Initialize customers from local storage or default data
  const initialCustomers = JSON.parse(localStorage.getItem('customers')) || [
    {
      _id: '1',
      name: 'Customer One',
      remark: '',
      service: '',
      status: '',
      lastUpdated: ''
    },
    {
      _id: '2',
      name: 'Customer Two',
      remark: '',
      service: '',
      status: '',
      lastUpdated: ''
    }
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    remark: '',
    service: '',
    status: ''
  });

  // Load customers from local storage on component mount
  useEffect(() => {
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    }
  }, []);

  // Open modal and populate form data
  const handleOpenModal = (id) => {
    const customer = customers.find(c => c._id === id);
    if (!customer) return;
    setSelectedCustomer(customer);
    setFormData({
      remark: customer.remark || '',
      service: customer.service || '',
      status: customer.status || ''
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save only remark and timestamp
  const handleSave = () => {
    if (!selectedCustomer) return;

    const updatedCustomers = customers.map((c) => {
      if (c._id === selectedCustomer._id) {
        return {
          ...c,
          remark: formData.remark,
          service: formData.service,
          status: formData.status,
          lastUpdated: new Date().toLocaleString()
        };
      }
      return c;
    });

    // Save to local storage
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
    handleCloseModal();
  };

  // Sample options for service and status
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

  const statusOptions = [
    { value: 'Quotation Sent', label: 'Quotation Sent', color: '#FFF9C4' },
    { value: 'Payment Done', label: 'payment done', color: '#BBDEFB' },
    { value: 'Lead Lost', label: 'lead lost', color: '#C8E6C9' },
    { value: 'Follow Up', label: 'follow up', color: '#FFCDD2' }
  ];

  return (
    <div className="container mt-4">
      <h2>Customer List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Remark</th>
            <th>Service</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.remark}</td>
              <td>{customer.service}</td>
              <td>{customer.status}</td>
              <td>{customer.lastUpdated}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleOpenModal(customer._id)}
                >
                  Tagging
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for editing */}
      <Modal show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Form>
              {/* Add Comment */}
              <Form.Group className="mb-3">
                <Form.Label>Add Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes"
                />
              </Form.Group>

              {/* Service Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Service</Form.Label>
                <Form.Select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="">Select Service</option>
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Status Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Selecting a status will change the row color in the table.
                </Form.Text>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tagging;
