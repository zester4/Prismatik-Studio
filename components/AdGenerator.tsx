import React, { useState, useCallback, ReactElement, useContext, ChangeEvent } from 'react';
import { generateAd, generateAdVideo } from '../services/geminiService';
import { HistoryItemAd, AdCopy } from '../types';
import { AD_TONES, AD_TEMPLATES } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import LoadingSpinner from './LoadingSpinner';
import InteractiveResultCard from './InteractiveResultCard';
import Tooltip from './Tooltip';
import PromptTemplates from './PromptTemplates';

type AdResult = Omit<HistoryItemAd, 'id' | 'timestamp' | 'type' | 'prompt'> & { prompt: string };
type AdType = 'image' | 'video';

const AdTypeSelector: React.FC<{
  selectedType: AdType,
  onSelectType: (type: AdType) => void,
  disabled: boolean
}> = ({ selectedType, onSelectType, disabled }) => {
  const baseClasses = "w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:ring-offset-2";
  const selectedClasses = "bg-brand-teal-500 text-white shadow";
  const unselectedClasses = "bg-brand-wheat-100 text-brand-wheat-700 hover:bg-brand-wheat-200";

  return (
    <div className="grid grid-cols-2 gap-2 p-1 bg-brand-wheat-200 rounded-lg">
      <button 
        onClick={() => onSelectType('image')}
        disabled={disabled}
        className={`${baseClasses} ${selectedType === 'image' ? selectedClasses : unselectedClasses}`}
      >
        Image Ad
      </button>
      <button 
        onClick={() => onSelectType('video')}
        disabled={disabled}
        className={`${baseClasses} ${selectedType === 'video' ? selectedClasses : unselectedClasses}`}
      >
        Video Ad
      </button>
    </div>
  );
};

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-wheat-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export default function AdGenerator(): ReactElement {
  const [productName, setProductName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [tone, setTone] = useState<string>(AD_TONES[0].id);
  const [cta, setCta] = useState<string>('Shop Now');
  const [uploadedImage, setUploadedImage] = useState<{ file: File; dataUrl: string; base64: string; mimeType: string } | null>(null);
  const [adType, setAdType] = useState<AdType>('image');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRetryable, setIsRetryable] = useState<boolean>(false);
  const [result, setResult] = useState<AdResult | null>(null);
  
  const { addHistoryItem } = useContext(HistoryContext);

  const handleSelectTemplate = useCallback((template: any) => {
    setProductName(template.productName || '');
    setDescription(template.prompt || '');
    setAudience(template.audience || '');
    setCta(template.cta || 'Shop Now');
    setTone(template.tone || AD_TONES[0].id);
    setResult(null);
    setError(null);
    setUploadedImage(null);
  }, []);

  const handleSurpriseMe = useCallback(() => {
    const randomTemplate = AD_TEMPLATES[Math.floor(Math.random() * AD_TEMPLATES.length)];
    handleSelectTemplate(randomTemplate);
  }, [handleSelectTemplate]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
          setError("Image size cannot exceed 4MB.");
          return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const base64 = dataUrl.split(',')[1];
        setUploadedImage({ file, dataUrl, base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = productName.trim() && description.trim() && audience.trim() && cta.trim();

  const handleGenerate = useCallback(async () => {
    if (!isFormValid) {
      setError('Please fill in all product detail fields (name, audience, description, CTA).');
      setIsRetryable(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsRetryable(false);
    setResult(null);
    setProgress('');
    try {
      let mediaUrl: string;
      let adCopy: AdCopy;
      const imageParam = uploadedImage ? { mimeType: uploadedImage.mimeType, data: uploadedImage.base64 } : undefined;

      if (adType === 'image') {
        const response = await generateAd(
          productName, description, audience, tone, cta,
          imageParam
        );
        mediaUrl = response.mediaUrl;
        adCopy = response.adCopy;
      } else { // adType === 'video'
        const onProgress = (message: string) => setProgress(message);
        const response = await generateAdVideo(
            productName, description, audience, tone, cta,
            onProgress,
            imageParam
        );
        mediaUrl = response.mediaUrl;
        adCopy = response.adCopy;
      }

      const newResult: AdResult = {
        mediaUrl,
        adCopy,
        productName,
        prompt: description,
        adType,
      };

      setResult(newResult);

      addHistoryItem({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'ad',
        ...newResult,
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
  }, [productName, description, audience, tone, cta, uploadedImage, addHistoryItem, isFormValid, adType]);

  const buttonText = adType === 'image' ? 'Generate Image Ad' : 'Generate Video Ad';
  const loadingText = adType === 'image' ? 'Generating Ad...' : 'Generating Video Ad...';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Ad Creator</h2>
          <p className="text-brand-wheat-600 mt-1">Generate a tailored image or video ad for your product.</p>
        </div>
        <button onClick={handleSurpriseMe} disabled={isLoading} className="flex-shrink-0 flex items-center text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50 self-start sm:self-center mt-2 sm:mt-0">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          Surprise Me
        </button>
      </div>

      <div className="space-y-6">
         <div>
            <label className="block text-sm font-medium text-brand-wheat-800 mb-1">Ad Format *</label>
            <AdTypeSelector selectedType={adType} onSelectType={setAdType} disabled={isLoading} />
         </div>
        
        <div>
            <div className="flex items-center gap-2 mb-1">
                <label htmlFor="imageUpload" className="block text-sm font-medium text-brand-wheat-800">Product Image (Optional)</label>
                <Tooltip text="If provided, the AI will enhance your product shot. Otherwise, it will generate a new one from scratch based on your description.">
                    <InfoIcon />
                </Tooltip>
            </div>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-brand-wheat-200 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {uploadedImage ? (
                <div className="relative w-full max-w-xs mx-auto">
                    <img src={uploadedImage.dataUrl} alt="Upload preview" className="rounded-lg shadow-md max-h-48" />
                    <button onClick={() => setUploadedImage(null)} disabled={isLoading} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">&times;</button>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-brand-wheat-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div className="flex text-sm text-brand-wheat-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-teal-600 hover:text-brand-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-teal-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-brand-wheat-500">PNG, JPG, GIF up to 4MB</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <PromptTemplates templates={AD_TEMPLATES} onSelect={handleSelectTemplate} disabled={isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-brand-wheat-800 mb-1">Product / Service Name *</label>
              <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} disabled={isLoading} placeholder="e.g., HydroFlow Water Bottle" className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500" />
            </div>
            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-brand-wheat-800 mb-1">Target Audience *</label>
              <input type="text" id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} disabled={isLoading} placeholder="e.g., Fitness enthusiasts, hikers" className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500" />
            </div>
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-wheat-800 mb-1">Product / Service Description *</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading} rows={3} placeholder="e.g., A vacuum-insulated stainless steel bottle that keeps drinks cold for 24 hours." className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500 resize-none" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="tone" className="block text-sm font-medium text-brand-wheat-800">Ad Tone *</label>
                    <Tooltip text="Select the emotional or stylistic tone of the ad copy. This will influence the AI's word choice and sentence structure.">
                        <InfoIcon />
                    </Tooltip>
                </div>
                <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                    {AD_TONES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
             <div>
              <label htmlFor="cta" className="block text-sm font-medium text-brand-wheat-800 mb-1">Call to Action (CTA) *</label>
              <input type="text" id="cta" value={cta} onChange={(e) => setCta(e.target.value)} disabled={isLoading} placeholder="e.g., Shop Now and Hydrate!" className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500" />
            </div>
        </div>
        
        <button onClick={handleGenerate} disabled={isLoading || !isFormValid} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? loadingText : buttonText}
        </button>
      </div>

       {isLoading && adType === 'video' && (
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
          <h3 className="text-xl font-semibold mb-4">Your Generated Ad</h3>
          <InteractiveResultCard item={{ id: 'current', timestamp: Date.now(), type: 'ad', ...result}} />
        </div>
      )}
    </div>
  );
}