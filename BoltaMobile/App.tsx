import React from 'react';
import { StatusBar } from 'expo-status-bar';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <DashboardScreen />
    </>
  );
}