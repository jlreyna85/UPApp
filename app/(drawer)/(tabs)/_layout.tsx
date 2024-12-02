<<<<<<< HEAD
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: { color: 'skyblue', fontSize: 12 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'home' : 'home-outline'} 
            color={focused ? 'skyblue' : color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'chatbubble' : 'chatbubble-outline'} 
            color={focused ? 'skyblue' : color} />
          ),
        }}
      />
    </Tabs>
  );
}

=======
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarLabelStyle: { color: 'skyblue', fontSize: 12 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'home' : 'home-outline'} 
            color={focused ? 'skyblue' : color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
            name={focused ? 'chatbubble' : 'chatbubble-outline'} 
            color={focused ? 'skyblue' : color} />
          ),
        }}
      />
    </Tabs>
  );
}

>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
