import { useState } from "react";

const TOKEN_KEY = "jwt_token";

export const useToken = () => {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY));

  // Save token
  const setToken = (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setTokenState(newToken);
  };

  // Remove token
  const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
  };

  // Get token (from state)
  const getToken = () => token;

  return { token, setToken, getToken, removeToken };
};
