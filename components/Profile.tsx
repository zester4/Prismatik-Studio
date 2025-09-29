import React, { ReactElement, useContext, useMemo, useCallback, useState } from 'react';
import { HistoryContext } from '../context/HistoryContext';
import InteractiveResultCard from './InteractiveResultCard';
import { IMAGE_MODELS, IMAGE_STYLES, LOGO_STYLES } from '../constants';
import { HistoryItemImage, HistoryItemLogo, HistoryItem } from '../types';

const StatCard: React.FC<{ icon: ReactElement; label: string; value: number | string }> = ({ icon, label, value }) => (
  <div className="bg-brand-wheat-50 p-4 rounded-lg shadow-sm flex items-center space-x-4">
    <div className="bg-brand-teal-100 text-brand-teal-600 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-brand-wheat-600">{label}</p>
      <p className="text-2xl font-bold text-brand-wheat-900">{value}</p>
    </div>
  </div>
);

const InsightCard: React.FC<{ icon: ReactElement; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="bg-brand-wheat-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
             <div className="text-brand-teal-600">
                {icon}
            </div>
            <p className="text-sm font-semibold text-brand-wheat-600">{label}</p>
        </div>
        <p className="text-lg font-bold text-brand-wheat-900 truncate" title={value}>{value}</p>
    </div>
);


// Icons
const ImageIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const VideoIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
const StoryIco: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const ArticleIco: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const LogoIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
const AdIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);
const CampaignIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);
const StarIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
const ModelIcon: React.FC<{className: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);
const StyleIcon: React.FC<{className: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);


function getMostFrequent(arr: string[]): string {
    if (arr.length === 0) return 'N/A';
    const counts = arr.reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {} as {[key: string]: number});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

export default function Profile(): ReactElement {
  const { historyItems, clearHistory, favoritePrompts } = useContext(HistoryContext);
  const [filter, setFilter] = useState<'all' | 'image' | 'logo'>('all');

  const stats = useMemo(() => {
    return historyItems.reduce((acc, item) => {
      acc.totalCreations += 1;
      if (!acc.types[item.type]) acc.types[item.type] = 0;
      acc.types[item.type]++;
      return acc;
    }, { totalCreations: 0, types: {} as {[key: string]: number} });
  }, [historyItems]);

  const creations = useMemo(() => {
    return historyItems.filter(item => {
        if (filter === 'all') return item.type === 'image' || item.type === 'logo';
        return item.type === filter;
    }) as (HistoryItemImage | HistoryItemLogo)[];
  }, [historyItems, filter]);

  const sortedCreations = useMemo(() => {
    // Return a new sorted array, don't mutate the original
    return [...creations].sort((a: { timestamp: number }, b: { timestamp: number }) => b.timestamp - a.timestamp);
  }, [creations]);

  const insights = useMemo(() => {
      const imageItems = historyItems.filter(item => item.type === 'image') as HistoryItemImage[];
      const logoItems = historyItems.filter(item => item.type === 'logo') as HistoryItemLogo[];

      const allModels = imageItems.map(i => i.model);
      const allImageStyles = imageItems.map(i => i.style);
      const allLogoStyles = logoItems.map(l => l.style);
      
      const favoriteModelId = getMostFrequent(allModels);
      const favoriteModel = IMAGE_MODELS.find(m => m.id === favoriteModelId)?.name || 'N/A';
      
      const favoriteImageStyleId = getMostFrequent(allImageStyles);
      const favoriteImageStyle = IMAGE_STYLES.find(s => s.id === favoriteImageStyleId)?.name || 'N/A';

      const favoriteLogoStyleId = getMostFrequent(allLogoStyles);
      const favoriteLogoStyle = LOGO_STYLES.find(s => s.id === favoriteLogoStyleId)?.name || 'N/A';

      return { favoriteModel, favoriteImageStyle, favoriteLogoStyle };

  }, [historyItems]);

  const handleClearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your entire creation history? This action cannot be undone.")) {
      clearHistory();
    }
  }, [clearHistory]);

  const creationTypes = [
    { type: 'image', count: stats.types.image || 0, icon: <ImageIco className="h-6 w-6" /> },
    { type: 'video', count: stats.types.video || 0, icon: <VideoIco className="h-6 w-6" /> },
    { type: 'story', count: stats.types.story || 0, icon: <StoryIco className="h-6 w-6" /> },
    { type: 'article', count: stats.types.article || 0, icon: <ArticleIco className="h-6 w-6" /> },
    { type: 'logo', count: stats.types.logo || 0, icon: <LogoIco className="h-6 w-6" /> },
    { type: 'ad', count: stats.types.ad || 0, icon: <AdIco className="h-6 w-6" /> },
    { type: 'campaign', count: stats.types.campaign || 0, icon: <CampaignIco className="h-6 w-6" /> },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Your Profile</h2>
            <p className="text-brand-wheat-600 mt-1">A summary of your creative journey in the studio.</p>
        </div>
        <button onClick={handleClearHistory} className="flex-shrink-0 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition px-4 py-2 rounded-lg disabled:opacity-50 self-start sm:self-auto">
          Clear History
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
            icon={<StarIcon className="h-6 w-6" />}
            label="Total Creations"
            value={stats.totalCreations}
        />
        {creationTypes.filter(t => t.count > 0).map(({ type, count, icon }) => (
            <StatCard 
                key={type}
                icon={icon}
                label={`${type.charAt(0).toUpperCase() + type.slice(1)}s`}
                value={count}
            />
        ))}
      </div>

      {/* Insights */}
      {(insights.favoriteModel !== 'N/A' || insights.favoriteImageStyle !== 'N/A' || insights.favoriteLogoStyle !== 'N/A') && (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-brand-wheat-800 mb-4">Your Creative Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {insights.favoriteModel !== 'N/A' && <InsightCard icon={<ModelIcon className="w-6 h-6"/>} label="Favorite Model" value={insights.favoriteModel} />}
               {insights.favoriteImageStyle !== 'N/A' && <InsightCard icon={<StyleIcon className="w-6 h-6"/>} label="Favorite Image Style" value={insights.favoriteImageStyle} />}
               {insights.favoriteLogoStyle !== 'N/A' && <InsightCard icon={<LogoIco className="w-6 h-6"/>} label="Favorite Logo Style" value={insights.favoriteLogoStyle} />}
            </div>
        </div>
      )}

      {/* Recent Creations */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-xl font-bold text-brand-wheat-800">Recent Images & Logos</h3>
            <div className="flex gap-2 p-1 bg-brand-wheat-100 rounded-lg self-start sm:self-center">
                 <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm font-semibold rounded-md ${filter === 'all' ? 'bg-white shadow' : ''}`}>All</button>
                 <button onClick={() => setFilter('image')} className={`px-3 py-1 text-sm font-semibold rounded-md ${filter === 'image' ? 'bg-white shadow' : ''}`}>Images</button>
                 <button onClick={() => setFilter('logo')} className={`px-3 py-1 text-sm font-semibold rounded-md ${filter === 'logo' ? 'bg-white shadow' : ''}`}>Logos</button>
            </div>
        </div>
        {sortedCreations.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sortedCreations.slice(0, 10).map((item) => (
                    <InteractiveResultCard key={item.id} item={item} />
                ))}
             </div>
        ) : (
            <p className="text-brand-wheat-600 text-center py-8">No images or logos created yet.</p>
        )}
      </div>

       {/* Favorite Prompts */}
      <div className="mt-8">
         <h3 className="text-xl font-bold text-brand-wheat-800 mb-4">Favorite Prompts ({favoritePrompts.length})</h3>
         {favoritePrompts.length > 0 ? (
             <div className="space-y-2">
                {favoritePrompts.map((prompt, i) => (
                     <div key={i} className="bg-brand-wheat-50 p-3 rounded-lg flex justify-between items-center text-sm">
                        <p className="text-brand-wheat-800 truncate pr-4" title={prompt}>{prompt}</p>
                     </div>
                ))}
             </div>
         ) : (
              <p className="text-brand-wheat-600 text-center py-8">You haven't favorited any prompts yet.</p>
         )}
      </div>
    </div>
  );
}
