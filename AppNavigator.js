import React, { useState, useEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './AuthContext';
import LoginScreen from './LoginScreen';
import QRScannerScreen from './QRScannerScreen';
import HomeScreen from './home'; // Nueva pantalla Home
import SplashScreen from './SplashScreen'; // Importa tu SplashScreen

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user } = useContext(AuthContext); // Estado de autenticación
  const [isSplashVisible, setIsSplashVisible] = useState(true); // Control del SplashScreen

  // Simula el tiempo que dura el SplashScreen (por ejemplo, 3 segundos)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000); // Ajusta el tiempo a lo que necesites
    return () => clearTimeout(timeout);
  }, []);

  if (isSplashVisible) {
    // Muestra el SplashScreen mientras esté activo
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {user ? (
        // Pantallas protegidas
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
          />
          <Stack.Screen 
            name="QRScanner" 
            component={QRScannerScreen} 
            options={{ 
              headerShown: true,
              title: 'Escanear QR'
            }} 
          />
        </>
      ) : (
        // Pantallas de autenticación
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
      )}
    </Stack.Navigator>
  );
};
