import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, Picker, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebaseconfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import palette from '../../constants/PaletteColor';

const { width } = Dimensions.get('window');

const TableComponent: React.FC = () => {
  const [data, setData] = useState<string[][]>(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [originalData, setOriginalData] = useState<string[][]>(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [carreras, setCarreras] = useState<string[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const fetchCarreras = useCallback(async () => {
    try {
      const carreraRef = collection(db, 'carrera');
      const querySnapshot = await getDocs(carreraRef);
      const carreraList = querySnapshot.docs.map(doc => doc.data().carrera as string);
      setCarreras(carreraList);
    } catch (error) {
      Alert.alert('Error', `Error al cargar carreras: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    fetchCarreras();
  }, [fetchCarreras]);

  const fetchData = useCallback(async (carrera: string) => {
    try {
      const tableData: string[][] = [];
      const carreraQuery = query(collection(db, 'carrera'), where('carrera', '==', carrera));
      const carreraSnapshot = await getDocs(carreraQuery);
  
      if (carreraSnapshot.empty) {
        Alert.alert('Sin datos', 'No hay datos disponibles para esta carrera.');
        return;
      }
  
      const carreraDoc = carreraSnapshot.docs[0];
      const cuatrimestreRef = collection(db, `carrera/${carreraDoc.id}/cuatrimestre`);
      const cuatrimestreDocs = await getDocs(cuatrimestreRef);
  
      cuatrimestreDocs.docs.forEach(doc => {
        const row: string[] = [];
        for (let i = 1; i <= 7; i++) {
          row.push(doc.data()[`mat${i}`] || '');
        }
        tableData.push(row);
      });
  
      while (tableData.length < 9) {
        tableData.push(Array(9).fill(''));
      }
  
      setData(tableData.slice(0, 9));
      setOriginalData(tableData.slice(0, 9));
    } catch (error) {
      Alert.alert('Error', `Error al cargar datos: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    if (selectedCarrera) {
      fetchData(selectedCarrera);
    }
  }, [selectedCarrera, fetchData]);

  const handleInputChange = useCallback((rowIndex: number, cellIndex: number, text: string) => {
    const updatedData = data.map((row, index) => 
      index === rowIndex ? row.map((cell, cIndex) => (cIndex === cellIndex ? text : cell)) : row
    );
    setData(updatedData);
  }, [data]);

  const handleSubmit = async () => {
    try {
      const carreraQuery = query(collection(db, 'carrera'), where('carrera', '==', selectedCarrera));
      const carreraSnapshot = await getDocs(carreraQuery);
  
      if (!carreraSnapshot.empty) {
        const carreraDoc = carreraSnapshot.docs[0];
        for (const [rowIndex, row] of data.entries()) {
          const updates = row.reduce((acc, cell, index) => {
            if (cell) {
              acc[`mat${index + 1}`] = cell;
            }
            return acc;
          }, {});
  
          if (Object.keys(updates).length > 0) {
            const docRef = doc(db, `carrera/${carreraDoc.id}/cuatrimestre`, `c${rowIndex + 1}`);
            await setDoc(docRef, updates, { merge: true });
          }
        }
        Alert.alert('Éxito', 'Datos guardados correctamente');
      }
    } catch (error) {
      Alert.alert('Error', `Error al guardar datos: ${error.message}`);
    }
  };

  const cancelEdit = () => {
    setData(originalData);
    setIsEditable(false);
  };

  const renderRow = ({ item, index }: { item: string[]; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>Cuatrimestre {index + 1}</Text>
      {item.map((cell, cellIndex) => (
        <TextInput
          key={cellIndex}
          style={styles.cell}
          value={cell}
          onChangeText={(text) => handleInputChange(index, cellIndex, text)}
          editable={isEditable}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a el registro de materias</Text>
      <Picker
        selectedValue={selectedCarrera}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCarrera(itemValue)}>
        <Picker.Item label="Selecciona Carrera" value="" />
        {carreras.map((carrera) => (
          <Picker.Item key={carrera} label={carrera} value={carrera} />
        ))}
      </Picker>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => {
          if (isEditable) {
            handleSubmit();
          } else {
            setIsEditable(true);
          }
        }} style={styles.button}>
          <Icon name={isEditable ? "check" : "edit"} size={20} color="#fff" />
          <Text style={styles.buttonText}>{isEditable ? "Guardar" : "Editar"}</Text>
        </TouchableOpacity>
        {isEditable && (
          <TouchableOpacity onPress={cancelEdit} style={styles.button}>
            <Icon name="ban" size={20} color="#fff" />
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal={true}>
        <View>
          <View style={styles.header}>
            <Text style={styles.cell}></Text>
            {[...Array(7)].map((_, i) => (
              <Text key={i} style={styles.cell}>Materia {i + 1}</Text>
            ))}
          </View>

          <FlatList
            data={data}
            renderItem={renderRow}
            keyExtractor={(item, index) => `row-${index}`}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            ListEmptyComponent={<Text>No hay datos para mostrar.</Text>}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: palette.background,
    flex: 1,
  },
  title:{
    fontSize: 48,
    fontWeight: 'bold',
    color: palette.text,
    marginHorizontal: 10,
    marginBottom:10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cell: {
    borderWidth: 1,
    borderColor: palette.text,
    padding: 8,
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#fff',
    width: width * 0.2, // Ajusta el ancho para que el ScrollView tenga sentido
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    borderColor: palette.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom:10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default TableComponent;
