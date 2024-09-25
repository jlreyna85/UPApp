import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { Rating } from 'react-native-ratings';
import { useDocente } from './DocenteContext';
import { RootStackParamList } from './types';

interface Docente {
  nombre: string;
  materia: string;
  correo: string;
  calificacion: number | null;
}

interface RouteParams {
  materiaSeleccionada: string;
}

const ClassMat = () => {
  const { setDocente } = useDocente(); // Destructura setDocente
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { materiaSeleccionada = '' } = route.params as RouteParams || {};

  useEffect(() => {
    if (materiaSeleccionada) {
      cargarDatosDocentes(materiaSeleccionada);
    }
  }, [materiaSeleccionada]);

  const cargarDatosDocentes = async (materia: string) => {
    try {
      const docentesQuery = query(collection(db, 'docentes'), where('materias', 'array-contains', materia));
      const querySnapshot = await getDocs(docentesQuery);

      if (!querySnapshot.empty) {
        const docentesList: Docente[] = querySnapshot.docs.map((doc) => {
          const nombre = doc.get('nombre') as string;
          const correo = doc.get('correo') as string;
          const materias = doc.get('materias') as string[];
          const materiaDocente = materias.includes(materia) ? materia : 'Materia no encontrada';

          console.log("Tutor:",nombre,"Materias:",materias);
          return { nombre,correo, materia: materiaDocente, calificacion: null };
        });
        

        obtenerCalificacionesYActualizarDocentes(docentesList);
      } else {
        setDocentes([]);
      }
    } catch (error) {
      console.error('Error al cargar los docentes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerCalificacionesYActualizarDocentes = async (docentesList: Docente[]) => {
    try {
      const resultsSnapshot = await getDocs(collection(db, 'results'));
      const calificacionesMap: Record<string, number[]> = {};

      resultsSnapshot.forEach((doc) => {
        const nombreDocente = doc.get('teacher') as string;
        const calificacion = doc.get('result') as number;

        if (!calificacionesMap[nombreDocente]) {
          calificacionesMap[nombreDocente] = [];
        }
        calificacionesMap[nombreDocente].push(calificacion);
      });

      const docentesConCalificaciones = docentesList.map((docente) => {
        const calificaciones = calificacionesMap[docente.nombre];
        if (calificaciones && calificaciones.length > 0) {
          const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
          return { ...docente, calificacion: promedio };
        }
        return docente;
      });

      setDocentes(docentesConCalificaciones);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
    }
  };

  const onDocenteSeleccionado = useCallback((docente: Docente) => {
    setDocente(docente); // Actualiza el contexto
    navigation.navigate('class_tutor',{
      nombre: docente.nombre,
      materia: docente.materia,
      correo: docente.correo,
    });
    console.log("TST1",docente.nombre);
    console.log("TST2",docente.materia);
    console.log("TST3",docente.correo);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : docentes.length === 0 ? (
        <Text style={styles.Alone}>No se encontraron docentes disponibles para esta materia.</Text>
      ) : (
        <FlatList
          data={docentes}
          keyExtractor={(item) => item.nombre}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onDocenteSeleccionado(item)}
              accessibilityLabel={`Seleccionar docente ${item.nombre}`}
            >
              <Text style={styles.cardTitle}>Tutor: {item.nombre}</Text>
              <Text style={styles.cardSubtitle}>Materia: {item.materia}</Text>
              <Rating
                ratingCount={5}
                imageSize={20}
                readonly
                startingValue={item.calificacion || 0}
                style={styles.ratingContainer}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#42a5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#0c0c0c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#000000',
    fontSize: 16,
  },
  Alone: {
    alignItems: 'flex-end',
    padding: 8,
    gap: 8,
  },
  ratingContainer: {
    backgroundColor: '#272938778',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default ClassMat;
