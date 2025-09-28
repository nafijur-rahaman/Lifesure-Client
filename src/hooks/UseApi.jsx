import { useState } from "react";
import axios from "axios";
import { useToken } from "./useToken";

const BASE_URL = "http://localhost:3000";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken, getRefreshToken, setToken, removeToken } = useToken();

  const request = async (endpoint, method, body = null) => {
    setLoading(true);
    setError(null);

    let token = getToken();

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios({ method, url: `${BASE_URL}${endpoint}`, data: body, headers });
      setLoading(false);
      return response.data;
    } catch (err) {
      // If 401 → try refresh
      if (err.response?.status === 401) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            const refreshRes = await axios.post(`${BASE_URL}/api/refresh`, { refreshToken });
            const newToken = refreshRes.data.accessToken;
            setToken(newToken);

            // Retry original request
            const retryHeaders = { Authorization: `Bearer ${newToken}` };
            const retryRes = await axios({ method, url: `${BASE_URL}${endpoint}`, data: body, headers: retryHeaders });
            setLoading(false);
            return retryRes.data;
          } catch (refreshErr) {
            removeToken();
            window.location.href = "/login"; // redirect to login
          }
        } else {
          removeToken();
          window.location.href = "/login"; // redirect to login
        }
      }
      setLoading(false);
      setError(err);
      console.error(err);
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
