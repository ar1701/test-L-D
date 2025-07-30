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
      // Don't redirect automatically - let the component handle the error
      // This prevents unwanted redirects when login fails
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
    updateInternCredentials: (internId, credentials) =>
      apiClient.put(`/admin/interns/${internId}/credentials`, credentials),
    deleteIntern: (internId) => apiClient.delete(`/admin/interns/${internId}`),
    updateIntern: (internId, internData) =>
      apiClient.put(`/admin/interns/${internId}`, internData),

    // Customers (Free trial requests)
    getCustomers: () => apiClient.get("/admin/customers"),
    getCompanies: () => apiClient.get("/admin/companies"),
    getAllCompanies: () => apiClient.get("/admin/all-companies"),
    updateDashboardCounts: (requestId, data) =>
      apiClient.put(`/admin/customers/${requestId}/dashboards`, data),
    deleteCustomer: (customerId) =>
      apiClient.delete(`/admin/customers/${customerId}`),
    updateCustomer: (customerId, customerData) =>
      apiClient.put(`/admin/customers/${customerId}`, customerData),
    assignIntern: (requestId, internId) =>
      apiClient.post(`/admin/requests/${requestId}/assign`, {
        intern_id: internId,
      }),
    updateRequestStatus: (requestId, status) =>
      apiClient.put(`/admin/requests/${requestId}/status`, { status }),
    updateProjectDetails: (requestId, projectData) =>
      apiClient.put(`/admin/requests/${requestId}/project`, projectData),

    // Demo Accounts
    getDemoAccounts: () => apiClient.get("/admin/demos"),
    deleteDemoAccount: (demoId) => apiClient.delete(`/admin/demos/${demoId}`),
    updateDemoAccount: (demoId, demoData) =>
      apiClient.put(`/admin/demos/${demoId}`, demoData),
    regenerateDemoCredentials: (demoId) =>
      apiClient.post(`/admin/demos/${demoId}/regenerate-credentials`),
    assignInternToDemo: (demoId, internId) =>
      apiClient.post(`/admin/demos/${demoId}/assign-intern`, {
        intern_id: internId,
      }),
    updateDemoAdminNote: (demoId, adminNote) =>
      apiClient.put(`/admin/demos/${demoId}/admin-note`, {
        admin_note: adminNote,
      }),
    updateDemoInternNote: (demoId, internNote) =>
      apiClient.put(`/admin/demos/${demoId}/intern-note`, {
        intern_note: internNote,
      }),
  },

  // Notifications
  notifications: {
    getNotifications: (
      recipientType,
      recipientId = null,
      limit = 50,
      unreadOnly = false
    ) => {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (recipientId) params.append("recipient_id", recipientId.toString());
      if (unreadOnly) params.append("unread_only", "true");
      return apiClient.get(`/notifications/${recipientType}?${params}`);
    },
    getUnreadCount: (recipientType, recipientId = null) => {
      const params = new URLSearchParams();
      if (recipientId) params.append("recipient_id", recipientId.toString());
      return apiClient.get(
        `/notifications/${recipientType}/unread-count?${params}`
      );
    },
    markAsRead: (notificationId) =>
      apiClient.put(`/notifications/${notificationId}/read`),
    markAllAsRead: (recipientType, recipientId = null) => {
      const params = new URLSearchParams();
      if (recipientId) params.append("recipient_id", recipientId.toString());
      return apiClient.put(
        `/notifications/${recipientType}/mark-all-read?${params}`
      );
    },
    deleteNotification: (notificationId) =>
      apiClient.delete(`/notifications/${notificationId}`),
  },

  // Intern methods
  intern: {
    getRequests: (internId) =>
      apiClient.get(`/intern/requests?intern_id=${internId}`),
    updateNote: (requestId, note) =>
      apiClient.put(`/intern/requests/${requestId}/note`, {
        intern_note: note,
      }),
    getDemoAccounts: (internId) =>
      apiClient.get(`/intern/demos?intern_id=${internId}`),
    updateDemoNote: (demoId, note, internId) =>
      apiClient.put(`/intern/demos/${demoId}/note`, {
        intern_note: note,
        intern_id: internId,
      }),
  },
};

export default apiService;
