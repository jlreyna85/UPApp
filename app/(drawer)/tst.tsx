import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TstScreen = () => {
  return (
    <View style={styles.container}>
      <Text>TST Screen</Text>
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

export default TstScreen;
