<<<<<<< HEAD
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Importa el servicio de Storage
import { firebaseConfig } from './firebase-config'; // Asegúrate de que esta ruta sea correcta

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
=======
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Importa el servicio de Storage
import { firebaseConfig } from './firebase-config'; // Asegúrate de que esta ruta sea correcta

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
