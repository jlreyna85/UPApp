<<<<<<< HEAD
// useUserData.ts
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useUser } from './UserContext';

const useUserData = () => {
  const [userData, setUserData] = useState<any>(null);
  const { uid } = useUser();

  useEffect(() => {
    const loadUserData = async () => {
      if (uid) {
        try {
          // Referencias a documentos en ambas colecciones
          const userDocRefUsuarios = doc(db, 'usuarios', uid);
          const userDocRefDocentes = doc(db, 'docentes', uid);
          const userDocRefWorkers = doc(db, 'workers', uid);
          const [userDocUsuarios, userDocDocentes, userDocWorkers] = await Promise.all([
            getDoc(userDocRefUsuarios),
            getDoc(userDocRefDocentes),
            getDoc(userDocRefWorkers),
          ]);
          if (userDocUsuarios.exists()) {
            setUserData(userDocUsuarios.data());
          } else if(userDocDocentes.exists()){
            setUserData(userDocDocentes.data());
            console.log('No se encontraron datos de usuario.');
          }
          else if (userDocWorkers.exists()) {
            setUserData(userDocWorkers.data());
          }
    
        } catch (error) {
          console.error('Error al cargar los datos del usuario:', error);
        }
      } else {
        console.log('UID no disponible.');
      }
    };

    loadUserData();
  }, [uid]);

  return userData;
};

export default useUserData;
=======
// useUserData.ts
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useUser } from './UserContext';

const useUserData = () => {
  const [userData, setUserData] = useState<any>(null);
  const { uid } = useUser();

  useEffect(() => {
    const loadUserData = async () => {
      if (uid) {
        try {
          // Referencias a documentos en ambas colecciones
          const userDocRefUsuarios = doc(db, 'usuarios', uid);
          const userDocRefDocentes = doc(db, 'docentes', uid);
          const userDocRefWorkers = doc(db, 'workers', uid);
          const [userDocUsuarios, userDocDocentes, userDocWorkers] = await Promise.all([
            getDoc(userDocRefUsuarios),
            getDoc(userDocRefDocentes),
            getDoc(userDocRefWorkers),
          ]);
          if (userDocUsuarios.exists()) {
            setUserData(userDocUsuarios.data());
          } else if(userDocDocentes.exists()){
            setUserData(userDocDocentes.data());
            console.log('No se encontraron datos de usuario.');
          }
          else if (userDocWorkers.exists()) {
            setUserData(userDocWorkers.data());
          }
    
        } catch (error) {
          console.error('Error al cargar los datos del usuario:', error);
        }
      } else {
        console.log('UID no disponible.');
      }
    };

    loadUserData();
  }, [uid]);

  return userData;
};

export default useUserData;
>>>>>>> 710010d346bc48bb2cae98df00d5a56031624116
