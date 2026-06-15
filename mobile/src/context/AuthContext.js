import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken, setAndroidEmulatorEnv } from '../services/api';
import { Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Detect android emulator environments
    if (Platform.OS === 'android') {
      setAndroidEmulatorEnv();
    }
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
        
        // Refresh profile in background to get latest XP and achievements
        api.auth.getProfile()
          .then((res) => {
            if (res.success) {
              setUser(res.data);
              AsyncStorage.setItem('userData', JSON.stringify(res.data));
            }
          })
          .catch((err) => {
            console.log('Session validation failed, logging out...');
            logout();
          });
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
        
        // Save to state
        setToken(userTokenData);
        setTokenState(userTokenData);
        setUser(userData);

        // Save to local storage
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

        // Save to state
        setToken(userTokenData);
        setTokenState(userTokenData);
        setUser(userData);

        // Save to storage
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
    setLoading(true);
    try {
      setToken(null);
      setTokenState(null);
      setUser(null);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (e) {
      console.error('Failed to logout:', e);
    } finally {
      setLoading(false);
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
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        refreshProfile,
        updateUserProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
