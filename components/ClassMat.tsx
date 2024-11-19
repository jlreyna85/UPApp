import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  materiaSeleccionada: string;
}

const ClassMat = () => {
  const route = useRoute();
  const { materiaSeleccionada } = route.params as RouteParams;;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Materia Seleccionada: {materiaSeleccionada}</Text>
      {/* Aquí puedes agregar más contenido relacionado con la materia */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default ClassMat;
