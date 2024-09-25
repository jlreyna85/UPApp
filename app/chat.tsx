import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, orderBy, onSnapshot, getDoc, setDoc, doc, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseconfig';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { RootStackParamList } from './types';

interface Message {
  id: string;
  remitenteNombre: string;
  destinatarioNombre: string; // Asegúrate de incluir esto
  esImagen: boolean;
  mensaje: string;
  timestamp: Date; // Agrega esto si planeas usar el timestamp
}

const Chat = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { tutor, userName } = route.params as { tutor: string; userName: string };
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // Cambia el tipo aquí
  const [conversationId, setConversationId] = useState('');

  useEffect(() => {
    if (tutor && userName) {
      const generatedId = generateConversationId(userName, tutor);
      setConversationId(generatedId);
      loadMessages(generatedId);
    }
  }, [tutor, userName]);

  navigation.setOptions({ title: tutor });

  const generateConversationId = (user1: string, user2: string) => {
    return user1 < user2 ? `${user1}-${user2}` : `${user2}-${user1}`;
  };

  const loadMessages = async (convId: string) => {
    const conversationRef = doc(db, 'mensajes', convId);
    const docSnap = await getDoc(conversationRef);

    if (!docSnap.exists()) {
      await setDoc(conversationRef, { createdAt: new Date() });
      console.log("Documento creado:", convId);
    }

    const messagesRef = collection(db, 'mensajes', convId, 'conversacion');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[]; // Asegúrate de que el tipo sea correcto
      setMessages(messagesList);
    });

    return () => unsubscribe();
  };

  const sendMessage = async () => {
    if (messageText.trim()) {
      const message: Message = {
        id: '', // Puedes generar un ID aquí si es necesario
        remitenteNombre: userName,
        destinatarioNombre: tutor,
        mensaje: messageText,
        timestamp: new Date(),
        esImagen: false,
      };

      await addDoc(collection(db, 'mensajes', conversationId, 'conversacion'), message);
      setMessageText('');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const fileName = uri.substring(uri.lastIndexOf('/') + 1);
      const imageRef = ref(storage, `images/${fileName}`);

      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const message: Message = {
        id: '', // Genera un ID aquí si es necesario
        mensaje: imageUrl,
        remitenteNombre: userName,
        destinatarioNombre: tutor, // Corrige esto
        timestamp: new Date(),
        esImagen: true,
      };

      await addDoc(collection(db, 'mensajes', conversationId, 'conversacion'), message);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={item.remitenteNombre === userName ? styles.sentMessage : styles.receivedMessage}>
            {item.esImagen ? (
              <Image source={{ uri: item.mensaje }} style={styles.imageMessage} />
            ) : (
              <Text>{item.mensaje}</Text>
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Escribe un mensaje"
        />
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Icon name="image" size={20} color="#070707" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Icon name="send" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
  },
  sentMessage: { // Corrige este estilo
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  receivedMessage: { // Corrige este estilo
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  imageMessage: { // Asegúrate de que este estilo esté definido
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    marginLeft: 8,
    alignItems: 'center',
  },
});

export default Chat;
