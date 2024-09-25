import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useUser } from '../UserContext'; // Asegúrate de que la ruta sea correcta
import CardView from '@/components/CardView'; // Asegúrate de que la ruta sea correcta
import { db } from '../../firebaseconfig'; // Asegúrate de que la ruta sea correcta
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const Asesorias = () => {
  const [asesorias, setAsesorias] = useState([]);
  const { uid, nombre } = useUser(); // Asegúrate de que `nombre` esté disponible en el contexto

  useEffect(() => {
    const unsubscribe = () => {
      if (uid) {
        const asesoriasRef = collection(db, 'asesorias');
        const q = query(asesoriasRef, orderBy('timestamp')); // Asegúrate de que hay un campo 'timestamp' en las asesorías

        const unsubscribeFromSnapshot = onSnapshot(q, (snapshot) => {
          const asesoriasList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('Asesorías recuperadas:', asesoriasList);
          setAsesorias(asesoriasList);
        });

        return unsubscribeFromSnapshot;
      }
    };

    const unsubscribeFromCollection = unsubscribe();

    return () => unsubscribeFromCollection && unsubscribeFromCollection(); // Limpia la suscripción
  }, [uid]);

  const renderAsesoriaCard = ({ item }) => (
    <TouchableOpacity>
      <CardView 
        key={item.id} 
        title={item.titulo} 
        subtitle={item.descripcion} 
        materia={item.materia} 
        tutor={item.tutor} 
      />
    </TouchableOpacity>
  );

  const CardView = ({ title, subtitle, materia, tutor }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.materia}>{materia}</Text>
      <Text style={styles.tutor}>{tutor}</Text>
    </View>
  );

  return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>¡Bienvenido, {nombre}!</Text>
        <Text style={styles.title}>Asesorías</Text>
        
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
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'bluesky', // Color de fondo para depuración
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardGrid: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAsesoriasText: {
    color: '#000000',
    textAlign: 'center',
  },
});

export default Asesorias;
