import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { db, storage } from '../firebaseconfig'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { RouteProp, useRoute, useNavigation, NavigationProp } from '@react-navigation/native'; // Importar useNavigation
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importar el ícono que necesitas
import { RootStackParamList } from './types';

interface Message {
  mensaje: string;
  remitenteNombre: string;
  destinatarioId: string;
  timestamp: Date; // Asegúrate que es un objeto Date
  esImagen?: boolean;
}

const ChatWith: React.FC = () => {
  const route = useRoute<RouteProp<{ params: { receiver: string; userName: string } }>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { receiver, userName } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    console.log("userName:", userName, "receiver:", receiver);  // Verifica los valores

    // Establecer el título de la pantalla con el nombre del receptor
    navigation.setOptions({ title: receiver });  // Mostrar el nombre del destinatario en la barra superior

    const conversationId = generateConversationId(userName, receiver);
    const messagesRef = collection(db, 'mensajes', conversationId, 'conversacion');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        loadedMessages.push({ ...doc.data(), timestamp: doc.data().timestamp.toDate() } as Message);
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [userName, receiver]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const conversationId = generateConversationId(userName, receiver);
    console.log("Sending message from:", userName, "to:", receiver);

    const message: Message = {
      mensaje: newMessage,
      remitenteNombre: userName,
      destinatarioId: receiver,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, 'mensajes', conversationId, 'conversacion'), message);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
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
      const conversationId = generateConversationId(userName, receiver);
      const fileName = uri.substring(uri.lastIndexOf('/') + 1);
      const imageRef = ref(storage, `images/${fileName}`);

      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      console.log("Image uploaded:", imageUrl);  // Verifica que la URL es válida

      const message: Message = {
        mensaje: imageUrl,
        remitenteNombre: userName,
        destinatarioId: receiver,
        timestamp: new Date(),
        esImagen: true,
      };

      await addDoc(collection(db, 'mensajes', conversationId, 'conversacion'), message);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.remitenteNombre === userName ? styles.sent : styles.received]}>
      {item.esImagen ? (
        <TouchableOpacity>
          <Image source={{ uri: item.mensaje }} style={styles.image} />
        </TouchableOpacity>
      ) : (
        <Text style={styles.messageText}>{item.mensaje}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp.getTime().toString()}  // Usa getTime() para evitar problemas con el timestamp
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
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

// Generar el ID único de conversación basado en los nombres de los usuarios
const generateConversationId = (user1: string, user2: string) => {
  return user1 < user2 ? `${user1}-${user2}` : `${user2}-${user1}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'white',
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
  messageContainer: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    maxWidth: '70%',
  },
  sent: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#555',
  },
  image: {
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

export default ChatWith;
