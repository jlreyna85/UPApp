import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { RootStackParamList } from './types';

interface RouteParams {
  cuatrimestreSeleccionado: string;
  carreraSeleccionada: string;
}

const ClassSistema = () => {
  const [nombresMaterias, setNombresMaterias] = useState<string[]>([]);
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { cuatrimestreSeleccionado = '1', carreraSeleccionada = 'Ingenieria en Sistemas Computacionales' } = route.params as RouteParams || {};
  const cuatrimestreNumber = parseInt(cuatrimestreSeleccionado, 10);

  // Función para convertir carrera usando switch
  const convertirCarrera = (carrera: string): string => {
    switch (carrera.toLowerCase().trim()) {
      case 'Ingenieria en Sistemas Computacionales':
        return 'sistemas';
      case 'licenciatura en comercio internacional y aduanas':
        return 'comercio';
      case 'ingeniería en diseño industrial':
        return 'diseño';
      case 'ingeniería en mecatronica':
        return 'mecatronica';
      case 'ingeniería financiera':
        return 'financiera';
      case 'ingeniería en aeronautica':
        return 'aeronautica';
      default:
        return carrera; // Si no coincide, devolver la carrera original
    }
  };

  const carreraAbreviada = convertirCarrera(carreraSeleccionada);
  console.log(carreraAbreviada);
  console.log(carreraSeleccionada);

  useEffect(() => {
    cargarDatosDocentes(cuatrimestreNumber, carreraAbreviada);
  }, [cuatrimestreNumber, carreraAbreviada]);

  const cargarDatosDocentes = async (cuatrimestreSeleccionado: number, carrera: string) => {
    try {
      // Buscar el documento de la carrera
      const carreraQuery = query(collection(db, 'carrera'), where('carrera', '==', carrera));
      const querySnapshot = await getDocs(carreraQuery);

      if (!querySnapshot.empty) {
        const carreraDoc = querySnapshot.docs[0]; // Obtener el primer documento que coincide
        const docRef = doc(db, 'carrera', carreraDoc.id, 'cuatrimestre', `c${cuatrimestreSeleccionado}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const materias: string[] = [];
          for (let i = 1; i <= 7; i++) {
            const materia = docSnap.get(`mat${i}`);
            if (materia) {
              materias.push(materia);
            }
          }
          setNombresMaterias(materias);
        } else {
          console.error('Documento de cuatrimestre no existe');
        }
      } else {
        console.error('No se encontró el documento de la carrera');
      }
    } catch (error) {
      console.error('Error al cargar los datos del docente:', error);
    }
  };

  const onMateriaSeleccionada = (materia: string) => {
    navigation.navigate('class_mat', { materiaSeleccionada: materia });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={nombresMaterias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onMateriaSeleccionada(item)}>
            <Text style={styles.cardTitle}>Materia: {item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'rgb(21,23,24)',
  },
  card: {
    width:300,
    backgroundColor: '#4dd0e1',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignSelf:"center",
    
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ClassSistema;
