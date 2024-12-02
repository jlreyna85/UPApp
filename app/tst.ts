<<<<<<< HEAD
// tst.ts
import { db } from '../firebaseconfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';

// Define el tipo para los datos del usuario
interface UserData {
  nombre: string;
}

// Función para obtener los nombres de todos los usuarios
export const fetchUserNames = async (): Promise<string[]> => {
  try {
    const usersCollectionRef = collection(db, 'usuarios'); // Refiere a la colección 'usuarios'
    const querySnapshot = await getDocs(usersCollectionRef);

    const userNames: string[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      if (userData.nombre) {
        userNames.push(userData.nombre); // Asume que el campo es 'nombre'
      }
    });

    return userNames;
  } catch (error) {
    console.error('Error fetching user names:', error);
    throw error;
  }
};
=======
// tst.ts
import { db } from '../firebaseconfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';

// Define el tipo para los datos del usuario
interface UserData {
  nombre: string;
}

// Función para obtener los nombres de todos los usuarios
export const fetchUserNames = async (): Promise<string[]> => {
  try {
    const usersCollectionRef = collection(db, 'usuarios'); // Refiere a la colección 'usuarios'
    const querySnapshot = await getDocs(usersCollectionRef);

    const userNames: string[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      if (userData.nombre) {
        userNames.push(userData.nombre); // Asume que el campo es 'nombre'
      }
    });

    return userNames;
  } catch (error) {
    console.error('Error fetching user names:', error);
    throw error;
  }
};
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
