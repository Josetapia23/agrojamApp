import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import qs from 'qs'; // Importa qs para serializar los datos
import CustomAlert from './CustomAlert'; // Importa el componente de alerta personalizada

const QRScannerScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Necesitamos su permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);

    try {
      const response = await axios.post(
        'https://www.agrojamsena.com/backagrojam/registerAttendance.php',
        qs.stringify({ qrData: data }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('Respuesta del servidor', response.data);

      if (response.data.success) {
        if (response.data.already_registered) {
          showCustomAlert('Información', 'La asistencia ya fue registrada anteriormente.', [
            {
              text: 'OK',
              style: 'close',
              onPress: closeCustomAlert,
            },
          ]);
        } else {
          showCustomAlert(
            'Éxito',
            <Text>
              Asistencia registrada para el{' '}
              <Text style={{ fontWeight: 'bold', color: '#1F8901' }}>{response.data.userData.tipo}</Text>{' '}
              {response.data.userData.nombre} {' '}
              {response.data.userData.documento} en la fecha{' '}
              {response.data.userData.fecha}.
            </Text>,
            [
              {
                text: 'OK',
                style: 'confirm',
                onPress: () => {
                  closeCustomAlert();
                  navigation.navigate('Home'); // Redirigir al HomeScreen
                },
              },
            ]
          );
        }
      } else {
        showCustomAlert('Error', response.data.error || 'No se pudo registrar la asistencia.', [
          {
            text: 'OK',
            style: 'close',
            onPress: closeCustomAlert,
          },
        ]);
      }
    } catch (error) {
      console.error('Error al procesar el QR:', error);
      showCustomAlert('Error', 'Hubo un problema al procesar el código QR. Por favor, intente de nuevo.', [
        {
          text: 'OK',
          style: 'close',
          onPress: closeCustomAlert,
        },
      ]);
    }
  };

  const showCustomAlert = (title, message, buttons) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons || []);
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Escanea el Código QR</Text>
        </View>
      </CameraView>
      <View style={styles.scannedDataContainer}>
        <Text style={styles.scannedDataText}>
          {scannedData ? `Contenido del QR: ${scannedData}` : 'Esperando escanear...'}
        </Text>
      </View>
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setScanned(false);
            setScannedData('');
          }}
        >
          <Text style={styles.buttonText}>Escanear de Nuevo</Text>
        </TouchableOpacity>
      )}

      {/* Alerta personalizada */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1FBB4B',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 24,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  scannedDataContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  scannedDataText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QRScannerScreen;
