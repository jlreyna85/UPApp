import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import { RootStackParamList } from './types';
import palette from '../constants/PaletteColor';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading'; // Asegúrate de tener esta dependencia

export default function HomeScreen() {
  const { setUid } = useUser();
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadFonts = async () => {
    await Font.loadAsync({
      'Montserrat-Bold': require('../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
      'OpenSans-Regular': require('../assets/fonts/Open_Sans/static/OpenSans-Regular.ttf'),
      'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    });
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

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
      const userDocRefWorkers = doc(db, 'workers', uid);

      const [userDocUsuarios, userDocDocentes, userDocWorkers] = await Promise.all([
        getDoc(userDocRefUsuarios),
        getDoc(userDocRefDocentes),
        getDoc(userDocRefWorkers),
      ]);

      let userData: any;
      if (userDocUsuarios.exists()) {
        userData = userDocUsuarios.data();
      } else if (userDocDocentes.exists()) {
        userData = userDocDocentes.data();
      } else if (userDocWorkers.exists()) {
        userData = userDocWorkers.data(); 
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
    navigation.navigate('forgot');
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container(palette)}>
      <Text style={styles.sentText(palette)}>Bienvenido a</Text>
      <View style={styles.logoContainer}>
        <Text style={styles.sideText(palette)}>UP</Text>
        <Image
          source={require('../assets/images/lince-600.png')}
          style={styles.logo}
        />
        <Text style={styles.sideText(palette)}>PP</Text>
      </View>

      <View style={styles.container2}>
        <TextInput
          style={styles.input(palette)}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />

        <View style={styles.passwordContainer(palette)}>
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
          <Text style={styles.forgotPasswordText(palette)}>Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton(palette)} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text>No tienes cuenta?</Text>
          <TouchableOpacity onPress={handleSignupPress}>
            <Text style={styles.signupText(palette)}>Registrate Aqui</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: (palette) => ({
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
    backgroundColor: palette.background,
  }),
  container2: {
    justifyContent: 'center',
    paddingVertical:250,
    paddingHorizontal: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: -5,
    tintColor: '#000000',
  },
  sentText: (palette) => ({
    fontSize: 52,
    fontWeight: 'bold',
    color: palette.text,
    fontFamily: 'Montserrat-Bold', // Aplica la fuente Montserrat
    alignSelf: 'center',
  }),
  sideText: (palette) => ({
    fontSize: 52,
    fontWeight: 'bold',
    color: palette.text,
    marginHorizontal: 10,
    fontFamily: 'Montserrat-Bold', // Aplica la fuente Montserrat
  }),
  input: (palette) => ({
    height: 50,
    borderColor: palette.primary,
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
    fontFamily: 'OpenSans-Regular', // Aplica la fuente Open Sans
  }),
  passwordContainer: (palette) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: palette.primary,
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
    fontFamily: 'OpenSans-Regular', // Aplica la fuente Open Sans
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgotPasswordText: (palette) => ({
    color: palette.link,
    fontWeight: 'bold',
    marginTop: -10,
    fontFamily: 'Poppins-SemiBold', // Aplica la fuente Poppins
  }),
  loginButton: (palette) => ({
    backgroundColor: palette.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  }),
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold', // Aplica la fuente Poppins
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  signupText: (palette) => ({
    color: palette.link,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold', // Aplica la fuente Poppins
  }),
});
