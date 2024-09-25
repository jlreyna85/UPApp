import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItem, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CardView from '@/components/CardView';
import { useUser } from '../../UserContext'; // Asegúrate de la ruta correcta
import { doc, getDoc } from 'firebase/firestore'; // Firebase Firestore para obtener el documento del usuario
import { db } from '../../../firebaseconfig'; // Asegúrate de que la ruta sea correcta
import { RootStackParamList } from '@/app/types';

// Define el tipo para los datos del usuario
interface UserData {
  cuatrimestre: string; // Cambiar a string ya que viene de Firestore
  nombre?: string; // Añadir el nombre del usuario si lo quieres mostrar
  carrera?: string; // Añadir la carrera del usuario
}

export default function Dash() {
  const [cuatrimestre, setCuatrimestre] = useState<number>(0); // Cambiado a número
  const [carrera, setCarrera] = useState<string>(''); 
  const [userName, setUserName] = useState<string>(''); // Estado para el nombre del usuario
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { uid } = useUser();

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

          if (userDocUsuarios.exists()) {
            const userData = userDocUsuarios.data() as UserData;
            const cuatrimestreNumber = parseInt(userData.cuatrimestre, 10) || 0; // Convertir a número
            setCuatrimestre(cuatrimestreNumber);
            setUserName(userData.nombre || ''); // Establecer el nombre del usuario
            setCarrera(userData.carrera || ''); // Establecer la carrera del usuario
          } else if(userDocDocentes.exists()){
            const userData = userDocDocentes.data() as UserData;
            setUserName(userData.nombre || ''); // Establecer el nombre del usuario
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
  }, [uid]); // Asegúrate de que se ejecute cada vez que `uid` cambie

  const handleCardPress = (cuatrimestre: number) => {
    navigation.navigate('class_sistema');
    console.log("Es el cuatrimestre:", cuatrimestre);
  };

  const renderCuatrimestreCard: ListRenderItem<number> = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <CardView key={item} title={`${item}er Cuatrimestre`} subtitle={''} imageUrl={''} />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: 'assets/images/fondo-textura-papel-blanco.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
    <ParallaxScrollView 
    headerBackgroundColor={{ light: '#00CCB1', dark: 'rgb(21,23,24)' }} 
    headerImage={<Image style={styles.headerImage} source={require('@/assets/images/lince.png')} />}>
      <ThemedView style={styles.titleCareer}>
        <ThemedText type="title">{carrera}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Bienvenido, {userName}!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.cardGrid}>
        {cuatrimestre > 0 ? (
          <FlatList
            data={[...Array(cuatrimestre).keys()].map(i => i + 1)}
            renderItem={renderCuatrimestreCard}
            keyExtractor={(item) => item.toString()}
            numColumns={1}
            contentContainerStyle={styles.cardGrid}
          />
        ) : (
          <ThemedText>No hay cuatrimestres disponibles.</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  headerImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
    marginBottom: 2,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 10,
  },
  titleCareer: {
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  cardGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    gap: 8,
  },
});
