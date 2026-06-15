import AsyncStorage from '@react-native-async-storage/async-storage';

// In development, localhost is common, but Android emulators use 10.0.2.2.
// We provide a fallback and allow overriding via async storage.
const DEFAULT_API_URL = 'http://localhost:5000/api';
const EMULATOR_API_URL = 'http://10.0.2.2:5000/api';

let API_URL = DEFAULT_API_URL;
let userToken = null;

export const setToken = (token) => {
  userToken = token;
};

// Auto-detect environments where possible or fetch stored config
const getBaseUrl = async () => {
  try {
    const customUrl = await AsyncStorage.getItem('custom_api_url');
    if (customUrl) return customUrl;
  } catch (e) {
    // Ignore
  }
  // Try to use emulator address if on Android
  return API_URL;
};

// Set emulator URL for Android environments
export const setAndroidEmulatorEnv = () => {
  API_URL = EMULATOR_API_URL;
};

const request = async (endpoint, options = {}) => {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  setToken,
  
  // Auth API
  auth: {
    login: (email, password) => 
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
      
    register: (username, email, password) => 
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
      
    getProfile: () => 
      request('/auth/profile', {
        method: 'GET',
      }),
  },

  // Tasks API
  tasks: {
    list: (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = `/tasks${queryParams ? `?${queryParams}` : ''}`;
      return request(endpoint, { method: 'GET' });
    },
    
    create: (taskData) => 
      request('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
      
    update: (id, taskData) => 
      request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      }),
      
    delete: (id) => 
      request(`/tasks/${id}`, {
        method: 'DELETE',
      }),
  },

  // Sessions API
  sessions: {
    list: () => 
      request('/sessions', { method: 'GET' }),
      
    create: (sessionData) => 
      request('/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      }),
      
    stats: () => 
      request('/sessions/stats', { method: 'GET' }),
  },

  // Achievements API
  achievements: {
    list: () => 
      request('/achievements', { method: 'GET' }),
  }
};
