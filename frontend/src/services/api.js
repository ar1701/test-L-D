import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api.js";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Generic methods
  get: (endpoint, config = {}) => apiClient.get(endpoint, config),
  post: (endpoint, data, config = {}) => apiClient.post(endpoint, data, config),
  put: (endpoint, data, config = {}) => apiClient.put(endpoint, data, config),
  delete: (endpoint, config = {}) => apiClient.delete(endpoint, config),

  // Auth methods
  auth: {
    login: (credentials) =>
      apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
    logout: () => apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
    register: (userData) =>
      apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
  },

  // User methods
  user: {
    getProfile: () => apiClient.get(API_CONFIG.ENDPOINTS.USER.PROFILE),
    getDashboard: () => apiClient.get(API_CONFIG.ENDPOINTS.USER.DASHBOARD),
  },

  // Admin methods
  admin: {
    getDashboard: () => apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD),
    getUsers: () => apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.USERS),
    getSettings: () => apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.SETTINGS),

    // Interns
    getInterns: () => apiClient.get("/admin/interns"),
    createIntern: (internData) => apiClient.post("/admin/interns", internData),

    // Customers (Free trial requests)
    getCustomers: () => apiClient.get("/admin/customers"),
    assignIntern: (requestId, internId) =>
      apiClient.post(`/admin/requests/${requestId}/assign`, {
        intern_id: internId,
      }),
    updateRequestStatus: (requestId, status) =>
      apiClient.put(`/admin/requests/${requestId}/status`, { status }),
  },
};

export default apiService;
