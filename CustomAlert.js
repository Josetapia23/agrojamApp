import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomAlert = ({ visible, title, message, buttons }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        if (buttons && buttons[0]?.onPress) buttons[0].onPress(); // Cierra la alerta si no se pasa un botón específico
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons?.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.alertButton, button.style === 'cancel' ? styles.cancelButton : styles.confirmButton]}
                onPress={button.onPress}
              >
                <Text style={styles.alertButtonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  alertTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1F8901',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#626262',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  alertButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#D9534F', // Rojo para cancelar
  },
  confirmButton: {
    backgroundColor: '#1FBB4B', // Verde para confirmar
  },
  alertButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default CustomAlert;
