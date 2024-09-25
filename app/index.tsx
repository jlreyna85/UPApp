import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  // Importa el ícono de la librería
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import { RootStackParamList } from './types';

export default function HomeScreen() {
  const { setUid } = useUser();
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);  // Controla si la contraseña es visible
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      const userDocRefUsuarios = doc(db, 'usuarios', uid);
      const userDocRefDocentes = doc(db, 'docentes', uid);

      const [userDocUsuarios, userDocDocentes] = await Promise.all([
        getDoc(userDocRefUsuarios),
        getDoc(userDocRefDocentes),
      ]);

      let userData: any;
      if (userDocUsuarios.exists()) {
        userData = userDocUsuarios.data();
      } else if (userDocDocentes.exists()) {
        userData = userDocDocentes.data();
      }

      if (userData) {
        Alert.alert('Login Successful', `Welcome, ${userData?.nombre || email}`);
        setUid(user.uid);
        navigation.navigate('(drawer)', { uid });
      } else {
        Alert.alert('Error', 'User data not found');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Incorrect credentials. Please try again.');
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('registro');
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('UserList');
  };

  return (
    <ImageBackground
      source={{ uri: 'assets/images/fondo-textura-papel-blanco.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <Image
          source={{ uri: 'assets/images/lince.png' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Bienvenido a UPApp</Text>
      <View style={styles.container}>
        <View style={styles.container2}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />

        {/* Contenedor de la contraseña con el ícono del ojo */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}  // Cambia la visibilidad según el estado
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}  // Cambia la visibilidad al presionar el ícono
            style={styles.eyeIcon}
          >
            <Icon
              name={passwordVisible ? 'eye-off' : 'eye'}  // Cambia el ícono de "ojo" según el estado
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleForgotPasswordPress}>
          <Text style={styles.forgotPasswordText}>Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text>No tienes cuenta?</Text>
          <TouchableOpacity onPress={handleSignupPress}>
            <Text style={styles.signupText}>Registrate Aqui</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  container2: {
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'flex-end',
    tintColor: 'black',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,  // Ocupa el resto del espacio
    height: 50,
  },
  eyeIcon: {
    marginLeft: 10,  // Espacio entre el ícono y el borde del TextInput
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: -10,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  signupText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
