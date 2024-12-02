<<<<<<< HEAD
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
    if (!userData?.nombre) return;
    console.log("userdata", userData?.nombre);

    const loadConversationsForUser = (userName: string) => {
      console.log("load for: ", userName)
      const messagesRef = collection(db, 'mensajes');
      const lastMessagesMap: Record<string, Message> = {};

      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          const conversationId = doc.id;
          console.log("conversacion: ",conversationId);
          const conversationRef = collection(messagesRef, conversationId, 'conversacion');
          const allMessagesQuery = query(conversationRef, orderBy('timestamp'));


          onSnapshot(allMessagesQuery, (allMessagesSnapshot) => {
            allMessagesSnapshot.docs.forEach(doc => {
              const messageData = doc.data();
              const sender = messageData.remitenteNombre;
              const recipient = messageData.destinatarioNombre;

          console.log("message: ", messageData);    
          console.log("sender:", sender, "recipient:", recipient, "userName:", userName);


              // Filtrar mensajes relevantes
              if (sender &&(recipient || sender === userName ) ) {
                const message: Message = {
                  user: sender === userName ? recipient : sender,
                  message: messageData.mensaje || '[Imagen]',
                  timestamp: messageData.timestamp.toDate(),
                };
                

                // Actualizar último mensaje por usuario
                if (!lastMessagesMap[message.user] || message.timestamp > lastMessagesMap[message.user].timestamp) {
                  lastMessagesMap[message.user] = message;
                }
              }
            });

            // Actualizar lista de mensajes en el estado
            setMessages(Object.values(lastMessagesMap).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
          });
        });
      });

      return unsubscribe; // Limpia la suscripción
    };

    const unsubscribe = loadConversationsForUser(userData.nombre);
    return () => unsubscribe && unsubscribe();
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
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  userText: {
    fontWeight: 'bold',
    color: palette.primary,
  },
  messageText: {
    color: palette.text,
  },
  timestampText: {
    fontSize: 10,
    color: palette.link,
    marginTop: 4,
  },
});

export default MsgScreen;
=======
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
    if (!userData?.nombre) return;
    console.log("userdata", userData?.nombre);

    const loadConversationsForUser = (userName: string) => {
      console.log("load for: ", userName)
      const messagesRef = collection(db, 'mensajes');
      const lastMessagesMap: Record<string, Message> = {};

      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          const conversationId = doc.id;
          console.log("conversacion: ",conversationId);
          const conversationRef = collection(messagesRef, conversationId, 'conversacion');
          const allMessagesQuery = query(conversationRef, orderBy('timestamp'));


          onSnapshot(allMessagesQuery, (allMessagesSnapshot) => {
            allMessagesSnapshot.docs.forEach(doc => {
              const messageData = doc.data();
              const sender = messageData.remitenteNombre;
              const recipient = messageData.destinatarioNombre;

          console.log("message: ", messageData);    
          console.log("sender:", sender, "recipient:", recipient, "userName:", userName);


              // Filtrar mensajes relevantes
              if (sender &&(recipient || sender === userName ) ) {
                const message: Message = {
                  user: sender === userName ? recipient : sender,
                  message: messageData.mensaje || '[Imagen]',
                  timestamp: messageData.timestamp.toDate(),
                };
                

                // Actualizar último mensaje por usuario
                if (!lastMessagesMap[message.user] || message.timestamp > lastMessagesMap[message.user].timestamp) {
                  lastMessagesMap[message.user] = message;
                }
              }
            });

            // Actualizar lista de mensajes en el estado
            setMessages(Object.values(lastMessagesMap).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
          });
        });
      });

      return unsubscribe; // Limpia la suscripción
    };

    const unsubscribe = loadConversationsForUser(userData.nombre);
    return () => unsubscribe && unsubscribe();
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
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  userText: {
    fontWeight: 'bold',
    color: palette.primary,
  },
  messageText: {
    color: palette.text,
  },
  timestampText: {
    fontSize: 10,
    color: palette.link,
    marginTop: 4,
  },
});

export default MsgScreen;
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
