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
          title: 'Dashboard',
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
          title: 'Messages',
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

