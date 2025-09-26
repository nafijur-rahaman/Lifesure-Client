import { useState } from "react";
import axios from "axios";
import { useToken } from "./useToken";

const BASE_URL = "http://localhost:3000";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useToken();

  const request = async (endpoint, method, body = null) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data: body,
        headers,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
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
    patch: (endpoint, body) => request(endpoint, "PATCH", body), // ✅ Added PATCH
    del: (endpoint) => request(endpoint, "DELETE"),
  };
};
