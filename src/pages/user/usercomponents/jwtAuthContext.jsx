import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'
import {BACKEND_SERVER} from '../../../secrets/secret'


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};


const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  console.log("backend : ",BACKEND_SERVER);
  
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

 
    useEffect(() => {
      const fetchTokens = async () => {
        const accessToken = getCookie('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
  
        if (accessToken) {
          setToken(accessToken);
        } else if (refreshToken) {
          try {
            const response = await axios.post(`${BACKEND_SERVER}/verifytoken`, { refreshToken });
            console.log("response 1:", response);
            
            if (response.data.success) {
              const token = response.data.data;
              setToken(token);
            }
          } catch (error) {
            console.error('Error verifying token:', error);
          }
        }
  
        setLoading(false);
      };
  
      fetchTokens();
    }, []);
  

  const logout = () => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
