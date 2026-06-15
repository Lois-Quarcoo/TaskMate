import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setTokenState(storedToken);
        setUser(parsedUser);
      }
    } catch (e) {
      console.error('Failed to load storage data:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.auth.login(email, password);
      if (response.success) {
        const { token: userTokenData, ...userData } = response.data;
        setToken(userTokenData);
        setTokenState(userTokenData);
        setUser(userData);
        await AsyncStorage.setItem('userToken', userTokenData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.auth.register(username, email, password);
      if (response.success) {
        const { token: userTokenData, ...userData } = response.data;
        setToken(userTokenData);
        setTokenState(userTokenData);
        setUser(userData);
        await AsyncStorage.setItem('userToken', userTokenData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setTokenState(null);
      setUser(null);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  };

  const updateUserProfileState = (updatedUser) => {
    setUser(updatedUser);
    AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const refreshProfile = async () => {
    try {
      const res = await api.auth.getProfile();
      if (res.success) {
        updateUserProfileState(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, register, logout,
      refreshProfile, updateUserProfileState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};