// types.ts

// Define your parameter types
export type ChatWithParams = {
  receiver: string;
  userName: string;
};

export type ChatParams = {
  tutor: string;
};

export type RootStackParamList = {
    '(drawer)': { uid: string };
    chatwith: ChatWithParams;
    class_tutor: { nombre: string; materia: string; correo: string; };
    chat: ChatParams;
    index: undefined;
    registro: undefined; // No hay parámetros para esta ruta
    UserList: undefined; // No hay parámetros para esta ruta
    class_sistema: undefined; // Si no recibe parámetros
    class_mat: { materiaSeleccionada: string }; // Ejemplo de parámetros
    // Asegúrate de que todos los parámetros estén bien definidos
  // Agrega más rutas según sea necesario
    // Otras rutas...
  };
  
  // Si estás usando una pila de navegación (Stack Navigator):
  export type StackParamList = {
    Home: undefined; // Por ejemplo, si tienes una pantalla de inicio
    // Otras pantallas...
  };
  