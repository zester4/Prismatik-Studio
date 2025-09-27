import React, { useState, useCallback, ReactElement, useContext, ChangeEvent, useMemo } from 'react';
import { generateImages, editImage } from '../services/geminiService';
import { AspectRatio, HistoryItemImage } from '../types';
import { IMAGE_MODELS, ASPECT_RATIOS, IMAGE_STYLES, IMAGE_TEMPLATES } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import { PersonaContext } from '../context/PersonaContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';
import InteractiveResultCard from './InteractiveResultCard';
import Tooltip from './Tooltip';
import PromptTemplates from './PromptTemplates';

type ImageResult = Omit<HistoryItemImage, 'id' | 'timestamp' | 'type'>;

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-wheat-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


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
  const [uploadedImage, setUploadedImage] = useState<{ file: File; dataUrl: string; base64: string; mimeType: string } | null>(null);

  
  const { addHistoryItem } = useContext(HistoryContext);
  const { activePersona } = useContext(PersonaContext);

  const handleSelectTemplate = useCallback((template: any) => {
    setPrompt(template.prompt || '');
    setStyle(template.style || 'photorealistic');
    setNegativePrompt(template.negativePrompt || '');
    setAspectRatio(template.aspectRatio || '1:1');
    setModel(template.model || IMAGE_MODELS[0].id);
    setNumberOfImages(1);
    setResults([]);
    setError(null);
    setUploadedImage(null);
  }, []);

  const handleSurpriseMe = useCallback(() => {
    const randomTemplate = IMAGE_TEMPLATES[Math.floor(Math.random() * IMAGE_TEMPLATES.length)];
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
      setResults([]);
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
    setResults([]);

    const systemInstruction = activePersona?.systemInstruction;

    try {
      if (uploadedImage) {
        // Image Editing Logic
        const editedImage = await editImage(prompt, { mimeType: uploadedImage.mimeType, data: uploadedImage.base64 }, systemInstruction);
        const newResult: ImageResult = {
          prompt,
          imageUrl: editedImage,
          model: 'gemini-2.5-flash-image-preview',
          style: 'edit',
          aspectRatio: "1:1", // Edit model output is square
        };
        setResults([newResult]);

        addHistoryItem({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'image',
          ...newResult,
          isEdit: true,
        });

      } else {
        // Text-to-Image Generation Logic
        const generatedImages = await generateImages(prompt, numberOfImages, aspectRatio, style, model, negativePrompt, systemInstruction);
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
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      if (errorMessage.includes('[Network Error]') || errorMessage.includes('[Server Error]') || errorMessage.includes('[Bad Request]')) {
        setIsRetryable(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, numberOfImages, aspectRatio, style, model, negativePrompt, addHistoryItem, uploadedImage, activePersona]);

  const isImagenModel = model.startsWith('imagen-');
  const isEditing = uploadedImage !== null;

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
          placeholder={isEditing ? "Editing instructions, e.g., 'add a futuristic helmet'" : "e.g., A futuristic cityscape at sunset, with flying cars and neon lights."}
          disabled={isLoading}
          rows={isEditing ? 4 : 8}
        />

        <PromptTemplates templates={IMAGE_TEMPLATES} onSelect={handleSelectTemplate} disabled={isLoading} />
        
        <div>
            <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-brand-wheat-800">{isEditing ? 'Image to Edit' : 'Start with an Image (Optional)'}</label>
                <Tooltip text="Upload an image to perform edits based on your prompt. This enables image-to-image generation.">
                    <InfoIcon />
                </Tooltip>
            </div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-wheat-200 border-dashed rounded-md">
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
                    <p className="text-xs text-brand-wheat-500">PNG, JPG up to 4MB</p>
                    </>
                )}
                </div>
            </div>
        </div>

        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={isImagenModel ? 'md:col-span-2' : ''}>
                <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="model" className="block text-sm font-medium text-brand-wheat-800">Model</label>
                    <Tooltip text="Different models have different strengths. Imagen models are great for photorealism, while Gemini is excellent for creative and multi-modal tasks.">
                        <InfoIcon />
                    </Tooltip>
                </div>
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
                    <div className="flex items-center gap-2 mb-1">
                        <label htmlFor="negativePrompt" className="block text-sm font-medium text-brand-wheat-800">Negative Prompt</label>
                        <Tooltip text="Specify what you DON'T want in the image. Useful for removing text, extra limbs, or unwanted objects.">
                            <InfoIcon />
                        </Tooltip>
                    </div>
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
                    <div className="flex items-center gap-2 mb-1">
                        <label htmlFor="style" className="block text-sm font-medium text-brand-wheat-800">Style</label>
                        <Tooltip text="Apply a pre-defined style to strongly influence the final look of the image. 'No Style' provides a more neutral interpretation of your prompt.">
                            <InfoIcon />
                        </Tooltip>
                    </div>
                  <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                    {IMAGE_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
        )}
        
        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Generating...' : (isEditing ? 'Generate Edit' : 'Generate Images')}
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
          <div className={`grid grid-cols-1 ${results.length > 1 ? 'sm:grid-cols-2' : ''} gap-6`}>
            {results.map((result, index) => (
              <InteractiveResultCard key={index} item={{ id: `${index}`, timestamp: Date.now(), type: 'image', isEdit: isEditing, ...result}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}