import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Docente {
  nombre: string;
  materia: string;
  correo: string;
}

interface DocenteContextType {
  docente: Docente | null;
  setDocente: (docente: Docente) => void;
}

const DocenteContext = createContext<DocenteContextType | undefined>(undefined);

export const DocenteProvider = ({ children }: { children: ReactNode }) => {
  const [docente, setDocente] = useState<Docente | null>(null);
  return (
    <DocenteContext.Provider value={{ docente, setDocente }}>
      {children}
    </DocenteContext.Provider>
  );
};

export const useDocente = () => {
  const context = useContext(DocenteContext);
  if (!context) {
    throw new Error('useDocente must be used within a DocenteProvider');
  }
  return context;
};
