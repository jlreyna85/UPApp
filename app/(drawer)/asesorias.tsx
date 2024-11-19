import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { db } from '../../firebaseconfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import useUserData from '../useUserData';
import CardView from '@/components/CardView';
import { useNavigation } from 'expo-router';
import palette from '@/constants/PaletteColor';

const Asesorias = () => {
  const [asesorias, setAsesorias] = useState([]);
  const userData = useUserData();
  const navigation = useNavigation(); // Inicializar navegación

  useEffect(() => {
    if (userData?.nombre) {
      const asesoriasRef = collection(db, 'asesorias');
      const q = query(
        asesoriasRef,
        where('usuario', '==', userData.nombre),
      );

      const unsubscribeFromSnapshot = onSnapshot(q, (snapshot) => {
        const asesoriasList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAsesorias(asesoriasList);
      });

      return () => unsubscribeFromSnapshot();
    }
  }, [userData?.nombre]);

  // Función para manejar la navegación al presionar una asesoría
  const handlePressAsesoria = (item) => {
    navigation.navigate('rating', { // Navegar a la pantalla 'FinishQuestions'
      nombreTutor: item.tutor, // Pasar el nombre del tutor como parámetro
      materia: item.materia,
    });
  };

  const renderAsesoriaCard = ({ item }) => (
    <TouchableOpacity onPress={() => handlePressAsesoria(item)}>
      <CardView
        key={item.id}
        title={item.titulo}
        subtitle={item.descripcion}
        materia={item.materia}
        tutor={item.tutor} imageUrl={''} usuario={''}      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {asesorias.length > 0 ? (
        <FlatList
          data={asesorias}
          renderItem={renderAsesoriaCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardGrid}
        />
      ) : (
        <Text style={styles.noAsesoriasText}>No hay asesorías disponibles.</Text>
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
  noAsesoriasText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Asesorias;
