// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, type ComponentProps } from 'react';
import 'react-native-reanimated';
import { UserProvider } from './UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DocenteProvider } from './DocenteContext';
import { MessageProvider } from './MessageContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <UserProvider>
    <MessageProvider>
    <DocenteProvider>
    
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme} >
      <Stack>
        <Stack.Screen name="index"options={{headerShown: false, title: 'Home',}}/>
        <Stack.Screen name="homes"options={{headerShown: false}}/>
        <Stack.Screen name="RegistroScreen" options={{ headerShown: false}} />
        <Stack.Screen name="(drawer)" options={{headerShown: false}}/>
        <Stack.Screen name="class_sistema" options={{headerShown: true, title:"Materias"}}/>
        <Stack.Screen name="class_mat"options={{headerShown: true, title:"Tutores"}}/>
        <Stack.Screen name="class_tutor"options={{headerShown: true, title:"Tutor"}}/>
        <Stack.Screen name="chat"options={{headerShown: true, title:"Mensajes"}}/>
        <Stack.Screen name="chatwith"options={{headerShown: true, title:"Mensajes"}}/>
        <Stack.Screen name="rating"options={{headerShown: true, title:"Encuesta"}}/>

      </Stack>
    </ThemeProvider>
    </DocenteProvider>
    </MessageProvider>
    </UserProvider>
    
  );
}
