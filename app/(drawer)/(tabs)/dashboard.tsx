import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItem, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CardView from '@/components/CardView';
import { useUser } from '../../UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseconfig';
import { RootStackParamList } from '@/app/types';

const colors = {
  primary: '#4A90E2', // Azul claro
  secondary: '#A8E6CF', // Verde suave
  accent: '#FFA726', // Naranja
  background: '#F5F5F5', // Gris claro
  text: '#424242', // Gris oscuro
  link: '#007AFF', // Azul para enlaces
};

interface UserData {
  cuatrimestre: string;
  nombre?: string;
  carrera?: string;
}

export default function Dash() {
  const [cuatrimestre, setCuatrimestre] = useState<number>(0);
  const [carrera, setCarrera] = useState<string>(''); 
  const [userName, setUserName] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { uid } = useUser();

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
            const userData = userDocUsuarios.data() as UserData;
            const cuatrimestreNumber = parseInt(userData.cuatrimestre, 10) || 0;
            setCuatrimestre(cuatrimestreNumber);
            setUserName(userData.nombre || '');
            setCarrera(userData.carrera || '');
          } else if (userDocDocentes.exists()) {
            const userData = userDocDocentes.data() as UserData;
            setUserName(userData.nombre || '');
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

  const handleCardPress = (cuatrimestre: number) => {
    navigation.navigate('class_sistema', {
      cuatrimestreSeleccionado: cuatrimestre.toString(),
      carrera: carrera,
    });
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
        headerBackgroundColor={{ light: colors.primary, dark: 'rgb(21,23,24)' }} 
        headerImage={<Image style={styles.headerImage} source={require('@/assets/images/react-logo.png')} />}
      >
        <ThemedView style={styles.titleCareer}>
          <ThemedText type="title" style={{ color: colors.text }}>{carrera}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ color: colors.text }}>¡Bienvenido, {userName}!</ThemedText>
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
            <ThemedText style={{ color: colors.text }}>No hay cuatrimestres disponibles.</ThemedText>
          )}
        </ThemedView>
      </ParallaxScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
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
