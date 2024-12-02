import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { db, storage } from '../../firebaseconfig';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import useUserData from '../useUserData';
import { useUser } from '../UserContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import palette from '@/constants/PaletteColor';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const userData = useUserData();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { uid } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      // Bloquear orientación a landscape cuando la pantalla esté enfocada
      const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      };

      // Restaurar la orientación a portrait cuando la pantalla pierda el foco
      const unlockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };

      lockOrientation();

      // Cuando la pantalla pierda el foco, se restablece la orientación
      return () => {
        unlockOrientation();
      };
    }, [])
  );

  useEffect(() => {
    if (userData && userData.profileImage) {
      setProfileImageUrl(userData.profileImage);
    }
  }, [userData]);

  if (!userData) {
    return <Text>Cargando datos...</Text>;
  }

  // Función para seleccionar una imagen
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri; // Ajustado para la nueva estructura de result
      setProfileImageUrl(imageUri); // Mostrar la nueva imagen localmente
      handleUploadImage(imageUri);
    }
  };

  // Subir imagen a Firebase Storage
  const handleUploadImage = async (imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${userData.usuario}.jpg`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizar URL de la imagen de perfil en Firestore
      if (uid) {
        const userDocRef = doc(db, 'usuarios', uid);
        await updateDoc(userDocRef, { profileImage: downloadURL });
      }

      Alert.alert('Foto de perfil actualizada');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      Alert.alert('Error al subir la imagen');
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Card principal */}
      <Card style={styles.mainCard} elevation={1}>
        <View style={styles.innerContainer}>
        <View style={styles.imageus}>
          <TouchableOpacity style={styles.loginButton} onPress={handlePickImage}>
          <Image 
          source={profileImageUrl ? { uri: profileImageUrl } : require('../../assets/images/lince-600.png')}
          style={styles.userImage} />
          </TouchableOpacity>
          </View>
          
          <Card style={styles.subCard} elevation={1}>
            <View style={styles.cardContent}>
              {/* Datos personales */}
              <Text style={styles.title}>Datos Personales</Text>
              {userData.nombre && <Text style={styles.text}>Nombre: {userData.nombre}</Text>}
              {userData.apellido && <Text style={styles.text}>Apellido: {userData.apellido}</Text>}
              {userData.usuario && <Text style={styles.text}>Usuario: {userData.usuario}</Text>}
              {/* Datos escolares */}
              <Text style={styles.title}>Datos Escolares</Text>
              <Text style={styles.text}>Universidad: Universidad Politecnica de Apodaca</Text>
              {userData.carrera && <Text style={styles.text}>Carrera: {userData.carrera}</Text>}
              {userData.cuatrimestre && <Text style={styles.text}>Cuatrimestre: {userData.cuatrimestre}</Text>}
              {userData.matricula && <Text style={styles.text}>Matricula: {userData.matricula}</Text>}
              {/* Datos de contacto */}
              <Text style={styles.title}>Datos de Contacto</Text>
              {userData.correo && <Text style={styles.text}>Correo: {userData.correo}</Text>}
              </View>
            </Card>

          <View style={styles.logoContainer}>
        <Text style={styles.sideText(palette)}>UP</Text>
        <Image
          source={require('../../assets/images/lince-600.png')}
          style={styles.logo}
        />
        <Text style={styles.sideText(palette)}>PP</Text>
      </View>
      
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    padding: 16,
  },
  mainCard: {
    width: '100%',
    backgroundColor: '#cffffb89',
    borderRadius: 8,
    padding: 16,
  },
  innerContainer: {
    flexDirection: 'row', // Distribuir en fila
    alignItems: 'center',
    justifyContent: 'space-between', // Separar elementos
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: -5,
    tintColor: '#A8E6CF',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 250,
  },
  sideText: (palette) => ({
    fontSize: 48,
    fontWeight: 'bold',
    color: palette.text,
    marginHorizontal: -7,
    fontFamily: 'Montserrat-Bold',
  }),
  imageus: {
    marginTop:-180,
  },
  userImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 100,
  },
  loginButton:{
    width: 100,
    height: 100,
    alignSelf:'flex-start',
    
  },
  subCard: {
    flex: 1, // Expandir para ocupar el espacio restante
    backgroundColor: '#ffffffa9',
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 10,
    color: palette.text,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    color: palette.text,
    marginBottom: 5,
  },
});

export default ProfileScreen;
