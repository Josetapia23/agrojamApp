import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import CustomAlert from './CustomAlert';

const HomeScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [alertVisible, setAlertVisible] = useState(false);

  const showLogoutConfirmation = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const confirmLogout = () => {
    closeAlert();
    logout(); // Cierra sesión al confirmar
  };

  return (
    <View style={styles.container}>
      {/* Fondo animado */}
      <View style={styles.background}>
        <View style={styles.ellipse1} />
        <View style={styles.ellipse2} />
        <View style={styles.rectangle3} />
        <View style={styles.rectangle4} />
      </View>

      {/* Contenido principal */}
      <Text style={styles.title}>Bienvenido a Agrojam</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={styles.buttonText}>Escanear QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={showLogoutConfirmation}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertVisible}
        title="Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        buttons={[
          { text: 'Cancelar', style: 'cancel', onPress: closeAlert },
          { text: 'Confirmar', style: 'confirm', onPress: confirmLogout },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#1F8901',
    marginBottom: 40,
    textAlign: 'center',
    zIndex: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  button: {
    width: '80%',
    height: 60,
    backgroundColor: '#1FBB4B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#D9534F',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export default HomeScreen;
