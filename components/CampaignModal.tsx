import React, { ReactElement, useEffect, useCallback } from 'react';
import { HistoryItemCampaign, AdCopy } from '../types';

interface CampaignModalProps {
  campaign: HistoryItemCampaign;
  onClose: () => void;
}

export default function CampaignModal({ campaign, onClose }: CampaignModalProps): ReactElement {
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

   const handleDownload = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative bg-brand-wheat-100 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-brand-wheat-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-2xl font-bold text-brand-wheat-900">Campaign: {campaign.brandIdentity.companyName}</h2>
            <button 
                onClick={onClose} 
                className="bg-brand-wheat-200 text-brand-wheat-800 rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-brand-wheat-300 transition"
                aria-label="Close campaign view"
            >
            &times;
            </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-8">
            {/* Brand Identity */}
            <div className="bg-white p-6 rounded-xl">
                <h4 className="text-xl font-bold text-brand-wheat-800 mb-4">Brand Identity</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600">Colors</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {campaign.brandIdentity.colors.map((color, i) => (
                             <span key={i} className="text-xs font-medium bg-brand-wheat-50 border border-brand-wheat-200 text-brand-wheat-800 px-2 py-1 rounded-full">{color}</span>
                           ))}
                        </div>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-brand-wheat-600">Mood</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {campaign.brandIdentity.mood.map((m, i) => (
                             <span key={i} className="text-xs font-medium bg-brand-wheat-50 border border-brand-wheat-200 text-brand-wheat-800 px-2 py-1 rounded-full">{m}</span>
                           ))}
                        </div>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-brand-wheat-600">Keywords</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {campaign.brandIdentity.keywords.map((k, i) => (
                             <span key={i} className="text-xs font-medium bg-brand-wheat-50 border border-brand-wheat-200 text-brand-wheat-800 px-2 py-1 rounded-full">{k}</span>
                           ))}
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Logos */}
             <div className="bg-white p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-brand-wheat-800">Logo Concepts</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {campaign.logos.map((logoUrl, i) => (
                        <div key={i} className="group relative">
                           <img src={logoUrl} alt={`Logo concept ${i+1}`} className="rounded-lg shadow-sm w-full aspect-square object-cover" />
                           <button onClick={() => handleDownload(logoUrl, `logo_${i+1}.jpg`)} className="absolute bottom-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                           </button>
                        </div>
                    ))}
                </div>
             </div>
             
             {/* Hero Image */}
              <div className="bg-white p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-brand-wheat-800">Hero Image</h4>
                    <button onClick={() => handleDownload(campaign.heroImage, 'hero_image.jpg')} className="text-sm font-semibold text-brand-teal-600 hover:underline">Download</button>
                </div>
                <img src={campaign.heroImage} alt="Campaign hero image" className="rounded-lg shadow-md w-full" />
             </div>
             
             {/* Ad Copy */}
              <div className="bg-white p-6 rounded-xl">
                <h4 className="text-xl font-bold text-brand-wheat-800 mb-4">Ad Copy</h4>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600 uppercase">Headline</p>
                        <p className="text-lg font-semibold text-brand-wheat-800 mt-1">{campaign.adCopy.headline}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600 uppercase">Body</p>
                        <p className="text-brand-wheat-700 mt-1">{campaign.adCopy.body}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600 uppercase">Call to Action</p>
                        <p className="text-brand-wheat-800 font-bold mt-1 bg-brand-wheat-50 inline-block px-3 py-1 rounded-md border border-brand-wheat-200">{campaign.adCopy.cta}</p>
                    </div>
                </div>
             </div>
             
              {/* Social Video */}
              <div className="bg-white p-6 rounded-xl">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-brand-wheat-800">Social Media Video</h4>
                    <button onClick={() => handleDownload(campaign.socialVideoUrl, 'social_video.mp4')} className="text-sm font-semibold text-brand-teal-600 hover:underline">Download</button>
                </div>
                <video src={campaign.socialVideoUrl} controls autoPlay loop muted className="w-full max-w-sm mx-auto rounded-lg shadow-md" />
             </div>
        </div>
      </div>
    </div>
  );
}