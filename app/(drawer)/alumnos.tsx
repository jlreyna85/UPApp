import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Alumnos = () => {
  return (
    <View style={styles.container}>
      <Text>Alumnos Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Alumnos;
