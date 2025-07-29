// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  ENDPOINTS: {
    USER_PORTAL: "/user-portal",
    ADMIN_PORTAL: "/admin-portal",
    AUTH: {
      LOGIN: "/auth/login",
      LOGOUT: "/auth/logout",
      REGISTER: "/auth/register",
    },
    USER: {
      PROFILE: "/user/profile",
      DASHBOARD: "/user/dashboard",
    },
    ADMIN: {
      DASHBOARD: "/admin/dashboard",
      USERS: "/admin/users",
      SETTINGS: "/admin/settings",
    },
  },
};

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Environment info
export const ENV = import.meta.env.VITE_APP_ENV || "development";
export const IS_PRODUCTION = ENV === "production";
export const IS_DEVELOPMENT = ENV === "development";
