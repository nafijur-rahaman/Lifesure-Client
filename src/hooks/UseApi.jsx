import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useToken } from "./useToken";
import { useNavigate } from "react-router";

const BASE_URL = "http://localhost:3000";
// const BASE_URL = "https://lifesure-server.vercel.app";

export const useApi = () => {
  const { token, setToken, getRefreshToken, removeToken } = useToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const refreshTimer = useRef(null);

  // Function to refresh token
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      removeToken();
      navigate("/login", { replace: true });
      return null;
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/api/refresh`, { refreshToken });
      setToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      removeToken();
      navigate("/login", { replace: true });
      return null;
    }
  };

  // Set up automatic token refresh timer
  useEffect(() => {
    if (!token) return;

    // Decode token expiration time
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiresInMs = payload.exp * 1000 - Date.now() - 60_000; // refresh 1 min before expiry

    if (expiresInMs > 0) {
      refreshTimer.current = setTimeout(async () => {
        await refreshAccessToken();
      }, expiresInMs);
    }

    return () => clearTimeout(refreshTimer.current);
  }, [token]);

  // Axios instance
  const api = axios.create({ baseURL: BASE_URL });

  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const status = err.response?.status;
      const originalRequest = err.config;

      // 401 → try refresh once
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }

      // 403 → silent redirect
      if (status === 403) {
        navigate("/unauthorized", { replace: true });
      }

      return Promise.reject(err);
    }
  );

  const request = async (endpoint, method, body = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api({ method, url: endpoint, data: body });
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    error,
    get: (endpoint) => request(endpoint, "GET"),
    post: (endpoint, body) => request(endpoint, "POST", body),
    put: (endpoint, body) => request(endpoint, "PUT", body),
    patch: (endpoint, body) => request(endpoint, "PATCH", body),
    del: (endpoint) => request(endpoint, "DELETE"),
  };
};
