import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CardViewProps {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const CardView: React.FC<CardViewProps> = ({ title, subtitle, imageUrl }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 350,  // Ajusta según el tamaño que prefieras
    height: 100,  // Ajuste de altura basado en el contenido
    margin: 10,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 100,  // Ajusta el tamaño de la imagen
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop:-60,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default CardView;
