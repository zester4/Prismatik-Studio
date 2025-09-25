import React, { useState, useCallback, ReactElement, useContext, ChangeEvent } from 'react';
import { generateVideo } from '../services/geminiService';
import { AspectRatio, HistoryItemVideo } from '../types';
import { VIDEO_ASPECT_RATIOS, CREATIVE_VIDEO_PROMPTS, VIDEO_MODELS } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';
import InteractiveResultCard from './InteractiveResultCard';

type VideoResult = Omit<HistoryItemVideo, 'id' | 'timestamp' | 'type'>;

export default function VideoGenerator(): ReactElement {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [model, setModel] = useState<string>(VIDEO_MODELS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRetryable, setIsRetryable] = useState<boolean>(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; dataUrl: string; base64: string; mimeType: string } | null>(null);
  
  const { addHistoryItem } = useContext(HistoryContext);

  const handleSurpriseMe = useCallback(() => {
    const randomPrompt = CREATIVE_VIDEO_PROMPTS[Math.floor(Math.random() * CREATIVE_VIDEO_PROMPTS.length)];
    const randomAspectRatio = VIDEO_ASPECT_RATIOS[Math.floor(Math.random() * VIDEO_ASPECT_RATIOS.length)];
    const randomModel = VIDEO_MODELS[Math.floor(Math.random() * VIDEO_MODELS.length)].id;
    setPrompt(randomPrompt);
    setAspectRatio(randomAspectRatio);
    setModel(randomModel);
    setUploadedImage(null);
  }, []);
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(',')[1];
        setUploadedImage({ file, dataUrl, base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
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
      const imageParam = uploadedImage ? { mimeType: uploadedImage.mimeType, data: uploadedImage.base64 } : undefined;
      const url = await generateVideo(prompt, aspectRatio, model, onProgress, imageParam);
      
      const newResult = { videoUrl: url, prompt, aspectRatio, model };
      setResult(newResult);
      
      addHistoryItem({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'video',
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
  }, [prompt, aspectRatio, model, uploadedImage, addHistoryItem]);
  
  return (
    <div>
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Video Generation</h2>
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
          placeholder="e.g., An astronaut riding a horse on the moon."
          disabled={isLoading}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div>
            <label htmlFor="videoAspectRatio" className="block text-sm font-medium text-brand-wheat-800 mb-1">Aspect Ratio</label>
            <select
              id="videoAspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
              {VIDEO_ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="videoModel" className="block text-sm font-medium text-brand-wheat-800 mb-1">Model</label>
            <select
              id="videoModel" value={model} onChange={(e) => setModel(e.target.value)}
              disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
              {VIDEO_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="imageUpload" className="block text-sm font-medium text-brand-wheat-800 mb-1">Animate Image (Optional)</label>
             <input type="file" id="imageUpload" accept="image/*" onChange={handleFileChange} disabled={isLoading} className="block w-full text-sm text-brand-wheat-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-teal-50 file:text-brand-teal-700 hover:file:bg-brand-teal-100"/>
          </div>
        </div>
         {uploadedImage && (
            <div className="relative w-full max-w-[12rem]">
              <p className="text-sm font-medium text-brand-wheat-800 mb-1">Image Preview:</p>
              <img src={uploadedImage.dataUrl} alt="Upload preview" className="rounded-lg shadow-md" />
              <button onClick={() => setUploadedImage(null)} disabled={isLoading} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">&times;</button>
            </div>
          )}
        
        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Generating Video...' : 'Generate Video'}
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
          <h3 className="text-xl font-semibold mb-4">Result</h3>
           <InteractiveResultCard item={{ id: 'current', timestamp: Date.now(), type: 'video', ...result }} />
        </div>
      )}
    </div>
  );
}