import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Auth Endpoints
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getPlan = async (bodyType) => {
  try {
    const response = await api.get(`/plans/${bodyType}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching plan:", error);
    throw error;
  }
};
export const getProgress = async (userId, date) => {
  try {
    const response = await api.get(`/progress/${userId}/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw error;
  }
};

export const toggleProgress = async (userId, date, itemId, type) => {
  try {
    const response = await api.post('/progress/toggle', { userId, date, itemId, type });
    return response.data;
  } catch (error) {
    console.error("Error toggling progress:", error);
    throw error;
  }
};

export const getProgressHistory = async (userId, days = 30) => {
  try {
    const response = await api.get(`/progress/history/${userId}?days=${days}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching progress history:", error);
    throw error;
  }
};
export const getCatalog = async () => {
  try {
    const response = await api.get('/cart/catalog');
    return response.data;
  } catch (error) {
    console.error("Error fetching catalog:", error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (product) => {
  try {
    const response = await api.post('/cart/add', product);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateQuantity = async (name, quantity) => {
  try {
    const response = await api.patch('/cart/quantity', { name, quantity });
    return response.data;
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw error;
  }
};

export const removeFromCart = async (name) => {
  try {
    const response = await api.delete(`/cart/remove/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
