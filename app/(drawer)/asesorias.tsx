import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { db } from '../../firebaseconfig';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import useUserData from '../useUserData';
import CardViewTutor from '@/components/CardView';

const Asesorias = () => {
  const [asesorias, setAsesorias] = useState([]);
  const userData = useUserData();

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

  const renderAsesoriaCard = ({ item }) => (
    <TouchableOpacity>
      <CardViewTutor
        key={item.id}
        title={item.titulo}
        subtitle={item.descripcion}
        materia={item.materia}
        tutor={item.tutor}
      />
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
  },
  cardGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noAsesoriasText: {
    color: '#000000',
    textAlign: 'center',
  },
});

export default Asesorias;
