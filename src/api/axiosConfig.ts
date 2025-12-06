// =============================================================================
// FILE: src/api/axiosInstance.ts
// =============================================================================
// Axios Instance with Interceptors
// =============================================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds for analysis requests
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Dispatch custom event for auth state management
      window.dispatchEvent(new CustomEvent("auth:logout"));
      
      // Redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      
      return Promise.reject(error);
    }

    // Handle 403 Forbidden (admin access required)
    if (error.response?.status === 403) {
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "error",
            title: "Access Denied",
            message: "You don't have permission to perform this action.",
          },
        })
      );
    }

    // Handle 429 Rate Limited
    if (error.response?.status === 429) {
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "warning",
            title: "Rate Limited",
            message: "Too many requests. Please wait a moment and try again.",
          },
        })
      );
    }

    // Handle 500+ Server Errors
    if (error.response?.status && error.response.status >= 500) {
      window.dispatchEvent(
        new CustomEvent("notification:show", {
          detail: {
            type: "error",
            title: "Server Error",
            message: "Something went wrong. Please try again later.",
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Export types for error handling
export interface ApiError {
  message: string;
  detail?: string | Record<string, unknown>;
  status: number;
}

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    return (
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unexpected error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};