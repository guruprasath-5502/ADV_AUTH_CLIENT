import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        email,
        password,
        name,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error signing up',
        isLoading: false,
      });

      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error logging in',
        isLoading: false,
      });

      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Error logging out',
        isLoading: false,
      });

      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          email,
        }
      );

      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        error: 'Error sending reset password link',
        isLoading: false,
      });

      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        error: 'Password reset failed',
        isLoading: false,
      });

      throw error;
    }
  },

  verifyEmail: async (code, email) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify-email`,
        {
          code,
          email,
        }
      );

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error verifying account',
        isLoading: false,
      });

      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/check-auth`);

      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });

      console.log(error);
    }
  },
}));
