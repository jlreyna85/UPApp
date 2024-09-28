import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import palette from '@/constants/PaletteColor';



const ClassSistema = () => {
  const [nombresMaterias, setNombresMaterias] = useState<string[]>([]);
  const route = useRoute();
  const navigation = useNavigation();

  const { cuatrimestreSeleccionado, carrera } = route.params || {};
  const cuatrimestreNumber = parseInt(cuatrimestreSeleccionado, 10);

  console.log("carrera:", carrera);

  useEffect(() => {
    cargarDatosDocentes(cuatrimestreNumber, carrera);
  }, [cuatrimestreNumber, carrera]);

  const cargarDatosDocentes = async (cuatrimestreSeleccionado: number, carrera: string) => {
    try {
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
    backgroundColor: palette.background,
  },
  card: {
    width: 300,
    backgroundColor: palette.primary, // Usar color primario
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ClassSistema;