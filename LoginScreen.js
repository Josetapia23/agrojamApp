import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import CustomAlert from './CustomAlert'; // Importa el componente actualizado de alerta personalizada

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      // Mostrar alerta si faltan campos
      showCustomAlert('Error', 'Por favor, ingrese usuario y contraseña');
      return;
    }

    setIsLoading(true);

    try {
      //const response = await axios.post('https://www.agrojamsena.com/backagrojam/login.php', {
      const response = await axios.post('http://10.9.222.141/backagrojam/login.php', {
        username,
        password,
      });

      setIsLoading(false);

      if (response.data.success) {
        login({ username });
      } else {
        showCustomAlert('Error', response.data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error en login:', error);
      showCustomAlert('Error', 'Hubo un problema al iniciar sesión. Por favor, intente de nuevo.');
    }
  };

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Fondo estilizado */}
      <View style={styles.background}>
        <View style={styles.ellipse1} />
        <View style={styles.ellipse2} />
        <View style={styles.rectangle3} />
        <View style={styles.rectangle4} />
      </View>

      {/* Contenido con scroll */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Formulario */}
        <Text style={styles.title}>
          Bienvenido a <Text style={styles.titleHighlight}>Agrojam</Text>
        </Text>
        <Text style={styles.subtitle}>Inicia Sesión</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#626262"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#626262"
            editable={!isLoading}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        buttons={[
          {
            text: 'Cerrar',
            style: 'close',
            onPress: closeCustomAlert,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  ellipse1: {
    position: 'absolute',
    width: 635,
    height: 635,
    left: -200,
    top: -400,
    backgroundColor: 'rgba(31, 137, 1, 0.1)',
    borderRadius: 317.5,
  },
  ellipse2: {
    position: 'absolute',
    width: 496,
    height: 496,
    right: -200,
    bottom: -200,
    borderWidth: 3,
    borderColor: 'rgba(31, 137, 1, 0.05)',
    borderRadius: 248,
  },
  rectangle3: {
    position: 'absolute',
    width: 372,
    height: 372,
    left: -200,
    bottom: -100,
    borderWidth: 2,
    borderColor: 'rgba(105, 165, 58, 0.3)',
    transform: [{ rotate: '27.09deg' }],
  },
  rectangle4: {
    position: 'absolute',
    width: 372,
    height: 372,
    right: -200,
    top: -100,
    borderWidth: 2,
    borderColor: 'rgba(105, 165, 58, 0.3)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    lineHeight: 48,
    textAlign: 'center',
    color: '#1F8901',
    marginBottom: 10,
  },
  titleHighlight: {
    fontFamily: 'Poppins-ExtraBold',
    color: '#1F8901',
  },
  subtitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 64,
    backgroundColor: '#F1F4FF',
    borderWidth: 2,
    borderColor: '#1FBB4B',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#1FBB4B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#CBD6FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export default LoginScreen;
