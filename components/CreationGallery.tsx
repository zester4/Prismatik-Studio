import React, { ReactElement, useContext, useMemo, useState } from 'react';
import { HistoryContext } from '../context/HistoryContext';
import InteractiveResultCard from './InteractiveResultCard';
import { HistoryItem, HistoryItemImage, HistoryItemLogo, HistoryItemStory, HistoryItemAd, HistoryItemArticle, HistoryItemCampaign, HistoryItemPodcast, HistoryItemTTS } from '../types';

const GallerySection: React.FC<{ title: string; items: HistoryItem[]; onWorkflowAction: (action: string, data: any) => void; }> = ({ title, items, onWorkflowAction }) => {
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
          <InteractiveResultCard key={item.id} item={item} onWorkflowAction={onWorkflowAction} />
        ))}
      </div>
    </div>
  );
};

export default function CreationGallery({ onWorkflowAction }: { onWorkflowAction: (action: string, data: any) => void; }): ReactElement {
  const { historyItems } = useContext(HistoryContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredItems = useMemo(() => {
    return historyItems.filter(item => {
      const typeMatch = filterType === 'all' || item.type === filterType;
      const searchMatch = !searchTerm || item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [historyItems, searchTerm, filterType]);

  const categorizedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, HistoryItem[]>);
  }, [filteredItems]);

  const images = (categorizedItems.image as HistoryItemImage[] || []);
  const videos = (categorizedItems.video || []);
  const stories = (categorizedItems.story as HistoryItemStory[] || []);
  const logos = (categorizedItems.logo as HistoryItemLogo[] || []);
  const ads = (categorizedItems.ad as HistoryItemAd[] || []);
  const articles = (categorizedItems.article as HistoryItemArticle[] || []);
  const campaigns = (categorizedItems.campaign as HistoryItemCampaign[] || []);
  const podcasts = (categorizedItems.podcast as HistoryItemPodcast[] || []);
  const ttsItems = (categorizedItems.tts as HistoryItemTTS[] || []);

  const creationTypes = [...new Set(historyItems.map(item => item.type))];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Creation Gallery</h2>
        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500 text-sm"
          />
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500 text-sm"
          >
            <option value="all">All Types</option>
            {creationTypes.map(type => (
              // FIX: Added type assertion to resolve 'unknown' type error on 'type'.
              <option key={type as string} value={type as string}>{(type as string).charAt(0).toUpperCase() + (type as string).slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {historyItems.length === 0 ? (
        <div className="text-center py-12 px-6 bg-brand-wheat-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-brand-wheat-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-lg sm:text-xl font-medium text-brand-wheat-900">Your gallery is empty</h3>
          <p className="mt-1 text-brand-wheat-600">Start creating, and your work will appear here!</p>
        </div>
      ) : filteredItems.length === 0 ? (
         <div className="text-center py-12 px-6 bg-brand-wheat-50 rounded-lg">
           <h3 className="mt-2 text-lg sm:text-xl font-medium text-brand-wheat-900">No matching creations</h3>
          <p className="mt-1 text-brand-wheat-600">Try adjusting your search or filter.</p>
         </div>
      ) : (
        <div>
          <GallerySection title="Campaigns" items={campaigns} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Advertisements" items={ads} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Articles" items={articles} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Podcasts (Session only)" items={podcasts} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Text-to-Speech (Session only)" items={ttsItems} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Videos (Session only)" items={videos} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Images" items={images} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Stories" items={stories} onWorkflowAction={onWorkflowAction} />
          <GallerySection title="Logos" items={logos} onWorkflowAction={onWorkflowAction} />
        </div>
      )}
    </div>
  );
}