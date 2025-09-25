import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (endpoint, method, body = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data: body,
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
    del: (endpoint) => request(endpoint, "DELETE"),
  };
};
