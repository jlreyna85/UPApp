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
          const [userDocUsuarios, userDocDocentes] = await Promise.all([
            getDoc(userDocRefUsuarios),
            getDoc(userDocRefDocentes),
          ]);
          if (userDocUsuarios.exists()) {
            setUserData(userDocUsuarios.data());
          } else if(userDocDocentes.exists()){
            setUserData(userDocDocentes.data());
            console.log('No se encontraron datos de usuario.');
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
