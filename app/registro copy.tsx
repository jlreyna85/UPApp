import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Switch, ActivityIndicator, Picker } from 'react-native';
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
  const [additionalField, setAdditionalField] = useState<string>('');

  // Estados para los datos del picker
  const [cuatrimestres, setCuatrimestres] = useState<string[]>([]);
  const [carreras, setCarreras] = useState<string[]>([]);
  const [materias, setMaterias] = useState<string[]>([]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadCuatrimestres();
    loadCarreras();
    loadMaterias(); // Cargar todas las materias al iniciar
  }, []);

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

  // Nueva función para cargar todas las materias
  const loadMaterias = async () => {
    try {
      const materiasList: string[] = [];
      const querySnapshot = await getDocs(collection(db, 'carrera'));
      for (const document of querySnapshot.docs) {
        const cuatrimestreSnapshot = await getDocs(collection(db, `carrera/${document.id}/cuatrimestre`));
        for (const cuatrimestre of cuatrimestreSnapshot.docs) {
          const materiasData = cuatrimestre.data(); // Obtener datos del cuatrimestre
          for (const key in materiasData) {
            materiasList.push(...materiasData[key].toString().split(',')); // Agregar materias a la lista
          }
        }
      }
      setMaterias(materiasList); // Actualizar el estado de materias
    } catch (error) {
      showAlert('Error', `Error al cargar materias: ${error.message}`);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Guardar datos del usuario en Firestore
      const userData = {
        username,
        name,
        surname,
        email,
        additionalField,
        cuatrimestre,
        isTutor,
        matricula,
      };
      await setDoc(doc(db, 'usuarios', user.uid), userData);

      showAlert('Éxito', 'Usuario registrado exitosamente');
      navigation.navigate('Login'); // Redirigir a la pantalla de inicio de sesión
    } catch (error) {
      showAlert('Error', `Error al registrar usuario: ${error.message}`);
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };
  
  const handleToggleSwitch = () => {
    setIsTutor(previousState => !previousState);
    setAdditionalField(''); // Limpiar el campo adicional al cambiar el tipo de usuario
    if (!isTutor) loadCarreras(); // Cargar carreras solo si no es tutor
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
        onChangeText={setMatricula}/>
      
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
        </>)}
      
      <Picker
        selectedValue={additionalField}
        style={styles.picker}
        onValueChange={(itemValue) => setAdditionalField(itemValue)}
      >
        <Picker.Item label={isTutor ? "Materia(s)" : "Carrera"} value="" />
        {isTutor ? (
          materias.map((materia) => (
            <Picker.Item key={materia} label={materia} value={materia} />
          ))
        ) : (
          carreras.map((carrera) => (
            <Picker.Item key={carrera} label={carrera} value={carrera} />
          ))
          
        )}
      </Picker>
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red', // Borde rojo si hay error
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  toggleText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#007AFF',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  backText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
