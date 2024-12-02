import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ListRenderItem, TouchableOpacity} from 'react-native';
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
import palette from '@/constants/PaletteColor';
import * as Font from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';

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
    // Bloquear orientación vertical al montar
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);

    return () => {
      // Asegurar restauración global (si es necesario)
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);


  const loadFonts = async () => {
    await Font.loadAsync({
      'Montserrat-Bold': require('../../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
      'OpenSans-Regular': require('../../../assets/fonts/Open_Sans/static/OpenSans-Regular.ttf'),
      'Poppins-SemiBold': require('../../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    });
  };

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
      <CardView key={item} title={`${item}er Cuatrimestre`} subtitle={''} materia={''} tutor={''} usuario={''}/>
    </TouchableOpacity>
  );

  return (
      <ParallaxScrollView 
        headerBackgroundColor={{ light: palette.primary, dark: '#424242' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ color: '#4A90E2', fontSize:28,  }}>¡Bienvenido,{userName}!</ThemedText>
          {carrera && (<ThemedText type="title" style={{ color: '#4A90E2', fontSize: 22 }}>{carrera}!</ThemedText>)}
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
            <ThemedText style={{ color: palette.text }}>No hay cuatrimestres disponibles.</ThemedText>
          )}
        </ThemedView>
      </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 0,
    backgroundColor: palette.background,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleCareer: {
    alignItems: 'center',
    marginTop: 10,
    gap: 0,
  },
  cardGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    gap: 8,
  },
});