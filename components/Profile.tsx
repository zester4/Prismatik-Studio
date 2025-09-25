import React, { ReactElement, useContext, useMemo, useCallback, useState } from 'react';
import { HistoryContext } from '../context/HistoryContext';
import InteractiveResultCard from './InteractiveResultCard';
import { IMAGE_MODELS, IMAGE_STYLES, LOGO_STYLES } from '../constants';
import { HistoryItemImage, HistoryItemLogo } from '../types';

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584M9 18l-3.362-3.362" />
    </svg>
);
const ModelIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293M17.707 5.293L19 4m-3 13l-2.293 2.293m2.293-2.293L19 18M12 3v4m-2 2h4m-4 7v4m-2-2h4m5-11l2.293-2.293M12 12l2.293 2.293m-2.293-2.293L9.707 9.707m2.293 2.293L14.293 14.293" />
    </svg>
);
const StyleIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
);
const FlameIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0112 2c2.21 0 4.21.896 5.657 2.343A8 8 0 0117.657 18.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12.5c-1.25-1.5-2.5-4-2.5-6 0-1.383.54-2.633 1.414-3.586" />
    </svg>
);
const LinkIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const allStyles = [...IMAGE_STYLES, ...LOGO_STYLES];
const allModels = [...IMAGE_MODELS];

export default function Profile(): ReactElement {
  const { historyItems, clearHistory, favoritePrompts, removeFavoritePrompt } = useContext(HistoryContext);
  const [copiedPrompt, setCopiedPrompt] = useState<string>('');

  const { stats, creativeStreak } = useMemo(() => {
    const counts = {
      image: 0,
      video: 0,
      story: 0,
      logo: 0,
      ad: 0,
      article: 0,
    };

    for (const item of historyItems) {
      if (item && item.type && item.type in counts) {
        counts[item.type as keyof typeof counts]++;
      }
    }
    
    let streak = 0;
    if (historyItems.length > 0) {
        const oneDay = 24 * 60 * 60 * 1000;
        // Add explicit types to sort callback to fix arithmetic operation error.
        const uniqueDays = [...new Set(historyItems.map(item => new Date(item.timestamp).setHours(0, 0, 0, 0)))].sort((a: number, b: number) => b - a);

        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (uniqueDays[0] === today || uniqueDays[0] === yesterday.getTime()) {
            streak = 1;
            for (let i = 0; i < uniqueDays.length - 1; i++) {
                if (uniqueDays[i] - uniqueDays[i+1] === oneDay) {
                    streak++;
                } else {
                    break;
                }
            }
        }
    }

    return { stats: { total: historyItems.length, ...counts }, creativeStreak: streak };
  }, [historyItems]);

  const insights = useMemo(() => {
    const modelCounts: { [key: string]: number } = {};
    const styleCounts: { [key: string]: number } = {};
    const imageItems = historyItems.filter(item => item.type === 'image' || item.type === 'logo') as (HistoryItemImage | HistoryItemLogo)[];

    imageItems.forEach(item => {
        if (item.model) modelCounts[item.model] = (modelCounts[item.model] || 0) + 1;
        if (item.style && item.style !== 'none') styleCounts[item.style] = (styleCounts[item.style] || 0) + 1;
    });

    const getTopItem = (counts: { [key: string]: number }) => Object.keys(counts).length > 0
        ? Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : null;

    const favoriteModelId = getTopItem(modelCounts);
    const favoriteStyleId = getTopItem(styleCounts);
    
    const favoriteModel = favoriteModelId ? allModels.find(m => m.id === favoriteModelId)?.name || favoriteModelId : 'N/A';
    const favoriteStyle = favoriteStyleId ? allStyles.find(s => s.id === favoriteStyleId)?.name || favoriteStyleId : 'N/A';

    return { favoriteModel, favoriteStyle };
  }, [historyItems]);

  const recentItems = useMemo(() => historyItems.slice(0, 4), [historyItems]);
  
  const handleCopyFavoritePrompt = useCallback((prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(''), 2000);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to permanently delete your entire creation history? This action cannot be undone.")) {
      clearHistory();
    }
  }, [clearHistory]);
  
  const handleExportHistory = useCallback(() => {
    const dataStr = JSON.stringify(historyItems.filter(i => i.type !== 'video'), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'creative_studio_history.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [historyItems]);

  if (historyItems.length === 0) {
     return (
        <div className="text-center py-12 px-6 bg-brand-wheat-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-brand-wheat-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-lg sm:text-xl font-medium text-brand-wheat-900">No Activity Yet</h3>
          <p className="mt-1 text-brand-wheat-600">Start creating, and your Creator Hub will appear here!</p>
        </div>
      );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900 mb-4">Creator Hub</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={<FlameIco className="h-6 w-6" />} label="Creative Streak" value={`${creativeStreak} Day${creativeStreak !== 1 ? 's' : ''}`} />
            <StatCard icon={<ImageIco className="h-6 w-6" />} label="Images Generated" value={stats.image} />
            <StatCard icon={<VideoIco className="h-6 w-6" />} label="Videos (Session)" value={stats.video} />
            <StatCard icon={<StoryIco className="h-6 w-6" />} label="Stories Written" value={stats.story} />
            <StatCard icon={<ArticleIco className="h-6 w-6" />} label="Articles Written" value={stats.article} />
            <StatCard icon={<LogoIco className="h-6 w-6" />} label="Logos Designed" value={stats.logo} />
            <StatCard icon={<AdIco className="h-6 w-6" />} label="Ads Created" value={stats.ad} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-brand-wheat-800">Creative Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard icon={<ModelIco className="h-6 w-6" />} label="Your Favorite Model" value={insights.favoriteModel} />
            <InsightCard icon={<StyleIco className="h-6 w-6" />} label="Your Go-To Style" value={insights.favoriteStyle} />
        </div>
      </div>
      
      {favoritePrompts.length > 0 && (
         <div>
            <h3 className="text-xl font-semibold mb-4 text-brand-wheat-800">Favorite Prompts</h3>
            <div className="bg-brand-wheat-50 border border-brand-wheat-200 rounded-lg p-4">
                <ul className="space-y-3">
                    {favoritePrompts.slice(0, 5).map((prompt, index) => (
                        <li key={index} className="flex items-start justify-between gap-2 p-2 rounded-md hover:bg-brand-wheat-100">
                            <p className="text-sm text-brand-wheat-800 flex-grow">"{prompt}"</p>
                            <div className="flex-shrink-0 flex gap-2">
                                <button onClick={() => handleCopyFavoritePrompt(prompt)} className="text-xs font-semibold text-brand-teal-600 hover:text-brand-teal-800 transition">{copiedPrompt === prompt ? 'Copied!' : 'Copy'}</button>
                                <button onClick={() => removeFavoritePrompt(prompt)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition">Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
      
      {recentItems.length > 0 && (
         <div>
            <h3 className="text-xl font-semibold mb-4 text-brand-wheat-800">Recent Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recentItems.map(item => (
                    <InteractiveResultCard key={item.id} item={item} />
                ))}
            </div>
        </div>
      )}

       <div>
        <h3 className="text-xl font-semibold mb-4 text-brand-wheat-800">Resource Hub</h3>
        <div className="bg-brand-wheat-50 border border-brand-wheat-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a href="https://ai.google.dev/docs/prompt_best_practices" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-brand-teal-100 text-brand-teal-600 p-2 rounded-full"><LinkIco className="h-5 w-5"/></div>
            <span className="font-semibold text-brand-wheat-800 text-sm">Prompting Best Practices</span>
          </a>
          <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-brand-teal-100 text-brand-teal-600 p-2 rounded-full"><LinkIco className="h-5 w-5"/></div>
            <span className="font-semibold text-brand-wheat-800 text-sm">Image Inspiration</span>
          </a>
           <a href="https://ai.google.dev/docs/gemini_api_overview" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-brand-teal-100 text-brand-teal-600 p-2 rounded-full"><LinkIco className="h-5 w-5"/></div>
            <span className="font-semibold text-brand-wheat-800 text-sm">Gemini API Docs</span>
          </a>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-brand-wheat-800">Data Management</h3>
        <div className="bg-brand-wheat-50 border border-brand-wheat-200 rounded-lg p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h4 className="font-bold text-brand-wheat-800">Export History</h4>
                    <p className="text-sm text-brand-wheat-700 mt-1">Download all your persistent creation data as a JSON file.</p>
                </div>
                 <button 
                    onClick={handleExportHistory}
                    className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 bg-brand-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300"
                >
                    Export Data
                </button>
            </div>
             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="font-bold text-red-800">Clear Creation History</h4>
                        <p className="text-sm text-red-700 mt-1">Permanently delete all saved creations. This cannot be undone.</p>
                    </div>
                    <button 
                        onClick={handleClearHistory}
                        className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Clear History
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}