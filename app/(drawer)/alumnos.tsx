<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { db } from '../../firebaseconfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import useUserData from '../useUserData';
import CardView from '@/components/CardView';
import palette from '@/constants/PaletteColor';

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
        tutor={''}
        imageUrl={''} 
        usuario={item.usuario}      />
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
    backgroundColor: palette.background,
  },
  cardGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
  },
  noAlumnosText: {
    color: '#000000',
    textAlign: 'center',
  },
});

export default Alumnos;
=======
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { db } from '../../firebaseconfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import useUserData from '../useUserData';
import CardView from '@/components/CardView';
import palette from '@/constants/PaletteColor';

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
        tutor={''}
        imageUrl={''} 
        usuario={item.usuario}      />
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
    backgroundColor: palette.background,
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
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
