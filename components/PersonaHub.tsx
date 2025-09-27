import React, { ReactElement, useEffect, useContext, useState, useCallback } from 'react';
import { PersonaContext } from '../context/PersonaContext';
import { Persona, PersonaIconName } from '../types';
import { PERSONA_ICONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface PersonaHubProps {
  onClose: () => void;
}

const PersonaForm: React.FC<{
    persona?: Persona | null;
    onSave: (personaData: Omit<Persona, 'id'>) => void;
    onCancel: () => void;
}> = ({ persona, onSave, onCancel }) => {
    const [name, setName] = useState(persona?.name || '');
    const [description, setDescription] = useState(persona?.description || '');
    const [icon, setIcon] = useState<PersonaIconName>(persona?.icon || 'general');
    const [systemInstruction, setSystemInstruction] = useState(persona?.systemInstruction || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, icon, systemInstruction });
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-brand-wheat-50 h-full overflow-y-auto">
            <h3 className="text-xl font-bold text-brand-wheat-900">{persona ? 'Edit Persona' : 'Create New Persona'}</h3>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-wheat-800">Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-white border border-brand-wheat-200 rounded-md" />
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-brand-wheat-800">Description</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-white border border-brand-wheat-200 rounded-md" />
            </div>
             <div>
                <label className="block text-sm font-medium text-brand-wheat-800 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(PERSONA_ICONS).map(iconName => {
                        const IconComponent = PERSONA_ICONS[iconName as PersonaIconName];
                        const isSelected = icon === iconName;
                        return (
                            <button key={iconName} type="button" onClick={() => setIcon(iconName as PersonaIconName)} className={`p-3 rounded-lg border-2 ${isSelected ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-brand-wheat-200 bg-white'}`}>
                                <IconComponent className="w-6 h-6 text-brand-wheat-800" />
                            </button>
                        )
                    })}
                </div>
            </div>
            <div>
                <label htmlFor="systemInstruction" className="block text-sm font-medium text-brand-wheat-800">System Instruction</label>
                <p className="text-xs text-brand-wheat-600 mb-1">Define the AI's role, tone, and expertise. This will guide its responses across all generators.</p>
                <textarea id="systemInstruction" value={systemInstruction} onChange={e => setSystemInstruction(e.target.value)} rows={8} className="mt-1 w-full px-3 py-2 bg-white border border-brand-wheat-200 rounded-md resize-y" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-brand-wheat-800 bg-brand-wheat-100 hover:bg-brand-wheat-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-brand-teal-500 hover:bg-brand-teal-600 rounded-md">Save Persona</button>
            </div>
        </form>
    );
}

export default function PersonaHub({ onClose }: PersonaHubProps): ReactElement {
  const { personas, activePersonaId, setActivePersonaId, addPersona, updatePersona, deletePersona } = useContext(PersonaContext);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleSave = (personaData: Omit<Persona, 'id'>) => {
    if (view === 'edit' && selectedPersona) {
        updatePersona({ ...personaData, id: selectedPersona.id });
    } else {
        addPersona(personaData);
    }
    setView('list');
    setSelectedPersona(null);
  };
  
  const handleDelete = (id: string) => {
      if (id === 'default') return; // Prevent deleting default
      if (window.confirm("Are you sure you want to delete this persona?")) {
          deletePersona(id);
      }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-brand-wheat-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-2xl font-bold text-brand-wheat-900">Persona Hub</h2>
            <button 
                onClick={onClose} 
                className="bg-brand-wheat-200 text-brand-wheat-800 rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-brand-wheat-300 transition"
                aria-label="Close Persona Hub"
            >
            &times;
            </button>
        </div>
        
        {view === 'list' ? (
             <div className="flex-grow overflow-y-auto">
                <div className="p-6 space-y-3">
                {personas.map(persona => {
                    const IconComponent = PERSONA_ICONS[persona.icon];
                    const isActive = persona.id === activePersonaId;
                    return (
                        <div key={persona.id} className={`p-4 rounded-lg border-2 flex items-start gap-4 transition-colors ${isActive ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-brand-wheat-200'}`}>
                           <div className="bg-brand-wheat-100 p-3 rounded-lg mt-1">
                             <IconComponent className="w-6 h-6 text-brand-wheat-800" />
                           </div>
                           <div className="flex-grow">
                                <p className="font-bold text-brand-wheat-900">{persona.name}</p>
                                <p className="text-sm text-brand-wheat-700">{persona.description}</p>
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => setActivePersonaId(persona.id)} disabled={isActive} className="px-3 py-1 text-xs font-semibold text-white bg-brand-teal-500 hover:bg-brand-teal-600 rounded-md disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
                                        {isActive ? 'Active' : 'Set Active'}
                                    </button>
                                     {persona.id !== 'default' && (
                                        <>
                                            <button onClick={() => { setSelectedPersona(persona); setView('edit'); }} className="px-3 py-1 text-xs font-semibold text-brand-wheat-800 bg-brand-wheat-100 hover:bg-brand-wheat-200 rounded-md">Edit</button>
                                            <button onClick={() => handleDelete(persona.id)} className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-md">Delete</button>
                                        </>
                                     )}
                                </div>
                           </div>
                        </div>
                    );
                })}
                </div>
                <div className="p-6 border-t border-brand-wheat-200">
                    <button onClick={() => setView('create')} className="w-full bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300">
                        Create New Persona
                    </button>
                </div>
             </div>
        ) : (
            <PersonaForm
                persona={selectedPersona}
                onSave={handleSave}
                onCancel={() => { setView('list'); setSelectedPersona(null); }}
            />
        )}
      </div>
    </div>
  );
}