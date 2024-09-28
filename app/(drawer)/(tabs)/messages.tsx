import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../../firebaseconfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import useUserData from '../../useUserData';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/app/types';
import palette from '@/constants/PaletteColor';

interface Message {
  user: string;
  message: string;
  timestamp: Date;
}

interface ChatWithParams {
  receiver: string;
  userName: string;
}

const MsgScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const userData = useUserData();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  

  useEffect(() => {
    const loadConversationsForUser = (userName: string) => {
      const messagesRef = collection(db, 'mensajes');
  
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const lastMessagesMap: Record<string, Message> = {};
  
        snapshot.docs.forEach((doc) => {
          const conversationId = doc.id;
          const conversationRef = collection(messagesRef, conversationId, 'conversacion');
  
          const allMessagesQuery = query(conversationRef, orderBy('timestamp'));
          const unsubscribeMessages = onSnapshot(allMessagesQuery, (allMessagesSnapshot) => {
            allMessagesSnapshot.docs.forEach(doc => {
              const messageData = doc.data();
              const sender = messageData.remitenteNombre;
              const recipient = messageData.destinatarioId;
  
              // Filtrar mensajes relevantes
              if (sender === userName || recipient === userName) {
                const message: Message = {
                  user: sender === userName ? recipient : sender,
                  message: messageData.mensaje || '[Imagen]',
                  timestamp: messageData.timestamp.toDate(),
                };
  
                if (!lastMessagesMap[message.user] || message.timestamp > lastMessagesMap[message.user].timestamp) {
                  lastMessagesMap[message.user] = message;
                }
              }
            });
  
            const sortedMessages = Object.values(lastMessagesMap).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setMessages(sortedMessages);
            console.log("sort",sortedMessages);
            console.log("last",lastMessagesMap);
            
          });
  
          return () => unsubscribeMessages(); // Limpia la suscripción a los mensajes
        });
      });
  
      return () => unsubscribe(); // Limpia la suscripción principal
    };
  
    if (userData?.nombre) {
      loadConversationsForUser(userData.nombre);
    }
  }, [userData]);

  const handlePress = useCallback((message: Message) => {
    navigation.navigate('chatwith', {
      receiver: message.user,
      userName: userData.nombre,
    } as ChatWithParams);
  }, [navigation, userData]);

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.messageContainer}>
        <Text style={styles.userText}>{item.user}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestampText}>{item.timestamp.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.user}-${item.timestamp.getTime()}`}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 16,
  },
  messageContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF', // Blanco para el contenedor de mensajes
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  userText: {
    fontWeight: 'bold',
    color: palette.primary, // Color primario para el nombre del usuario
  },
  messageText: {
    color: palette.text, // Color del texto del mensaje
  },
  timestampText: {
    fontSize: 10,
    color: palette.link, // Color del timestamp
    marginTop: 4,
  },
});

export default MsgScreen;