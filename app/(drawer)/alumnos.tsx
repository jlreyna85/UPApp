import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { db } from '../../firebaseconfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import useUserData from '../useUserData';
import CardView from '@/components/CardView';

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const userData = useUserData();

  useEffect(() => {
    if (userData?.nombre) {
      const alumnosRef = collection(db, 'asesorias');
      const q = query(
        alumnosRef,
        where('tutor', '==', userData.nombre),
      );

      const unsubscribeFromSnapshot = onSnapshot(q, (snapshot) => {
        const alumnosList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlumnos(alumnosList);
      });

      return () => unsubscribeFromSnapshot();
    }
  }, [userData?.nombre]);

  const renderAlumnoCard = ({ item }) => (
    <TouchableOpacity>
      <CardView
        key={item.id}
        title={item.titulo}
        subtitle={item.descripcion}
        materia={item.materia}
        tutor={item.usuario} // Here `usuario` acts as the tutor
        imageUrl={''} usuario={''}      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {alumnos.length > 0 ? (
        <FlatList
          data={alumnos}
          renderItem={renderAlumnoCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardGrid}
        />
      ) : (
        <Text style={styles.noAlumnosText}>No hay alumnos disponibles.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noAlumnosText: {
    color: '#000000',
    textAlign: 'center',
  },
});

export default Alumnos;
