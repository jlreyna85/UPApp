// Otras importaciones
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, Picker } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { RootStackParamList } from './types';

export default function Registro() {
  const [isTutor, setIsTutor] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [cuatrimestre, setCuatrimestre] = useState<string>('');
  const [matricula, setMatricula] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [filterCarrera, setFilterCarrera] = useState<string>('');
  const [filterCuatrimestre, setFilterCuatrimestre] = useState<string>('');

  // Estados para los datos del picker
  const [cuatrimestres, setCuatrimestres] = useState<string[]>([]);
  const [carreras, setCarreras] = useState<string[]>([]);
  const [materias, setMaterias] = useState<string[]>([]);
  const [filteredMaterias, setFilteredMaterias] = useState<string[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadCuatrimestres();
    loadCarreras();
  }, []);

  useEffect(() => {
    loadMaterias(filterCarrera); // Cargar materias con filtros
  }, [filterCarrera]); // Vuelve a cargar materias cuando los filtros cambian

  const loadCuatrimestres = () => {
    const cuatrimestresArray = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    setCuatrimestres(cuatrimestresArray);
  };

  const loadCarreras = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'carrera'));
      const carrerasData = querySnapshot.docs.map(doc => doc.data().carrera);
      setCarreras(carrerasData);
      console.log('Carreras cargadas:', carrerasData); // Log para verificar carreras
    } catch (error) {
      showAlert('Error', `Error al cargar carreras: ${error.message}`);
    }
  };

  const loadMaterias = async (carreraFilter: string) => {
    try {
      const materiasList: string[] = [];
      const querySnapshot = await getDocs(collection(db, 'carrera'));
      
      for (const document of querySnapshot.docs) {
        const cuatrimestreSnapshot = await getDocs(collection(db, `carrera/${document.id}/cuatrimestre`));
        
        for (const cuatrimestre of cuatrimestreSnapshot.docs) {
          const materiasData = cuatrimestre.data();
          
          for (const key in materiasData) {
            const materias = materiasData[key].toString().split(',');
            
            // Filtrar las materias por carrera y cuatrimestre
            if (
              (carreraFilter ? document.data().carrera === carreraFilter : true)
            ){
              materiasList.push(...materias);
            }
          }
        }
      }
      
      setMaterias(materiasList);
      setFilteredMaterias(materiasList);
      console.log('Materias cargadas:', materiasList); // Log para verificar materias
    } catch (error) {
      showAlert('Error', `Error al cargar materias: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userData = {
        usuario,
        nombre,
        apellido,
        correo,
        cuatrimestre,
        carrera,
        matricula,
      };
      await setDoc(doc(db, 'usuarios', user.uid), userData);
  
      showAlert('Éxito', 'Usuario registrado exitosamente');
      navigation.navigate('index');
    } catch (error) {
      console.log(error); // Agregar esta línea
      showAlert('Error', `Error al registrar usuario: ${error.message}`);
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const handleToggleSwitch = () => {
    setIsTutor(previousState => !previousState);
    setSelectedSubjects([]);
    setMatricula('');
    setCuatrimestre('');
    if (!isTutor) loadCarreras();
  };

  const addSubject = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects(prev => [...prev, subject]);
    } else {
      showAlert('Error', 'Ya has seleccionado esta materia.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Registrarse como:</Text>
        <Switch
          value={isTutor}
          onValueChange={handleToggleSwitch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isTutor ? '#f5dd4b' : '#f4f3f4'}
        />
        <Text style={styles.toggleText}>{isTutor ? 'Tutor' : 'Estudiante'}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {!isTutor && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            value={matricula}
            onChangeText={setMatricula}
          />

          {/* Picker para seleccionar la carrera */}
          <Picker
            selectedValue={filterCarrera}
            style={styles.picker}
            onValueChange={(itemValue) => setFilterCarrera(itemValue)}
          >
            <Picker.Item label="Selecciona Carrera" value="" />
            {carreras.map((carrera) => (
              <Picker.Item key={carrera} label={carrera} value={carrera} />
            ))}
          </Picker>

          <Picker
            selectedValue={cuatrimestre}
            style={styles.picker}
            onValueChange={(itemValue) => setCuatrimestre(itemValue)}
          >
            <Picker.Item label="Selecciona Cuatrimestre" value="" />
            {cuatrimestres.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </>
      )}

      {isTutor && (
        <>
          <Picker
            selectedValue={filterCarrera}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setFilterCarrera(itemValue);
              setFilterCuatrimestre(''); // Reinicia cuatrimestre al cambiar carrera
              console.log('Carrera seleccionada:', itemValue); // Log para verificar carrera seleccionada
            }}
          >
            <Picker.Item label="Filtrar por Carrera" value="" />
            {carreras.map((carrera) => (
              <Picker.Item key={carrera} label={carrera} value={carrera} />
            ))}
          </Picker>

          <Picker
            selectedValue=""
            style={styles.picker}
            onValueChange={(itemValue) => {
              if (itemValue) {
                addSubject(itemValue);
              }
            }}
          >
            <Picker.Item label="Selecciona una Materia" value="" />
            {filteredMaterias.length > 0 ? (
              filteredMaterias.map((materia) => (
                <Picker.Item key={materia} label={materia} value={materia} />
              ))
            ) : (
              <Picker.Item label="No hay materias disponibles" value="" />
            )}
          </Picker>

          <Text style={styles.selectedSubjectsTitle}>Materias Seleccionadas:</Text>
          {selectedSubjects.map((subject) => (
            <Text key={subject} style={styles.selectedSubject}>
              {subject}
            </Text>
          ))}
        </>
      )}

      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    marginRight: 10,
  },
  toggleText: {
    marginLeft: 10,
  },
  selectedSubjectsTitle: {
    fontSize: 18,
    marginTop: 10,
  },
  selectedSubject: {
    fontSize: 16,
    color: 'blue',
  },
});
