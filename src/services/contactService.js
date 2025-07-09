const API_BASE_URL = 'https://api.cfztechnologies.store/api';

// Get all contacts with pagination
export const getContacts = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

// Submit new contact form (public endpoint)
export const submitContact = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit contact form');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

// Delete contact
export const deleteContact = async (contactId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete contact');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}; 