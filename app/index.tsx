import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const colors = {
    primary: '#4A90E2', // Azul claro
    secondary: '#A8E6CF', // Verde suave
    accent: '#FFA726', // Naranja
    background: '#F5F5F5', // Gris claro
    text: '#424242', // Gris oscuro
    link: '#007AFF', // Azul para enlaces
  };

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
    <View style={styles.container(colors)}>
      <Image
        source={{ uri: 'assets/images/react-logo.png' }}
        style={styles.logo}
      />
      <Text style={styles.title(colors)}>Bienvenido a UPApp</Text>
      <View style={styles.container2}>
        <TextInput
          style={styles.input(colors)}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />

        <View style={styles.passwordContainer(colors)}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Icon
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleForgotPasswordPress}>
          <Text style={styles.forgotPasswordText(colors)}>Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton(colors)} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text>No tienes cuenta?</Text>
          <TouchableOpacity onPress={handleSignupPress}>
            <Text style={styles.signupText(colors)}>Registrate Aqui</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: (colors) => ({
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: colors.background,
  }),
  container2: {
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    tintColor: 'black',
  },
  title: (colors) => ({
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text,
  }),
  input: (colors) => ({
    height: 50,
    borderColor: colors.primary,
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
  }),
  passwordContainer: (colors) => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.primary,
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
  }),
  inputPassword: {
    flex: 1,
    height: 50,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgotPasswordText: (colors) => ({
    color: colors.link,
    fontWeight: 'bold',
    marginTop: -10,
  }),
  loginButton: (colors) => ({
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  }),
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
  signupText: (colors) => ({
    color: colors.link,
    fontWeight: 'bold',
  }),
});
