import { Drawer } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useUser } from '../UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseconfig';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../types';
import pallete from '../../constants/PaletteColor'; // Asegúrate de que la ruta sea correcta

export default function DrawerLayout() {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [userRole, setUserRole] = useState<string>(''); 
  const { uid } = useUser();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserData = async () => {
      if (uid) {
        try {
          const userDocRefUsuarios = doc(db, 'usuarios', uid);
          const userDocRefDocentes = doc(db, 'docentes', uid);
          const [userDocUsuarios, userDocDocentes] = await Promise.all([
            getDoc(userDocRefUsuarios),
            getDoc(userDocRefDocentes),
          ]);

          if (userDocUsuarios.exists()) {
            setUserRole('student'); 
            const userData = userDocUsuarios.data();
            setUserName(userData.nombre || '');
            setUserEmail(userData.correo || '');
            setProfileImage(userData.profileImage || '');
          } else if (userDocDocentes.exists()) {
            setUserRole('tutor'); 
            const userData = userDocDocentes.data();
            setUserName(userData.nombre || '');
            setUserEmail(userData.correo || '');
            setProfileImage(userData.profileImage || '');
          }
        } catch (error) {
          console.error('Error al cargar los datos del usuario:', error);
        }
      }
    };

    loadUserData();
  }, [uid]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
      navigation.navigate('index' as const);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  const colorScheme = useColorScheme();
  const headerIconColor = colorScheme === 'dark' ? '#000000' : '#ffffff';

  const routes = [
    { name: '(tabs)', label: 'Home', icon: 'home-outline' },
    { name: 'profile', label: 'Perfil', icon: 'person-circle-outline' },
    { name: 'alumnos', label: 'Alumnos', icon: 'people-outline' },
    { name: 'asesorias', label: 'Asesorias', icon: 'library-outline' },
    { name: 'class_add', label: 'Materias', icon: 'library-outline' },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(drawerProps) => (
          <DrawerContentScrollView {...drawerProps}>
            <TouchableOpacity style={styles.headerContainer} activeOpacity={0.6}>
              <Image
                source={profileImage ? { uri: profileImage } : require('@/assets/images/react-logo.png')}
                style={styles.headerImage}
              />
              <Text style={styles.headerTitle}>{userName}</Text>
              <Text style={styles.headerSubtitle}>{userEmail}</Text>
            </TouchableOpacity>

            {routes.map(route => {
              const shouldHide = 
                (userRole === 'tutor' && route.name === 'asesorias') || 
                (userRole === 'student' && route.name === 'alumnos');

              console.log(`Route: ${route.name}, Should Hide: ${shouldHide}`);

              return !shouldHide ? (
                <TouchableOpacity
                  key={route.name}
                  style={styles.drawerItem}
                  onPress={() => drawerProps.navigation.navigate(route.name)}
                >
                  <Ionicons name={route.icon} size={20} color="#000" />
                  <Text style={styles.drawerItemLabel}>{route.label}</Text>
                </TouchableOpacity>
              ) : null;
            })}

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </DrawerContentScrollView>
        )}
      >
        {routes.map(route => (
          <Drawer.Screen
            key={route.name}
            name={route.name}
            options={{
              headerTintColor: headerIconColor,
              drawerLabel: route.label,
              title: route.label,
              drawerIcon: ({ color }) => <Ionicons name={route.icon} size={20} color={color} />,
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}

// En lugar de usar colores hardcodeados, usa la paleta
const styles = StyleSheet.create({
  headerContainer: {
    height: 200,
    justifyContent: 'flex-start',
    padding: 15,
    marginTop: -10,
    backgroundColor: pallete.primary,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: pallete.text,
    paddingTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: pallete.text,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  drawerItemLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: pallete.text,
  },
  signOutButton: {
    marginTop: 290,
    padding: 15,
    backgroundColor: pallete.accent,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: pallete.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
