import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { AuthService } from "./auth.service";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 5000,
});

// Step 1:Attach access token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest._retry && error.response?.status === 401) {
      if (originalRequest.url?.includes("auth/refresh")) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResponse = await AuthService.refreshToken();
        const newAccessToken = refreshResponse.accessToken;
        useAuthStore
          .getState()
          .setAuth(newAccessToken, useAuthStore.getState().user!);
        onRefreshed(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
