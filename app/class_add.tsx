import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, Picker, Button } from 'react-native';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';

const TableComponent: React.FC = () => {
  const [data, setData] = useState<string[][]>(Array.from({ length: 9 }, () => Array(9).fill('')));
  const [carreras, setCarreras] = useState<string[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<string>('');

  const fetchCarreras = useCallback(async () => {
    try {
      const carreraRef = collection(db, 'carrera');
      const querySnapshot = await getDocs(carreraRef);
      const carreraList = querySnapshot.docs.map(doc => doc.data().carrera);
      console.log('Carreras cargadas:', carreraList);
      setCarreras(carreraList);
    } catch (error) {
      Alert.alert('Error', `Error al cargar carreras: ${error.message}`);
      console.error('Error en fetchCarreras:', error);
    }
  }, []);

  useEffect(() => {
    fetchCarreras();
  }, [fetchCarreras]);

  const fetchData = useCallback(async (carrera: string) => {
    try {
      console.log(`Fetching data for carrera: ${carrera}`);
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
  
      if (cuatrimestreDocs.empty) {
        Alert.alert('Sin datos', 'No hay datos disponibles para los cuatrimestres.');
        return;
      }
  
      cuatrimestreDocs.docs.forEach(doc => {
        const row: string[] = [];
        for (let i = 1; i <= 7; i++) {
          row.push(doc.data()[`mat${i}`] || '');  // Cambia `c${i}` a `mat${i}`
        }
        tableData.push(row);
      });
  
      // Asegúrate de llenar las filas restantes si hay menos de 7
      while (tableData.length < 9) {
        tableData.push(Array(9).fill(''));
      }
  
      console.log('Datos cargados:', tableData);
      setData(tableData.slice(0, 9)); // Asigna los datos a `data`
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
    console.log(`Cambios en la fila ${rowIndex + 1}, columna ${cellIndex + 1}: ${text}`);
  }, [data]);

  const handleSubmit = async () => {
    try {
      console.log('Guardando datos:', data);
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
            console.log(`Datos guardados para c${rowIndex + 1}:`, updates);
          }
        }
        Alert.alert('Éxito', 'Datos guardados correctamente');
      }
    } catch (error) {
      Alert.alert('Error', `Error al guardar datos: ${error.message}`);
      console.error('Error en handleSubmit:', error);
    }
  };
  

  const renderRow = ({ item, index }: { item: string[]; index: number }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>c{index + 1}</Text>
      {item.map((cell, cellIndex) => (
        <TextInput
          key={cellIndex}
          style={styles.cell}
          value={cell}
          onChangeText={(text) => handleInputChange(index, cellIndex, text)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCarrera}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setSelectedCarrera(itemValue);
          console.log(`Carrera seleccionada: ${itemValue}`);}}>
        <Picker.Item label="Selecciona Carrera" value="" />
        {carreras.map((carrera) => (
          <Picker.Item key={carrera} label={carrera} value={carrera} />
        ))}
      </Picker>

      <View style={styles.header}>
        <Text style={styles.cell}></Text>
        {[...Array(7)].map((_, i) => (
          <Text key={i} style={styles.cell}>mat{i + 1}</Text>
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
      <Button title="Guardar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
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
    borderColor: '#000',
    padding: 8,
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#fff',
    height: 60,
    
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

export default TableComponent;
