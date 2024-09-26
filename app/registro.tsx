import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, Picker, ImageBackground } from 'react-native';
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

  const [cuatrimestres, setCuatrimestres] = useState<string[]>([]);
  const [carreras, setCarreras] = useState<string[]>([]);
  const [materias, setMaterias] = useState<string[]>([]);
  const [filteredMaterias, setFilteredMaterias] = useState<string[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const colors = {
    primary: '#4A90E2', // Azul claro
    secondary: '#A8E6CF', // Verde suave
    accent: '#FFA726', // Naranja
    background: '#F5F5F5', // Gris claro
    text: '#424242', // Gris oscuro
    link: '#007AFF', // Azul para enlaces
  };

  useEffect(() => {
    loadCuatrimestres();
    loadCarreras();
  }, []);

  useEffect(() => {
    loadMaterias(filterCarrera);
  }, [filterCarrera]);

  const loadCuatrimestres = () => {
    const cuatrimestresArray = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    setCuatrimestres(cuatrimestresArray);
  };

  const loadCarreras = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'carrera'));
      const carrerasData = querySnapshot.docs.map(doc => doc.data().carrera);
      setCarreras(carrerasData);
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
            if ((carreraFilter ? document.data().carrera === carreraFilter : true)) {
              materiasList.push(...materias);
            }
          }
        }
      }
      
      setMaterias(materiasList);
      setFilteredMaterias(materiasList);
    } catch (error) {
      showAlert('Error', `Error al cargar materias: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const userData = {
        usuario: username,
        nombre: name,
        apellido: surname,
        correo: email,
        type: isTutor ? 'docente' : 'estudiante',
      };
  
      if (isTutor) {
        userData.materias = selectedSubjects;
        await setDoc(doc(db, 'docentes', user.uid), userData);
      } else {
        userData.matricula = matricula;
        userData.cuatrimestre = cuatrimestre;
        await setDoc(doc(db, 'usuarios', user.uid), userData);
      }
  
      showAlert('Éxito', 'Usuario registrado exitosamente');
  
      setUsername('');
      setPassword('');
      setName('');
      setSurname('');
      setEmail('');
      setMatricula('');
      setCuatrimestre('');
      setFilterCarrera('');
      setFilterCuatrimestre('');
      setSelectedSubjects([]);
      
      navigation.navigate('index');
    } catch (error) {
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
    <ImageBackground
      source={{ uri: 'assets/images/fondo-textura-papel-blanco.jpg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title(colors)}>Registro</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel(colors)}>Registrarse como:</Text>
          <Switch
            value={isTutor}
            onValueChange={handleToggleSwitch}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isTutor ? '#f5dd4b' : '#f4f3f4'}
          />
          <Text style={styles.toggleText(colors)}>{isTutor ? 'Tutor' : 'Estudiante'}</Text>
        </View>
        <TextInput
          style={styles.input(colors)}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input(colors)}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input(colors)}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input(colors)}
          placeholder="Apellido"
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          style={styles.input(colors)}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {!isTutor && (
          <>
            <TextInput
              style={styles.input(colors)}
              placeholder="Matrícula"
              value={matricula}
              onChangeText={setMatricula}
            />
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
                setFilterCuatrimestre('');
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
            <Text style={styles.selectedSubjectsTitle(colors)}>Materias Seleccionadas:</Text>
            {selectedSubjects.map((subject) => (
              <Text key={subject} style={styles.selectedSubject(colors)}>
                {subject}
              </Text>
            ))}
          </>
        )}
        <Button title="Registrar" onPress={handleRegister} color={colors.primary} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: (colors) => ({
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
  }),
  input: (colors) => ({
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.secondary,
    color: colors.text,
  }),
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
  toggleLabel: (colors) => ({
    marginRight: 10,
    color: colors.text,
  }),
  toggleText: (colors) => ({
    marginLeft: 10,
    color: colors.text,
  }),
  selectedSubjectsTitle: (colors) => ({
    fontSize: 18,
    marginTop: 10,
    color: colors.text,
  }),
  selectedSubject: (colors) => ({
    fontSize: 16,
    color: colors.link,
  }),
});
