import React, { useState, useEffect, useId } from 'react';
import { View, Text, StyleSheet, Image, Alert, Button } from 'react-native';
import { db, storage } from '../../firebaseconfig'; // Asegúrate de que la ruta sea correcta
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import useUserData from '../useUserData';
import { useUser } from '../UserContext';

const colors = {
  primary: '#4A90E2', // Azul claro
  secondary: '#A8E6CF', // Verde suave
  accent: '#FFA726', // Naranja
  background: '#F5F5F5', // Gris claro
  text: '#424242', // Gris oscuro
  link: '#007AFF', // Azul para enlaces
};

const ProfileScreen = () => {
  const userData = useUserData();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { uid } = useUser();

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
    <View style={styles.container}>
      <Image
        source={profileImageUrl ? { uri: profileImageUrl } : require('@/assets/images/react-logo.png')}
        style={styles.image}
      />
      <Button title="Subir Foto de Perfil" onPress={handlePickImage} />
      <Text style={styles.label}>Nombre Completo</Text>
      <Text style={styles.value}>{userData.nombre} {userData.apellido}</Text>
      <Text style={styles.label}>Correo</Text>
      <Text style={styles.value}>{userData.correo}</Text>
      <Text style={styles.label}>Carrera</Text>
      <Text style={styles.value}>{userData.carrera}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Usar color de fondo
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 100,
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    color: colors.primary, // Usar color primario para el texto
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 15,
  },
  value: {
    fontSize: 18,
    color: colors.text, // Usar color de texto
    textAlign: 'left',
    marginBottom: 15,
  },
});

export default ProfileScreen;
