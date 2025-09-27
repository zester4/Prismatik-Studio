import React, { useState, useCallback, ReactElement, useContext } from 'react';
import { generateCampaign } from '../services/geminiService';
import { HistoryItemCampaign, BrandIdentity, AdCopy } from '../types';
import { CAMPAIGN_TEMPLATES } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';
import ImageModal from './ImageModal';
import PromptTemplates from './PromptTemplates';
import Tooltip from './Tooltip';

type CampaignResult = Omit<HistoryItemCampaign, 'id' | 'timestamp' | 'type'>;

export default function CampaignGenerator(): ReactElement {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRetryable, setIsRetryable] = useState<boolean>(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  
  const { addHistoryItem } = useContext(HistoryContext);

  const handleSelectTemplate = useCallback((template: any) => {
    setPrompt(template.prompt || '');
    setResult(null);
    setError(null);
  }, []);

  const handleSurpriseMe = useCallback(() => {
    const randomTemplate = CAMPAIGN_TEMPLATES[Math.floor(Math.random() * CAMPAIGN_TEMPLATES.length)];
    handleSelectTemplate(randomTemplate);
  }, [handleSelectTemplate]);

  const handleDownload = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a campaign brief.');
      setIsRetryable(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsRetryable(false);
    setResult(null);
    setProgress('');

    try {
      const onProgress = (message: string) => setProgress(message);
      const campaignResult = await generateCampaign(prompt, onProgress);
      
      const newResult: CampaignResult = { prompt, ...campaignResult };
      setResult(newResult);
      
      addHistoryItem({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'campaign',
        ...newResult
      });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      if (errorMessage.includes('[Network Error]') || errorMessage.includes('[Server Error]') || errorMessage.includes('[Bad Request]')) {
        setIsRetryable(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, addHistoryItem]);
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Campaign Director</h2>
          <p className="text-brand-wheat-600 mt-1">Describe your project, and the AI will generate a full creative campaign.</p>
        </div>
        <button onClick={handleSurpriseMe} disabled={isLoading} className="flex-shrink-0 flex items-center text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50 self-start sm:self-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          Surprise Me
        </button>
      </div>
      <div className="space-y-6">
        <PromptInput 
          prompt={prompt} 
          setPrompt={setPrompt} 
          placeholder="e.g., I'm launching 'Aether,' a new brand of noise-cancelling headphones for focus and productivity. The vibe should be minimalist, modern, and calm..."
          disabled={isLoading}
          rows={10}
        />
        <PromptTemplates templates={CAMPAIGN_TEMPLATES} onSelect={handleSelectTemplate} disabled={isLoading} />
        
        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Generating Campaign...' : 'Generate Campaign'}
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center p-3 bg-blue-100 text-blue-800 rounded-md">
            <p className="font-semibold">Generation in progress...</p>
            <p className="text-sm">{progress || "This may take a few minutes. Please be patient."}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md flex justify-between items-center">
          <span>{error}</span>
          {isRetryable && !isLoading && (
            <button
              onClick={handleGenerate}
              className="font-semibold text-sm bg-red-200 hover:bg-red-300 px-3 py-1 rounded-md"
            >
              Retry
            </button>
          )}
        </div>
      )}
      
      {result && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-brand-wheat-900">Your Generated Campaign for "{result.brandIdentity.companyName}"</h3>
           <div className="space-y-8">
             {/* Brand Identity */}
             <div className="bg-brand-wheat-50 p-6 rounded-xl border border-brand-wheat-200">
                <h4 className="text-xl font-bold text-brand-wheat-800 mb-4">Brand Identity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600">Target Audience</p>
                        <p className="text-base font-medium text-brand-wheat-800 mt-2">{result.brandIdentity.targetAudience}</p>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-brand-wheat-600">Colors</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {result.brandIdentity.colors.map((color, i) => (
                             <span key={i} className="text-xs font-medium bg-white border border-brand-wheat-200 text-brand-wheat-800 px-2 py-1 rounded-full">{color}</span>
                           ))}
                        </div>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-brand-wheat-600">Mood</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {result.brandIdentity.mood.map((m, i) => (
                             <span key={i} className="text-xs font-medium bg-white border border-brand-wheat-200 text-brand-wheat-800 px-2 py-1 rounded-full">{m}</span>
                           ))}
                        </div>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-brand-wheat-600">Keywords</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {result.brandIdentity.keywords.map((k, i) => (
                             <span key={i} className="text-xs font-medium bg-white border border-brand-wheat-200 text-brand-wheat-800 px-2 py-1 rounded-full">{k}</span>
                           ))}
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Logos */}
             <div className="bg-brand-wheat-50 p-6 rounded-xl border border-brand-wheat-200">
                <h4 className="text-xl font-bold text-brand-wheat-800 mb-4">Logo Concepts</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {result.logos.map((logoUrl, i) => (
                       <div key={i} className="group relative">
                           <button onClick={() => setModalImageUrl(logoUrl)} className="w-full aspect-square block">
                             <img src={logoUrl} alt={`Logo concept ${i+1}`} className="rounded-lg shadow-sm w-full h-full object-cover" />
                           </button>
                           <button onClick={() => handleDownload(logoUrl, `logo_${i+1}.jpg`)} className="absolute bottom-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Download logo">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                           </button>
                        </div>
                    ))}
                </div>
             </div>
             
             {/* Hero Image */}
              <div className="bg-brand-wheat-50 p-6 rounded-xl border border-brand-wheat-200">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-brand-wheat-800">Hero Image</h4>
                    <button onClick={() => handleDownload(result.heroImage, 'hero_image.jpg')} className="text-sm font-semibold text-brand-teal-600 hover:underline">Download</button>
                </div>
                <button onClick={() => setModalImageUrl(result.heroImage)} className="w-full block">
                    <img src={result.heroImage} alt="Campaign hero image" className="rounded-lg shadow-md w-full" />
                </button>
             </div>
             
             {/* Ad Copy */}
              <div className="bg-brand-wheat-50 p-6 rounded-xl border border-brand-wheat-200">
                <h4 className="text-xl font-bold text-brand-wheat-800 mb-4">Ad Copy</h4>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600 uppercase">Headline</p>
                        <p className="text-lg font-semibold text-brand-wheat-800 mt-1">{result.adCopy.headline}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600 uppercase">Body</p>
                        <p className="text-brand-wheat-700 mt-1">{result.adCopy.body}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-brand-wheat-600 uppercase">Call to Action</p>
                        <p className="text-brand-wheat-800 font-bold mt-1 bg-white inline-block px-3 py-1 rounded-md border border-brand-wheat-200">{result.adCopy.cta}</p>
                    </div>
                </div>
             </div>
             
              {/* Social Video */}
              <div className="bg-brand-wheat-50 p-6 rounded-xl border border-brand-wheat-200">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-brand-wheat-800">Social Media Video</h4>
                    <button onClick={() => handleDownload(result.socialVideoUrl, 'social_video.mp4')} className="text-sm font-semibold text-brand-teal-600 hover:underline">Download</button>
                </div>
                <video src={result.socialVideoUrl} controls autoPlay loop muted className="w-full max-w-sm mx-auto rounded-lg shadow-md" />
             </div>
           </div>
        </div>
      )}
      {modalImageUrl && <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />}
    </div>
  );
}