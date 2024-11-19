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
    console.log('Materia seleccionada:', materiaSeleccionada); // Log de materia seleccionada
    if (materiaSeleccionada) {
      cargarDatosDocentes(materiaSeleccionada);
    }
  }, [materiaSeleccionada]);

  const cargarDatosDocentes = async (materia: string) => {
    try {
      console.log('Cargando docentes para la materia:', materia); // Log al cargar docentes
      const docentesQuery = query(collection(db, 'docentes'), where('materias', 'array-contains', materia));
      const querySnapshot = await getDocs(docentesQuery);

      if (!querySnapshot.empty) {
        const docentesList: Docente[] = querySnapshot.docs.map((doc) => {
          const nombre = doc.get('nombre') as string;
          const correo = doc.get('correo') as string;
          const materias = doc.get('materias') as string[];
          const materiaDocente = materias.includes(materia) ? materia : 'Materia no encontrada';

          console.log("Tutor:", nombre, "Materias:", materias); // Log de cada tutor
          return { nombre, correo, materia: materiaDocente, calificacion: null };
        });

        console.log('Docentes encontrados:', docentesList); // Log de docentes encontrados
        obtenerCalificacionesYActualizarDocentes(docentesList);
      } else {
        console.log('No se encontraron docentes para la materia seleccionada.'); // Log si no hay docentes
        setDocentes([]);
      }
    } catch (error) {
      console.error('Error al cargar los docentes:', error);
    } finally {
      setIsLoading(false);
      console.log('Carga de docentes finalizada.'); // Log de finalización de carga
    }
  };

  const obtenerCalificacionesYActualizarDocentes = async (docentesList: Docente[]) => {
    try {
      console.log('Cargando calificaciones para los docentes...'); // Log al cargar calificaciones
      const resultsSnapshot = await getDocs(collection(db, 'results'));
      const calificacionesMap: Record<string, number[]> = {};

      resultsSnapshot.forEach((doc) => {
        const nombreDocente = doc.get('tutor') as string;
        const calificacion = doc.get('result') as number;

        if (!calificacionesMap[nombreDocente]) {
          calificacionesMap[nombreDocente] = [];
        }
        calificacionesMap[nombreDocente].push(calificacion);
      });

      console.log('Calificaciones obtenidas:', calificacionesMap); // Log de calificaciones obtenidas

      const docentesConCalificaciones = docentesList.map((docente) => {
        const calificaciones = calificacionesMap[docente.nombre];
        if (calificaciones && calificaciones.length > 0) {
          const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
          console.log(`Promedio de calificaciones para ${docente.nombre}:`, promedio); // Log del promedio
          return { ...docente, calificacion: promedio };
        }
        console.log(`No se encontraron calificaciones para ${docente.nombre}, asignando 0.`); // Log si no hay calificaciones
        return { ...docente, calificacion: 0 }; // Asignar 0 si no hay calificaciones
      });

      setDocentes(docentesConCalificaciones);
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
    }
  };

  const onDocenteSeleccionado = useCallback((docente: Docente) => {
    setDocente(docente); // Actualiza el contexto
    navigation.navigate('class_tutor', {
      nombre: docente.nombre,
      materia: docente.materia,
      correo: docente.correo,
    });
    console.log("Docente seleccionado:", docente.nombre); // Log del docente seleccionado
  }, [navigation, setDocente]);

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
                startingValue={item.calificacion ?? 0} // Usa 0 como valor por defecto
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
    padding: 30,
    backgroundColor: '#42a5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 20,
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
    backgroundColor: '#05081a778',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default ClassMat;
