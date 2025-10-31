import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import SplashScreen from './SplashScreen';
import { AuthProvider } from './AuthContext';
import { AppNavigator } from './AppNavigator';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Poppins-Regular': require('./assets/fonts/Poppins/Poppins-Regular.ttf'),
          'Poppins-SemiBold': require('./assets/fonts/Poppins/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins/Poppins-Bold.ttf'),
          'Poppins-ExtraBold': require('./assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
