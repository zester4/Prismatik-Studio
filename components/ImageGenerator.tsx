import React, { useState, useCallback, ReactElement, useContext } from 'react';
import { generateImages } from '../services/geminiService';
import { AspectRatio, HistoryItemImage } from '../types';
import { IMAGE_MODELS, ASPECT_RATIOS, IMAGE_STYLES, CREATIVE_IMAGE_PROMPTS } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';
import InteractiveResultCard from './InteractiveResultCard';

type ImageResult = Omit<HistoryItemImage, 'id' | 'timestamp' | 'type'>;

export default function ImageGenerator(): ReactElement {
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [style, setStyle] = useState<string>('photorealistic');
  const [model, setModel] = useState<string>(IMAGE_MODELS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetryable, setIsRetryable] = useState<boolean>(false);
  const [results, setResults] = useState<ImageResult[]>([]);
  
  const { addHistoryItem } = useContext(HistoryContext);

  const handleSurpriseMe = useCallback(() => {
    const randomPrompt = CREATIVE_IMAGE_PROMPTS[Math.floor(Math.random() * CREATIVE_IMAGE_PROMPTS.length)];
    const randomModel = IMAGE_MODELS[Math.floor(Math.random() * IMAGE_MODELS.length)].id;
    const randomAspectRatio = ASPECT_RATIOS[Math.floor(Math.random() * ASPECT_RATIOS.length)];
    const randomStyle = IMAGE_STYLES.filter(s => s.id !== 'none')[Math.floor(Math.random() * (IMAGE_STYLES.length - 1))].id;
    
    setPrompt(randomPrompt);
    setModel(randomModel);
    setAspectRatio(randomAspectRatio);
    setStyle(randomStyle);
    setNumberOfImages(1);
    setNegativePrompt('');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      setIsRetryable(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsRetryable(false);
    setResults([]);
    try {
      const generatedImages = await generateImages(prompt, numberOfImages, aspectRatio, style, model, negativePrompt);
      const newResults: ImageResult[] = generatedImages.map(imageUrl => ({
          prompt,
          imageUrl,
          model,
          style,
          aspectRatio,
      }));
      setResults(newResults);

      newResults.forEach(result => {
        addHistoryItem({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'image',
          ...result,
        });
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
  }, [prompt, numberOfImages, aspectRatio, style, model, negativePrompt, addHistoryItem]);

  const isImagenModel = model.startsWith('imagen-');

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Image Generation</h2>
        <button onClick={handleSurpriseMe} disabled={isLoading} className="flex items-center text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50 self-start sm:self-center">
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
          placeholder="e.g., A futuristic cityscape at sunset, with flying cars and neon lights."
          disabled={isLoading}
          rows={8}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={isImagenModel ? 'md:col-span-2' : ''}>
            <label htmlFor="model" className="block text-sm font-medium text-brand-wheat-800 mb-1">Model</label>
            <select
              id="model" value={model} onChange={(e) => setModel(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500"
            >
              {IMAGE_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          
          {isImagenModel && (
            <>
              <div className="md:col-span-2">
                <label htmlFor="negativePrompt" className="block text-sm font-medium text-brand-wheat-800 mb-1">Negative Prompt (Optional)</label>
                <input
                  type="text"
                  id="negativePrompt"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g., blurry, extra limbs, text"
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500"
                />
              </div>
              <div>
                <label htmlFor="aspectRatio" className="block text-sm font-medium text-brand-wheat-800 mb-1">Aspect Ratio</label>
                <select id="aspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                  {ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="numberOfImages" className="block text-sm font-medium text-brand-wheat-800 mb-1">Number of Images</label>
                <select id="numberOfImages" value={numberOfImages} onChange={(e) => setNumberOfImages(Number(e.target.value))} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
               <div className="md:col-span-2">
                <label htmlFor="style" className="block text-sm font-medium text-brand-wheat-800 mb-1">Style</label>
                <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                  {IMAGE_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
        
        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Generating...' : 'Generate Images'}
        </button>
      </div>

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
      
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <InteractiveResultCard key={index} item={{ id: `${index}`, timestamp: Date.now(), type: 'image', ...result}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}