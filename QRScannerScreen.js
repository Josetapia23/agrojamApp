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

  // ✅ FUNCIÓN PARA PARSEAR LOS DATOS DEL QR
  const parseQRData = (qrText) => {
    const lines = qrText.split('\n');
    const userData = {};
    
    lines.forEach(line => {
      if (line.includes('Usuario:')) {
        userData.nombre = line.replace('Usuario:', '').trim();
      } else if (line.includes('Correo:')) {
        userData.correo = line.replace('Correo:', '').trim();
      } else if (line.includes('Documento:')) {
        userData.documento = line.replace('Documento:', '').trim();
      } else if (line.includes('Código:')) {
        userData.codigo = line.replace('Código:', '').trim();
      }
    });
    
    return userData;
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    
    // ✅ LOG DETALLADO DEL QR ESCANEADO
    console.log('=== QR ESCANEADO ===');
    console.log('Tipo de código:', type);
    console.log('Datos del QR:', data);
    console.log('Longitud de datos:', data.length);
    console.log('===================');

    try {
      // ✅ EXTRAER EL CÓDIGO QR DEL FORMATO COMPLETO
      const userData = parseQRData(data);
      const qrCodeToSend = userData.codigo || data; // Si no tiene código, enviar QR completo
      
      console.log('� CÓDIGO QR EXTRAÍDO:', qrCodeToSend);
      
      // ✅ LOG DE LA PETICIÓN QUE SE VA A ENVIAR
      const requestData = qs.stringify({ 
        qrData: qrCodeToSend, // Enviar el código QR (USR-xxxxx)
        forceDate: new Date().toISOString().split('T')[0] // Envía fecha actual YYYY-MM-DD
      });
      console.log('📤 ENVIANDO PETICIÓN:');
      console.log('URL:', 'https://tecnoparqueatlantico.com/agrojam/backAgroJam/registerAttendance.php');
      //console.log('URL:', 'http://10.9.222.141/backagrojam/registerAttendance.php');

      console.log('Data enviada:', requestData);
      console.log('Headers:', { 'Content-Type': 'application/x-www-form-urlencoded' });

      const response = await axios.post(
        'https://tecnoparqueatlantico.com/agrojam/backAgroJam/registerAttendance.php',
        //'http://10.9.222.141/backagrojam/registerAttendance.php',
        requestData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // ✅ LOG DETALLADO DE LA RESPUESTA
      console.log('📥 RESPUESTA RECIBIDA:');
      console.log('Status:', response.status);
      console.log('Headers de respuesta:', response.headers);
      console.log('Data completa:', JSON.stringify(response.data, null, 2));
      console.log('===================');

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
        // ✅ LOG CUANDO EL SERVIDOR RESPONDE PERO HAY ERROR
        console.log('❌ ERROR DEL SERVIDOR:');
        console.log('success:', response.data.success);
        console.log('error:', response.data.error);
        console.log('response.data completo:', JSON.stringify(response.data, null, 2));
        
        // ✅ PARSEAMOS Y MOSTRAMOS LA INFO DEL QR AUNQUE HAYA ERROR
        const userData = parseQRData(data);
        
        showCustomAlert(
          'Error de Fecha', 
          <Text>
            <Text style={{ fontWeight: 'bold', color: '#D9534F' }}>
              {response.data.error}
            </Text>
            {'\n\n'}
            <Text style={{ fontWeight: 'bold' }}>Información del QR:</Text>
            {'\n'}
            👤 Usuario: <Text style={{ color: '#1F8901' }}>{userData.nombre}</Text>
            {'\n'}
            📧 Correo: {userData.correo}
            {'\n'}
            🆔 Documento: {userData.documento}
          </Text>, 
          [
            {
              text: 'Cerrar',
              style: 'close',
              onPress: closeCustomAlert,
            },
            {
              text: 'Reintentar',
              style: 'confirm',
              onPress: () => {
                closeCustomAlert();
                setScanned(false); // Permite escanear de nuevo
              },
            },
          ]
        );
      }
    } catch (error) {
      // ✅ LOG DETALLADO DE ERRORES
      console.log('🚨 ERROR EN LA PETICIÓN:');
      console.log('Error message:', error.message);
      console.log('Error completo:', error);
      if (error.response) {
        console.log('Status del error:', error.response.status);
        console.log('Data del error:', error.response.data);
        console.log('Headers del error:', error.response.headers);
      } else if (error.request) {
        console.log('No hubo respuesta del servidor');
        console.log('Request:', error.request);
      }
      console.log('===================');
      
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
