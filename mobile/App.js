import React from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }} initialMetrics={initialWindowMetrics}>
      <AuthProvider>
        <TaskProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
