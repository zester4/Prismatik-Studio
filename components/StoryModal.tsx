import React, { ReactElement, useEffect } from 'react';
import { StoryScene } from '../types';

interface StoryModalProps {
  scenes: StoryScene[];
  onClose: () => void;
}

export default function StoryModal({ scenes, onClose }: StoryModalProps): ReactElement {
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative bg-brand-wheat-100 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-brand-wheat-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-wheat-900">Story</h2>
            <button 
                onClick={onClose} 
                className="bg-brand-wheat-200 text-brand-wheat-800 rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-brand-wheat-300 transition"
                aria-label="Close story view"
            >
            &times;
            </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-6">
            {scenes.map((scene, index) => (
                <div key={index} className="space-y-3">
                    <img 
                        src={scene.imageUrl} 
                        alt={`Scene ${index + 1}`} 
                        className="w-full object-contain rounded-lg shadow-md"
                    />
                    <p className="text-brand-wheat-700 bg-brand-wheat-50 p-3 rounded-md">{scene.text}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
