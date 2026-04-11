import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import DesktopWrapper from './src/components/DesktopWrapper';
import { useStore } from './src/store/useStore';

function AppContent() {
  const { settings } = useStore();
  return (
    <DesktopWrapper>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </DesktopWrapper>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContent />
    </GestureHandlerRootView>
  );
}
