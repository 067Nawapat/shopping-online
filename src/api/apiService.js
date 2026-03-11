import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// เปลี่ยนเป็น IP เครื่องของคุณ หรือ URL Server จริง
const BASE_URL = 'http://172.20.10.4/shopping-api/api.php';

// Axios instance พร้อม timeout และ headers
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const apiService = {
  // ── Products ──────────────────────────────────────────────
  getProducts: async () => {
    const response = await api.get('?action=get_products');
    return response.data;
  },

  getPromoProducts: async () => {
    const response = await api.get('?action=get_products');
    return response.data.map((p, i) => ({ ...p, rank: i + 1 }));
  },

  // ── Auth ──────────────────────────────────────────────────
  register: async (userData) => {
    const response = await api.post('?action=register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('?action=login', { email, password });
    if (response.data.status === 'success') {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
  },

  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // ── Coupons & Addresses ───────────────────────────────────
  getCoupons: async () => {
    try {
      const response = await api.get('?action=get_coupons');
      return response.data;
    } catch {
      return [];
    }
  },

  getAddresses: async (userId) => {
    try {
      const response = await api.get(`?action=get_addresses&user_id=${userId}`);
      return response.data;
    } catch {
      return [];
    }
  },

  saveAddress: async (addressData) => {
    const response = await api.post('?action=save_address', addressData);
    return response.data;
  },
};
