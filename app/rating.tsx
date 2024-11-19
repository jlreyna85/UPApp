import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import { db } from '../firebaseconfig';
import { collection, addDoc } from 'firebase/firestore'; // Import addDoc and collection
import { useRoute } from '@react-navigation/native';
import useUserData from './useUserData';
import palette from '../constants/PaletteColor';

const FinishQuestions = () => {
    const route = useRoute();
    const userData = useUserData();
    const { nombreTutor } = route.params; // Retrieve the tutor's name from params
    const [puntualidad, setPuntualidad] = useState<string | null>(null);
    const [claridad, setClaridad] = useState<string | null>(null);
    const [satisfaccion, setSatisfaccion] = useState<string | null>(null);
    const [recomendacion, setRecomendacion] = useState<string | null>(null);
    
    const opciones = [
        { id: '1', label: 'Mala', value: 1 },
        { id: '2', label: 'Regular', value: 2 },
        { id: '3', label: 'Buena', value: 3 },
        { id: '4', label: 'Muy buena', value: 4 },
    ];

    // Function to calculate the average score
    const calculateAverageScore = () => {
        const scores = [
            puntualidad ? parseInt(puntualidad) : null,
            claridad ? parseInt(claridad) : null,
            satisfaccion ? parseInt(satisfaccion) : null,
            recomendacion ? parseInt(recomendacion) : null,
        ].filter(score => score !== null);

        return scores.length === 0 ? 0 : scores.reduce((a, b) => a + b, 0) / scores.length;
    };

    const handleSubmit = async () => {
        const averageScore = calculateAverageScore();

        if (!puntualidad || !claridad || !satisfaccion || !recomendacion) {
            Alert.alert('Error', 'Por favor, responde todas las preguntas.');
            return;
        }

        if (userData?.nombre) {
            const feedbackData = {
                result: averageScore,
                alumno: userData?.nombre, // Use the user's name
                tutor: nombreTutor, // Use the tutor's name from params
            };

            try {
                // Use addDoc to create a new document with an automatic ID
                await addDoc(collection(db, 'results'), feedbackData);
                Alert.alert('Encuesta enviada', 'Gracias por tu retroalimentación.');
                navigation.navigate('dashboard'); // Ensure navigation is defined
            } catch (error) {
                Alert.alert('Error', 'Hubo un error al guardar tus respuestas.');
            }

            console.log({
                puntualidad,
                claridad,
                satisfaccion,
                recomendacion,
            });
        } else {
            Alert.alert('Error', 'No se pudo obtener la información del usuario.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>Encuesta de Satisfacción</Text>

                <Text style={styles.question}>1.- ¿El tutor fue puntual con las asesorías?</Text>
                <RadioGroup
                    radioButtons={opciones}
                    onPress={setPuntualidad}
                    selectedId={puntualidad}
                    containerStyle={styles.radioGroup} // Añade el estilo de alineación
                />

                <Text style={styles.question}>2.- ¿El tutor fue claro en sus explicaciones?</Text>
                <RadioGroup
                    radioButtons={opciones}
                    onPress={setClaridad}
                    selectedId={claridad}
                    containerStyle={styles.radioGroup} // Añade el estilo de alineación
                />

                <Text style={styles.question}>3.- ¿Qué tan satisfecho está con estas asesorías?</Text>
                <RadioGroup
                    radioButtons={opciones}
                    onPress={setSatisfaccion}
                    selectedId={satisfaccion}
                    containerStyle={styles.radioGroup} // Añade el estilo de alineación
                />

                <Text style={styles.question}>4.- ¿Recomendarías al tutor a otros estudiantes?</Text>
                <RadioGroup
                    radioButtons={opciones}
                    onPress={setRecomendacion}
                    selectedId={recomendacion}
                    containerStyle={styles.radioGroup} // Añade el estilo de alineación
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity> 
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sendButton:{
        backgroundColor: palette.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    sendButtonText:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold', 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        color: '#000',
        marginVertical: 10,
    },
    radioGroup: {
        alignItems: 'flex-start', // Alinea los radio buttons hacia la izquierda
    },
});

export default FinishQuestions;
