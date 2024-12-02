<<<<<<< HEAD
// MessageContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Message {
  user: string;
  message: string;
  timestamp: Date;
}

interface MessageContextType {
  sortedMessages: Message[];
  lastMessagesMap: { [key: string]: Message };
  addMessage: (newMessage: Message) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessagesMap, setLastMessagesMap] = useState<{ [key: string]: Message }>({});

  const addMessage = (newMessage: Message) => {
    const { user } = newMessage;
  
    setLastMessagesMap(prev => ({
      ...prev,
      [user]: newMessage,
    }));
  
    const updatedMessages = [...messages, newMessage];
    const uniqueUsers = [...new Set(updatedMessages.map(msg => msg.user))];
  
    const sortedMessages = uniqueUsers.map(user => 
      updatedMessages.filter(msg => msg.user === user).pop()
    ).filter((msg): msg is Message => msg !== undefined);
  
    setMessages(sortedMessages);
  };
 

  return (
    <MessageContext.Provider value={{ sortedMessages: messages, lastMessagesMap, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
=======
// MessageContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Message {
  user: string;
  message: string;
  timestamp: Date;
}

interface MessageContextType {
  sortedMessages: Message[];
  lastMessagesMap: { [key: string]: Message };
  addMessage: (newMessage: Message) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessagesMap, setLastMessagesMap] = useState<{ [key: string]: Message }>({});

  const addMessage = (newMessage: Message) => {
    const { user } = newMessage;
  
    setLastMessagesMap(prev => ({
      ...prev,
      [user]: newMessage,
    }));
  
    const updatedMessages = [...messages, newMessage];
    const uniqueUsers = [...new Set(updatedMessages.map(msg => msg.user))];
  
    const sortedMessages = uniqueUsers.map(user => 
      updatedMessages.filter(msg => msg.user === user).pop()
    ).filter((msg): msg is Message => msg !== undefined);
  
    setMessages(sortedMessages);
  };
 

  return (
    <MessageContext.Provider value={{ sortedMessages: messages, lastMessagesMap, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
};