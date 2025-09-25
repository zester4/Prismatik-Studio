import React, { ReactElement, useContext, useMemo } from 'react';
import { HistoryContext } from '../context/HistoryContext';
import InteractiveResultCard from './InteractiveResultCard';
import { HistoryItem, HistoryItemImage, HistoryItemLogo, HistoryItemStory, HistoryItemAd, HistoryItemArticle } from '../types';

const GallerySection: React.FC<{ title: string; items: HistoryItem[] }> = ({ title, items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <h3 className="text-xl sm:text-2xl font-bold text-brand-wheat-800 pb-2 mb-4 border-b-2 border-brand-wheat-200">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item) => (
          <InteractiveResultCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default function CreationGallery(): ReactElement {
  const { historyItems } = useContext(HistoryContext);

  const categorizedItems = useMemo(() => {
    return historyItems.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, HistoryItem[]>);
  }, [historyItems]);

  const images = (categorizedItems.image as HistoryItemImage[] || []);
  const stories = (categorizedItems.story as HistoryItemStory[] || []);
  const logos = (categorizedItems.logo as HistoryItemLogo[] || []);
  const ads = (categorizedItems.ad as HistoryItemAd[] || []);
  const articles = (categorizedItems.article as HistoryItemArticle[] || []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Creation Gallery</h2>
      </div>

      {historyItems.length === 0 ? (
        <div className="text-center py-12 px-6 bg-brand-wheat-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-brand-wheat-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg sm:text-xl font-medium text-brand-wheat-900">Your gallery is empty</h3>
          <p className="mt-1 text-brand-wheat-600">Start creating, and your work will appear here!</p>
        </div>
      ) : (
        <div>
          <GallerySection title="Advertisements" items={ads} />
          <GallerySection title="Articles" items={articles} />
          <GallerySection title="Images" items={images} />
          <GallerySection title="Stories" items={stories} />
          <GallerySection title="Logos" items={logos} />
        </div>
      )}
    </div>
  );
}