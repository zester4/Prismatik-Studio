import React, { ReactElement, useEffect } from 'react';
import { HistoryItemArticle } from '../types';

interface ArticleModalProps {
  article: HistoryItemArticle;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps): ReactElement {
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
        className="relative bg-brand-wheat-100 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-brand-wheat-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-2xl font-bold text-brand-wheat-900">{article.title}</h2>
            <button 
                onClick={onClose} 
                className="bg-brand-wheat-200 text-brand-wheat-800 rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-brand-wheat-300 transition"
                aria-label="Close article view"
            >
            &times;
            </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
            {article.content.map(block => {
                switch (block.type) {
                    case 'heading':
                        return <h3 key={block.id} className="text-xl font-bold text-brand-wheat-800 mt-4">{block.content}</h3>;
                    case 'paragraph':
                        return <p key={block.id} className="text-brand-wheat-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>;
                    case 'image':
                        return (
                            <div key={block.id} className="my-4">
                                <img 
                                    src={block.imageUrl} 
                                    alt={block.imagePrompt} 
                                    className="w-full object-contain rounded-lg shadow-md"
                                />
                                <p className="text-xs text-center text-brand-wheat-600 mt-2 italic">"{block.imagePrompt}"</p>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
      </div>
    </div>
  );
}