import { config } from '../config/config';
import { getAuthHeader } from './auth';

const API_URL = config.API_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Helper function to handle API errors
const handleError = (error) => {
  console.error('API Error:', error);
  throw new Error(error.message || 'An error occurred');
};

// Services API
export const servicesApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/services`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/services/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (serviceData) => {
    try {
      const response = await fetch(`${API_URL}/admin/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, serviceData) => {
    try {
      const response = await fetch(`${API_URL}/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/services/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  reorder: async (services) => {
    try {
      const response = await fetch(`${API_URL}/admin/services/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ services })
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

// Blogs API
export const blogsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/blogs`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (blogData) => {
    try {
      const response = await fetch(`${API_URL}/admin/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, blogData) => {
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const heroApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/hero`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/hero/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(`${API_URL}/admin/hero`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/admin/hero/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/hero/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  reorder: async (data) => {
    try {
      const response = await fetch(`${API_URL}/admin/hero/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const productApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/products`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/products/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  reorder: async (data) => {
    try {
      const response = await fetch(`${API_URL}/admin/products/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  addPreviewItem: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/admin/products/${id}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  addShowcaseItem: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/admin/products/${id}/showcase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export default {
  services: servicesApi,
  blogs: blogsApi,
  hero: heroApi,
  products: productApi
}; 