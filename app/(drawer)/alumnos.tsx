import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { db } from '../../firebaseconfig'; // Asegúrate de que la ruta sea correcta
import { collection, query, where, getDocs } from 'firebase/firestore';
import CardView from '@/components/CardView'; // Asegúrate de que la ruta sea correcta
import { useUser } from '../UserContext'; // Asegúrate de la ruta correcta

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const { uid, nombre } = useUser(); // Obtener UID y nombre del contexto del usuario

  useEffect(() => {
    const fetchAlumnos = async () => {
      console.log('UID del usuario actual:', uid);

      if (uid) {
        try {
          const alumnosRef = collection(db, 'asesorias'); // Asegúrate de que la colección sea correcta
          const q = query(alumnosRef, where('tutor', '==', uid)); // Filtrar por ID del tutor
          const querySnapshot = await getDocs(q);

          const alumnosList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log('Lista de alumnos recuperados:', alumnosList);
          setAlumnos(alumnosList);
        } catch (error) {
          console.error('Error fetching alumnos:', error);
        }
      } else {
        console.log('UID no disponible.');
      }
    };

    fetchAlumnos();
  }, [uid]);

  const renderAlumnoCard = ({ item }) => (
    <TouchableOpacity>
      <CardView 
        key={item.id} 
        title={item.nombre || 'Usuario'} // Muestra el nombre del alumno
        subtitle={`Tutor: ${nombre}`} // Muestra el nombre del tutor
        imageUrl={item.profileImage || ''} // Asumiendo que tienes una imagen de perfil
      />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: 'assets/images/fondo-textura-papel-blanco.jpg' }} // Asegúrate de que la ruta sea correcta
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Alumnos</Text>
        
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
    </ImageBackground>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardGrid: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAlumnosText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});

export default Alumnos;
