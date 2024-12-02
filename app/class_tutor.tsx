<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import useUserData from './useUserData';
import { useDocente } from './DocenteContext';
import { RootStackParamList } from './types';

interface TutorData {
  nombre: string;
  materias: string[];
  correo: string;
  usimage: string;
}
interface RouteParams {
  nombre: string;
  materia: string;
  correo: string;
}
interface ChatParams {
  tutor: string;
  userName: string;
}

const ClassTutor = () => {
  const { docente } = useDocente();
  const userData = useUserData();
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { materia } = route.params as RouteParams;
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (tutorData && tutorData.usimage) {
      setProfileImageUrl(tutorData.usimage);
    }
  }, [tutorData]);

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!docente) {
        console.log("No hay docente seleccionado");
        return; // Cambié esta línea para no navegar atrás si no hay docente
      }

      const { nombre } = docente;

      try {
        const tutorsRef = collection(db, 'docentes');
        const q = query(tutorsRef, where('nombre', '==', nombre));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const tutorDoc = querySnapshot.docs[0].data();
          setTutorData({
            nombre: tutorDoc.nombre,
            materias: tutorDoc.materias || [],
            correo: tutorDoc.correo,
            usimage: tutorDoc.profileImage
          });
        } else {
          console.log(`No se encontraron datos para el tutor: ${nombre}`);
        }
      } catch (error) {
        console.error('Error al cargar datos del tutor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [docente, navigation]);

  const handleContact = async () => {
    if (!userData || !tutorData) {
      console.log("No se pudo obtener el usuario o datos del tutor");
      return;
    }

    const userName = userData.nombre;
    const tutor = tutorData.nombre;

    try {
      const asesoriasRef = collection(db, 'asesorias');
      const q = query(
        asesoriasRef,
        where('usuario', '==', userName),
        where('tutor', '==', tutor),
        where('materia', '==', materia) // Usa la materia directamente de los parámetros
      );
      const querySnapshot = await getDocs(q);

      navigation.navigate('chat', { tutor, userName } as ChatParams);
      console.log("Vamos a chat con:", tutor, "y", userName);

      if (!querySnapshot.empty) {
        console.log(`Asesoría ya registrada para ${userName} con ${tutor}`);
        alert(`Asesoría ya registrada para ${userName} con ${tutor}`);
      } else {
        const asesoria = {
          usuario: userName,
          tutor: tutor,
          materia: materia, // Usa la materia directamente
          timestamp: new Date().getTime(),
        };
        await addDoc(asesoriasRef, asesoria);
      }
    } catch (error) {
      console.error('Error al registrar asesoría:', error);
    }
  };

  if (loading) {
    return <Text style={styles.text}>Cargando datos...</Text>;
  }

  return (
    <View style={styles.container}>
      {tutorData ? (
        <>
          <Image
                source={profileImageUrl ? { uri: profileImageUrl } :require('../assets/images/lince-600.png')}
                style={styles.image}/>
          <Text style={styles.text}>{`Tutor: ${tutorData.nombre}`}</Text>
          <Text style={styles.text}>{`Materias: ${tutorData.materias.join(', ')}`}</Text>
          <Text style={styles.text}>{`Correo: ${tutorData.correo}`}</Text>
          <Button title="Contactar" onPress={handleContact} />
        </>
      ) : (
        <Text style={styles.text}>No se encontró información del tutor</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 100,
  },
  text: {
    color: '#FDFDFD',
    fontSize: 24,
    marginBottom: 10,
  },
});

export default ClassTutor;
=======
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import useUserData from './useUserData';
import { useDocente } from './DocenteContext';
import { RootStackParamList } from './types';

interface TutorData {
  nombre: string;
  materias: string[];
  correo: string;
}
interface RouteParams {
  nombre: string;
  materia: string;
  correo: string;
}
interface ChatParams {
  tutor: string;
  userName: string;
}

const ClassTutor = () => {
  const { docente } = useDocente();
  const userData = useUserData();
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { materia } = route.params as RouteParams;

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!docente) {
        console.log("No hay docente seleccionado");
        return; // Cambié esta línea para no navegar atrás si no hay docente
      }

      const { nombre } = docente;

      try {
        const tutorsRef = collection(db, 'docentes');
        const q = query(tutorsRef, where('nombre', '==', nombre));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const tutorDoc = querySnapshot.docs[0].data();
          setTutorData({
            nombre: tutorDoc.nombre,
            materias: tutorDoc.materias || [],
            correo: tutorDoc.correo,
          });
        } else {
          console.log(`No se encontraron datos para el tutor: ${nombre}`);
        }
      } catch (error) {
        console.error('Error al cargar datos del tutor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [docente, navigation]);

  const handleContact = async () => {
    if (!userData || !tutorData) {
      console.log("No se pudo obtener el usuario o datos del tutor");
      return;
    }

    const userName = userData.nombre;
    const tutor = tutorData.nombre;

    try {
      const asesoriasRef = collection(db, 'asesorias');
      const q = query(
        asesoriasRef,
        where('usuario', '==', userName),
        where('tutor', '==', tutor),
        where('materia', '==', materia) // Usa la materia directamente de los parámetros
      );
      const querySnapshot = await getDocs(q);

      navigation.navigate('chat', { tutor, userName } as ChatParams);
      console.log("Vamos a chat con:", tutor, "y", userName);

      if (!querySnapshot.empty) {
        console.log(`Asesoría ya registrada para ${userName} con ${tutor}`);
        alert(`Asesoría ya registrada para ${userName} con ${tutor}`);
      } else {
        const asesoria = {
          usuario: userName,
          tutor: tutor,
          materia: materia, // Usa la materia directamente
          timestamp: new Date().getTime(),
        };
        await addDoc(asesoriasRef, asesoria);
      }
    } catch (error) {
      console.error('Error al registrar asesoría:', error);
    }
  };

  if (loading) {
    return <Text style={styles.text}>Cargando datos...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/react-logo.png')} style={styles.image} />
      {tutorData ? (
        <>
          <Text style={styles.text}>{`Tutor: ${tutorData.nombre}`}</Text>
          <Text style={styles.text}>{`Materias: ${tutorData.materias.join(', ')}`}</Text>
          <Text style={styles.text}>{`Correo: ${tutorData.correo}`}</Text>
          <Button title="Contactar" onPress={handleContact} />
        </>
      ) : (
        <Text style={styles.text}>No se encontró información del tutor</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
    padding: 16,
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  text: {
    color: '#FDFDFD',
    fontSize: 24,
    marginBottom: 10,
  },
});

export default ClassTutor;
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
