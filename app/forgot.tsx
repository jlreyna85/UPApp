<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import palette from '../constants/PaletteColor';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      if (Platform.OS === 'web') {
        alert('Se ha enviado un correo para restablecer tu contraseña.'); // Usar alert() para web
      } else {
        Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña.'); // Usar Alert para móvil
      }
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      const errorMessage = `No se pudo enviar el correo: ${error.message}`;
      if (Platform.OS === 'web') {
        alert(errorMessage); // Usar alert() para web
      } else {
        Alert.alert('Error', errorMessage); // Usar Alert para móvil
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.resetButton(palette)} onPress={handlePasswordReset}>
          <Text style={styles.resetButtonText}>Enviar correo de restablecimiento</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: palette.text,
    fontFamily: 'Montserrat-Bold', 
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    height: 50,
    borderColor: palette.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resetButton: (palette) => ({
    backgroundColor: palette.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  }),
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold', 
  },
});

export default PasswordReset;
=======
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import palette from '../constants/PaletteColor';

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      if (Platform.OS === 'web') {
        alert('Se ha enviado un correo para restablecer tu contraseña.'); // Usar alert() para web
      } else {
        Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña.'); // Usar Alert para móvil
      }
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      const errorMessage = `No se pudo enviar el correo: ${error.message}`;
      if (Platform.OS === 'web') {
        alert(errorMessage); // Usar alert() para web
      } else {
        Alert.alert('Error', errorMessage); // Usar Alert para móvil
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.resetButton(palette)} onPress={handlePasswordReset}>
          <Text style={styles.resetButtonText}>Enviar correo de restablecimiento</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: palette.text,
    fontFamily: 'Montserrat-Bold', 
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    height: 50,
    borderColor: palette.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resetButton: (palette) => ({
    backgroundColor: palette.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  }),
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold', 
  },
});

export default PasswordReset;
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
