import { Drawer } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useUser } from '../UserContext'; // Asegúrate de la ruta correcta
import { doc, getDoc } from 'firebase/firestore'; // Firebase Firestore para obtener el documento del usuario
import { signOut } from 'firebase/auth'; // Importa la función para cerrar sesión
import { auth, db } from '../../firebaseconfig'; // Asegúrate de que la ruta sea correcta para Firestore y Auth
import { NavigationProp, useNavigation } from '@react-navigation/native'; // Para manejar la navegación
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../types';

export default function DrawerLayout() {
  const [userName, setUserName] = useState<string>(''); // Estado para el nombre del usuario
  const [userEmail, setUserEmail] = useState<string>(''); // Estado para el correo del usuario
  const [profileImage, setProfileImage] = useState<string>(''); // Estado para la imagen de perfil
  const { uid } = useUser(); // Obteniendo UID del contexto del usuario
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  

  useEffect(() => {
    const loadUserData = async () => {
      if (uid) {
        try {
          // Referencias a documentos en ambas colecciones
          const userDocRefUsuarios = doc(db, 'usuarios', uid);
          const userDocRefDocentes = doc(db, 'docentes', uid);
          const [userDocUsuarios, userDocDocentes] = await Promise.all([
            getDoc(userDocRefUsuarios),
            getDoc(userDocRefDocentes),
          ]);

          interface UserData {
            nombre: string,
            correo: string,
            profileImage:string,
            // Agrega otros campos que necesites
          }

          if (userDocUsuarios.exists()) {
            const userData = userDocUsuarios.data() as UserData;
            setUserName(userData.nombre || ''); // Establecer el nombre del usuario
            setUserEmail(userData.correo || '');
            setProfileImage(userData.profileImage || ''); // Obtener URL de la imagen de perfil
          } else if (userDocDocentes.exists()) {
            const userData = userDocDocentes.data() as UserData;
            setUserName(userData.nombre || ''); // Establecer el nombre del usuario
            setUserEmail(userData.correo || '');
            setProfileImage(userData.profileImage || ''); // Obtener URL de la imagen de perfil
          } else {
            console.log('No se encontraron datos de usuario.');
          }
        } catch (error) {
          console.error('Error al cargar los datos del usuario:', error);
        }
      } else {
        console.log('UID no disponible.');
      }
    };

    loadUserData();
  }, [uid]);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Cierra sesión en Firebase
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
      navigation.navigate('index' as const); // Redirige a la pantalla de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  const colorScheme = useColorScheme();
  const headerIconColor = colorScheme === 'dark' ? '#000000' : '#ffffff'; // Negro para light, blanco para dark

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(drawerProps) => (
          <DrawerContentScrollView {...drawerProps}>
            <TouchableOpacity style={styles.headerContainer} activeOpacity={0.6}>
              <Image
                source={profileImage ? { uri: profileImage } : require('@/assets/images/lince.png')} // Usa la URL de la imagen de perfil o la imagen por defecto
                style={styles.headerImage}
              />
              <Text style={styles.headerTitle}>{userName}</Text>
              <Text style={styles.headerSubtitle}>{userEmail}</Text>
            </TouchableOpacity>

            {/* Renderizado de las opciones del menú */}
            <DrawerItemList {...drawerProps} />

            {/* Opción para cerrar sesión */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen 
          name="(tabs)" 
          options={{
            headerTintColor: headerIconColor,
            drawerLabel: 'Home', 
            title: 'Home',
            drawerIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} />
          }} 
        />
        <Drawer.Screen 
          name="profile" 
          options={{ 
            headerTintColor: headerIconColor,
            drawerLabel: 'Perfil', 
            title: 'Perfil',
            drawerIcon: ({ color }) => <Ionicons name="person-circle-outline" size={20} color={color} />
          }} 
        />
        <Drawer.Screen 
          name="tst" 
          options={{ 
            headerTintColor: headerIconColor,
            drawerLabel: 'TST', 
            title: 'TST Page',
            drawerIcon: ({ color }) => <Ionicons name="book-outline" size={20} color={color} />
          }} 
        />
        <Drawer.Screen 
          name="alumnos" 
          options={{ 
            headerTintColor: headerIconColor,
            drawerLabel: 'Alumnos', 
            title: 'Alumnos',
            drawerIcon: ({ color }) => <Ionicons name="people-outline" size={20} color={color} />
          }} 
        />
        <Drawer.Screen 
          name="asesorias" 
          options={{ 
            headerTintColor: headerIconColor,
            drawerLabel: 'Asesorias', 
            title: 'Asesorias',
            drawerIcon: ({ color }) => <Ionicons name="library-outline" size={20} color={color} /> 
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    height: 200,
    justifyContent: 'flex-start',
    padding: 15,
    marginTop: -10,
    backgroundColor: '#02ffd5',
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
    color: '#000000',
    paddingTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#080808',
  },
  signOutButton: {
    marginTop: 290,
    padding: 15,
    backgroundColor: '#ad0202c8',
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
