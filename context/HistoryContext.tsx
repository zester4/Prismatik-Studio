import React, { createContext, useState, useEffect, useCallback, PropsWithChildren } from 'react';
import { HistoryItem } from '../types';

interface HistoryContextType {
  historyItems: HistoryItem[];
  addHistoryItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  favoritePrompts: string[];
  addFavoritePrompt: (prompt: string) => void;
  removeFavoritePrompt: (prompt: string) => void;
}

export const HistoryContext = createContext<HistoryContextType>({
  historyItems: [],
  addHistoryItem: () => {},
  clearHistory: () => {},
  favoritePrompts: [],
  addFavoritePrompt: () => {},
  removeFavoritePrompt: () => {},
});

export const HistoryProvider = ({ children }: PropsWithChildren<{}>) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('creationHistory');
      if (storedItems) {
        const parsedItems: HistoryItem[] = JSON.parse(storedItems);
        // Filter out items with non-persistent blob URLs
        const validItems = parsedItems.filter(item => 
            item.type !== 'video' && 
            !(item.type === 'ad' && item.adType === 'video') &&
            item.type !== 'campaign'
        );
        setHistoryItems(validItems);
      }
      const storedFavorites = localStorage.getItem('favoritePrompts');
      if (storedFavorites) {
        setFavoritePrompts(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const persistHistory = (items: HistoryItem[]) => {
    try {
        // Only persist items whose media URLs are not temporary blobs
        const itemsToStore = items.filter(item => 
            item.type !== 'video' && 
            !(item.type === 'ad' && item.adType === 'video') &&
            item.type !== 'campaign'
        );
        localStorage.setItem('creationHistory', JSON.stringify(itemsToStore));
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
    }
  };
  
  const persistFavorites = (prompts: string[]) => {
    try {
        localStorage.setItem('favoritePrompts', JSON.stringify(prompts));
    } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
    }
  };

  const addHistoryItem = useCallback((item: HistoryItem) => {
    setHistoryItems(prevItems => {
      const newItems = [item, ...prevItems];
      persistHistory(newItems);
      return newItems;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
    try {
        localStorage.removeItem('creationHistory');
    } catch (error) {
        console.error("Failed to clear history from localStorage", error);
    }
  }, []);

  const addFavoritePrompt = useCallback((prompt: string) => {
    setFavoritePrompts(prev => {
        const newFavorites = [...new Set([prompt, ...prev])];
        persistFavorites(newFavorites);
        return newFavorites;
    });
  }, []);

  const removeFavoritePrompt = useCallback((prompt: string) => {
    setFavoritePrompts(prev => {
        const newFavorites = prev.filter(p => p !== prompt);
        persistFavorites(newFavorites);
        return newFavorites;
    });
  }, []);


  return (
    <HistoryContext.Provider value={{ historyItems, addHistoryItem, clearHistory, favoritePrompts, addFavoritePrompt, removeFavoritePrompt }}>
      {children}
    </HistoryContext.Provider>
  );
};