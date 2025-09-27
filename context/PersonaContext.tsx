import React, { createContext, useState, useEffect, useCallback, PropsWithChildren, useMemo } from 'react';
import { Persona } from '../types';
import { DEFAULT_PERSONAS } from '../constants';

interface PersonaContextType {
  personas: Persona[];
  activePersonaId: string;
  activePersona: Persona | undefined;
  setActivePersonaId: (id: string) => void;
  addPersona: (persona: Omit<Persona, 'id'>) => void;
  updatePersona: (persona: Persona) => void;
  deletePersona: (id: string) => void;
}

export const PersonaContext = createContext<PersonaContextType>({
  personas: [],
  activePersonaId: 'default',
  activePersona: undefined,
  setActivePersonaId: () => {},
  addPersona: () => {},
  updatePersona: () => {},
  deletePersona: () => {},
});

export const PersonaProvider = ({ children }: PropsWithChildren<{}>) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string>('default');

  useEffect(() => {
    try {
      const storedPersonas = localStorage.getItem('personas');
      if (storedPersonas) {
        setPersonas(JSON.parse(storedPersonas));
      } else {
        setPersonas(DEFAULT_PERSONAS);
      }

      const storedActiveId = localStorage.getItem('activePersonaId');
      if (storedActiveId) {
        setActivePersonaId(JSON.parse(storedActiveId));
      }
    } catch (error) {
      console.error("Failed to load persona data from localStorage", error);
      setPersonas(DEFAULT_PERSONAS);
    }
  }, []);

  const persistPersonas = (items: Persona[]) => {
    try {
        localStorage.setItem('personas', JSON.stringify(items));
    } catch (error) {
        console.error("Failed to save personas to localStorage", error);
    }
  };
  
  const persistActivePersonaId = (id: string) => {
    try {
        localStorage.setItem('activePersonaId', JSON.stringify(id));
    } catch (error) {
        console.error("Failed to save active persona ID to localStorage", error);
    }
  };

  const handleSetActivePersonaId = useCallback((id: string) => {
    setActivePersonaId(id);
    persistActivePersonaId(id);
  }, []);

  const addPersona = useCallback((personaData: Omit<Persona, 'id'>) => {
    setPersonas(prev => {
      const newPersona = { ...personaData, id: crypto.randomUUID() };
      const newItems = [...prev, newPersona];
      persistPersonas(newItems);
      return newItems;
    });
  }, []);
  
  const updatePersona = useCallback((updatedPersona: Persona) => {
    setPersonas(prev => {
      const newItems = prev.map(p => p.id === updatedPersona.id ? updatedPersona : p);
      persistPersonas(newItems);
      return newItems;
    });
  }, []);
  
  const deletePersona = useCallback((id: string) => {
    setPersonas(prev => {
      const newItems = prev.filter(p => p.id !== id);
      persistPersonas(newItems);
      // If the active persona was deleted, revert to default
      if (activePersonaId === id) {
        handleSetActivePersonaId('default');
      }
      return newItems;
    });
  }, [activePersonaId, handleSetActivePersonaId]);
  
  const activePersona = useMemo(() => personas.find(p => p.id === activePersonaId), [personas, activePersonaId]);


  return (
    <PersonaContext.Provider value={{ 
      personas, 
      activePersonaId, 
      activePersona,
      setActivePersonaId: handleSetActivePersonaId,
      addPersona,
      updatePersona,
      deletePersona 
    }}>
      {children}
    </PersonaContext.Provider>
  );
};