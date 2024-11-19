import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CardViewProps {
  title: string;
  subtitle: string;
  materia: string;
  tutor: string;
  usuario: string;
}

const CardView: React.FC<CardViewProps> = ({ title, materia, tutor, usuario}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
      {title ?<Text style={styles.title}>{title}</Text> : null}
      {tutor?<Text style={styles.tutor}>Tutor: {tutor}</Text> : null}
      {usuario  ?<Text style={styles.tutor}>Alumno: {usuario}</Text> : null}
      {materia ?<Text style={styles.materia}>Materia: {materia}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,  // Ajusta según el tamaño que prefieras
    height: 100,  // Ajuste de altura basado en el contenido
    margin: 10,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 8,
  },
  content: {
    padding: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  materia: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
  },
  tutor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default CardView;
