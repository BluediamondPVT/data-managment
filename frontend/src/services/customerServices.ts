import { Customer } from '../types/customer';

const API_BASE_URL = 'http://localhost:5000/api/customers';

// Fetch all customers
export const fetchAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Server error: ${response.status} ${response.statusText}`
      );
    }
    
    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Unable to connect to the customer service. Please ensure the backend server is running at ' +
        API_BASE_URL
      );
    }
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Search customers by phone
export const searchCustomersByPhone = async (phoneNumber: string): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/phone/${phoneNumber}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Search failed: ${response.status} ${response.statusText}`
      );
    }
    
    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Unable to connect to the search service. Please ensure the backend server is running.'
      );
    }
    console.error('Error searching customers:', error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Delete failed: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Unable to connect to the delete service. Please ensure the backend server is running.'
      );
    }
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `Update failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Unable to connect to the update service. Please ensure the backend server is running.'
      );
    }
    console.error('Error updating customer:', error);
    throw error;
  }
};