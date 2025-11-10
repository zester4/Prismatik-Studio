import React, { useState, useCallback, ReactElement, useContext, ChangeEvent } from 'react';
import { generateStory, generateImages } from '../services/geminiService';
import { AspectRatio, HistoryItemStory } from '../types';
import { ASPECT_RATIOS, STORY_TEMPLATES } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import { PersonaContext } from '../context/PersonaContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';
import Tooltip from './Tooltip';
import PromptTemplates from './PromptTemplates';
import ProgressStepper from './ProgressStepper';

type StoryResult = Omit<HistoryItemStory, 'id' | 'timestamp' | 'type'>;
type TextLength = 'short' | 'medium' | 'detailed';

const RegenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" />
  </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-wheat-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const storyGenerationSteps = ["Planning Story", "Writing Scenes", "Illustrating", "Complete"];


/**
 * Helper function to draw word-wrapped text with a semi-transparent background on a canvas.
 */
function drawTextWithBackground(ctx: CanvasRenderingContext2D, text: string, canvasWidth: number, canvasHeight: number) {
    ctx.font = `bold ${canvasWidth / 40}px Poppins`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    const padding = 20;
    const maxTextWidth = canvasWidth * 0.9;
    
    // Simple word wrap
    const words = text.split(' ');
    let lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxTextWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    
    const lineHeight = canvasWidth / 30;
    const totalTextHeight = lines.length * lineHeight;
    
    const rectX = (canvasWidth - maxTextWidth) / 2 - padding;
    const rectY = canvasHeight - totalTextHeight - padding * 3;
    const rectWidth = maxTextWidth + padding * 2;
    const rectHeight = totalTextHeight + padding * 1.5;

    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Draw text lines
    ctx.fillStyle = 'white';
    lines.forEach((line, index) => {
        ctx.fillText(line, canvasWidth / 2, rectY + padding + (index * lineHeight));
    });
}


export default function StoryGenerator(): ReactElement {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [numberOfScenes, setNumberOfScenes] = useState<number>(4);
  const [textLength, setTextLength] = useState<TextLength>('medium');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isRetryable, setIsRetryable] = useState<boolean>(false);
  const [result, setResult] = useState<StoryResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; dataUrl: string; base64: string; mimeType: string } | null>(null);
  const [sceneRegenIndex, setSceneRegenIndex] = useState<number | null>(null);
  const [editingSceneIndex, setEditingSceneIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [isSavingPdf, setIsSavingPdf] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [videoExportProgress, setVideoExportProgress] = useState<string>('');
  const [sceneErrors, setSceneErrors] = useState<{ [key: number]: { message: string; isRetryable: boolean } | null }>({});
  
  const { addHistoryItem } = useContext(HistoryContext);
  const { activePersona } = useContext(PersonaContext);

  const handleSelectTemplate = useCallback((template: any) => {
    setPrompt(template.prompt || '');
    setAspectRatio(template.aspectRatio || '16:9');
    setNumberOfScenes(template.numberOfScenes || 4);
    setTextLength(template.textLength || 'medium');
    setResult(null);
    setError(null);
    setUploadedImage(null);
  }, []);
  
  const handleSurpriseMe = useCallback(() => {
    const randomTemplate = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)];
    handleSelectTemplate(randomTemplate);
  }, [handleSelectTemplate]);

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
      setError('Please enter a story idea.');
      setIsRetryable(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsRetryable(false);
    setResult(null);
    setProgress('');
    setCurrentStep(0);
    setSceneErrors({});
    const systemInstruction = activePersona?.systemInstruction;

    try {
      const onProgress = (message: string) => {
        setProgress(message);
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('analyzing') || lowerMessage.includes('story plan')) {
            setCurrentStep(0);
        } else if (lowerMessage.includes('plan created')) {
            setCurrentStep(1);
        } else if (lowerMessage.includes('generating image')) {
            setCurrentStep(2);
        } else if (lowerMessage.includes('complete')) {
            setCurrentStep(3);
        }
      };
      const imageParam = uploadedImage ? { mimeType: uploadedImage.mimeType, data: uploadedImage.base64 } : undefined;
      const scenes = await generateStory(prompt, aspectRatio, numberOfScenes, textLength, onProgress, imageParam, systemInstruction);
      
      const newResult: StoryResult = { scenes, prompt, aspectRatio };
      setResult(newResult);
      
      addHistoryItem({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'story',
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
  }, [prompt, aspectRatio, addHistoryItem, numberOfScenes, textLength, uploadedImage, activePersona]);
  
  const handleRegenerateImage = useCallback(async (index: number) => {
    if (!result) return;
    setSceneRegenIndex(index);
    setSceneErrors(prev => ({ ...prev, [index]: null }));
    setError(null);
    setIsRetryable(false);

    const systemInstruction = activePersona?.systemInstruction;

    try {
      const scene = result.scenes[index];
      const newImageUrls = await generateImages(scene.imagePrompt, 1, result.aspectRatio, 'none', 'gemini-2.5-flash-image-preview', undefined, systemInstruction);
      if (newImageUrls.length > 0) {
        const newScenes = [...result.scenes];
        newScenes[index] = { ...newScenes[index], imageUrl: newImageUrls[0] };
        setResult({ ...result, scenes: newScenes });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      const isRetryable = errorMessage.includes('[Network Error]') || errorMessage.includes('[Server Error]') || errorMessage.includes('[Bad Request]');
      setSceneErrors(prev => ({ ...prev, [index]: { message: errorMessage, isRetryable } }));
    } finally {
      setSceneRegenIndex(null);
    }
  }, [result, activePersona]);
  
  const handleStartEditingText = (index: number) => {
    if (!result) return;
    setEditingSceneIndex(index);
    setEditText(result.scenes[index].text);
  };
  
  const handleSaveText = (index: number) => {
    if (!result) return;
    const newScenes = [...result.scenes];
    newScenes[index] = { ...newScenes[index], text: editText };
    setResult({ ...result, scenes: newScenes });
    setEditingSceneIndex(null);
  };

  const handleSaveAsPdf = async () => {
    if (!result) return;
    setIsSavingPdf(true);
    setError(null);
    try {
      // @ts-ignore - jspdf is loaded from CDN
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;

      for (let i = 0; i < result.scenes.length; i++) {
        const scene = result.scenes[i];
        if (i > 0) {
          doc.addPage();
        }
        
        const [aspectW, aspectH] = result.aspectRatio.split(':').map(Number);
        let imgW = contentW;
        let imgH = (imgW * aspectH) / aspectW;
        
        const maxImgH = contentH * 0.6;
        if (imgH > maxImgH) {
          imgH = maxImgH;
          imgW = (imgH * aspectW) / aspectH;
        }
        
        const imgX = (pageW - imgW) / 2;
        const imgY = margin;
        
        doc.addImage(scene.imageUrl, 'JPEG', imgX, imgY, imgW, imgH);

        const textY = imgY + imgH + 10;
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(scene.text, contentW);
        doc.text(textLines, margin, textY);
      }

      doc.save('creative-studio-story.pdf');
    } catch (e) {
      setError(e instanceof Error ? `Failed to save PDF: ${e.message}` : 'An unknown error occurred while saving PDF.');
    } finally {
      setIsSavingPdf(false);
    }
  };

  const handleSaveAsVideo = async () => {
    if (!result) return;
    setIsExportingVideo(true);
    setVideoExportProgress('Initializing video export...');
    setError(null);

    try {
        const DURATION_PER_SCENE = 4; // seconds
        const FADE_DURATION = 0.5; // seconds
        const FPS = 30;

        setVideoExportProgress('Setting up canvas...');
        const [aspectW, aspectH] = result.aspectRatio.split(':').map(Number);
        const videoWidth = 1280;
        const videoHeight = Math.round((videoWidth * aspectH) / aspectW);
        const canvas = document.createElement('canvas');
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        
        setVideoExportProgress('Loading scene images...');
        const imageElements = await Promise.all(
            result.scenes.map(scene => new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = scene.imageUrl;
            }))
        );

        const stream = canvas.captureStream(FPS);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        
        const exportPromise = new Promise<void>((resolve) => {
             recorder.onstop = () => {
                setVideoExportProgress('Finalizing video file...');
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'creative-studio-story.webm';
                a.click();
                URL.revokeObjectURL(url);
                resolve();
            };
        });
       
        recorder.start();

        const totalFrames = DURATION_PER_SCENE * FPS * result.scenes.length;
        let frameCount = 0;

        for (let i = 0; i < result.scenes.length; i++) {
            const scene = result.scenes[i];
            const image = imageElements[i];
            
            for (let t = 0; t < DURATION_PER_SCENE * FPS; t++) {
                frameCount++;
                setVideoExportProgress(`Rendering scene ${i + 1}/${result.scenes.length} (${Math.round((frameCount / totalFrames) * 100)}%)...`);
                const currentTimeInScene = t / FPS;

                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, videoWidth, videoHeight);

                let opacity = 1.0;
                if (currentTimeInScene < FADE_DURATION) {
                    opacity = currentTimeInScene / FADE_DURATION;
                } else if (currentTimeInScene > DURATION_PER_SCENE - FADE_DURATION) {
                    opacity = (DURATION_PER_SCENE - currentTimeInScene) / FADE_DURATION;
                }
                ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
                
                ctx.drawImage(image, 0, 0, videoWidth, videoHeight);
                
                if (opacity > 0) {
                    drawTextWithBackground(ctx, scene.text, videoWidth, videoHeight);
                }
                
                ctx.globalAlpha = 1.0;
                await new Promise(resolve => setTimeout(resolve, 1000 / FPS));
            }
        }

        recorder.stop();
        await exportPromise;

    } catch (e) {
        setError(e instanceof Error ? `Failed to export video: ${e.message}` : 'An unknown error occurred while exporting video.');
    } finally {
        setIsExportingVideo(false);
        setVideoExportProgress('');
    }
  };


  return (
    <div>
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Story Generator</h2>
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
          placeholder="e.g., A brave squirrel goes on an adventure to find the legendary Golden Acorn."
          disabled={isLoading}
        />
        <PromptTemplates templates={STORY_TEMPLATES} onSelect={handleSelectTemplate} disabled={isLoading} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="numberOfScenes" className="block text-sm font-medium text-brand-wheat-800 mb-1">Number of Scenes</label>
              <select
                id="numberOfScenes" value={numberOfScenes} onChange={(e) => setNumberOfScenes(Number(e.target.value))}
                disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                {[3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="storyAspectRatio" className="block text-sm font-medium text-brand-wheat-800 mb-1">Aspect Ratio</label>
              <select
                id="storyAspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                {ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
              </select>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="textLength" className="block text-sm font-medium text-brand-wheat-800">Narrative Length</label>
                    <Tooltip text="Controls how much text is generated for each scene. 'Short' is 1-2 sentences, 'Detailed' is 4-6.">
                        <InfoIcon />
                    </Tooltip>
                </div>
              <select
                id="textLength" value={textLength} onChange={(e) => setTextLength(e.target.value as TextLength)}
                disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
             <div className="md:col-span-3">
                <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-brand-wheat-800">Character Lock (Optional)</label>
                    <Tooltip text="Upload an image of a character. The AI will analyze their appearance and keep it consistent across all scenes.">
                        <InfoIcon />
                    </Tooltip>
                </div>
              <p className="text-xs text-brand-wheat-600 mb-2">Upload an image of a character to maintain their appearance across all scenes.</p>
              <input type="file" id="imageUpload" accept="image/*" onChange={handleFileChange} disabled={isLoading} className="block w-full text-sm text-brand-wheat-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-teal-50 file:text-brand-teal-700 hover:file:bg-brand-teal-100"/>
            </div>
        </div>

         {uploadedImage && (
            <div className="relative w-full max-w-[10rem]">
              <p className="text-sm font-medium text-brand-wheat-800 mb-1">Character Preview:</p>
              <img src={uploadedImage.dataUrl} alt="Upload preview" className="rounded-lg shadow-md" />
              <button onClick={() => setUploadedImage(null)} disabled={isLoading} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">&times;</button>
            </div>
          )}
        
        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Generating Story...' : 'Generate Story'}
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center p-4 bg-brand-wheat-50 rounded-lg border border-brand-wheat-200">
            <h3 className="font-semibold text-brand-wheat-800">Your story is coming to life...</h3>
            <p className="text-sm text-brand-wheat-600 mb-4">
                The AI is planning the narrative and creating illustrations for each scene.
            </p>
            <p className="text-sm text-brand-wheat-600 mb-4 font-mono">{progress}</p>
            <ProgressStepper steps={storyGenerationSteps} currentStep={currentStep} />
        </div>
      )}

      {isExportingVideo && (
        <div className="mt-4 text-center p-3 bg-green-100 text-green-800 rounded-md">
            <p className="font-semibold">Video export in progress...</p>
            <p className="text-sm">{videoExportProgress || "This may take a moment."}</p>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-xl font-semibold">Your Story</h3>
            <div className="flex gap-2 self-start sm:self-center flex-wrap">
              <button 
                onClick={handleSaveAsPdf} 
                disabled={isLoading || isSavingPdf || isExportingVideo}
                className="flex items-center justify-center bg-brand-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed"
              >
                {isSavingPdf && <LoadingSpinner />}
                {isSavingPdf ? 'Saving PDF...' : 'Save as PDF'}
              </button>
              <button 
                onClick={handleSaveAsVideo} 
                disabled={isLoading || isSavingPdf || isExportingVideo}
                className="flex items-center justify-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isExportingVideo && <LoadingSpinner />}
                {isExportingVideo ? 'Exporting...' : 'Save as Video'}
              </button>
            </div>
          </div>
           <div className="space-y-8">
            {result.scenes.map((scene, index) => (
              <div key={index} className="bg-brand-wheat-50 rounded-xl overflow-hidden shadow-lg p-4">
                <div className="relative group">
                    <img src={scene.imageUrl} alt={`Scene ${index + 1}`} className="w-full rounded-lg object-cover" style={{aspectRatio: result.aspectRatio.replace(':', '/')}}/>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                        <button 
                            onClick={() => handleRegenerateImage(index)}
                            disabled={sceneRegenIndex !== null}
                            className="text-white text-sm font-bold bg-black bg-opacity-60 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                          <RegenerateIcon />
                          Regenerate
                        </button>
                    </div>
                     {sceneRegenIndex === index && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                            <LoadingSpinner />
                            <span className="text-white ml-2">Regenerating...</span>
                        </div>
                    )}
                    {sceneErrors[index] && (
                        <div className="absolute inset-0 bg-red-800 bg-opacity-80 flex flex-col items-center justify-center rounded-lg p-4 text-center">
                            <p className="text-white text-xs font-semibold mb-2">{sceneErrors[index]?.message}</p>
                            {sceneErrors[index]?.isRetryable && (
                                <button onClick={() => handleRegenerateImage(index)} className="bg-white text-red-800 text-xs font-bold px-3 py-1 rounded hover:bg-red-100">
                                    Retry
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                         <p className="font-bold text-brand-teal-700">Scene {index + 1}</p>
                         {editingSceneIndex === index ? (
                            <button onClick={() => handleSaveText(index)} className="flex items-center gap-1 text-sm text-brand-teal-600 hover:text-brand-teal-800 font-semibold">
                                <SaveIcon /> Save
                            </button>
                         ) : (
                            <button onClick={() => handleStartEditingText(index)} className="flex items-center gap-1 text-sm text-brand-wheat-600 hover:text-brand-wheat-800 font-semibold">
                                <EditIcon /> Edit
                            </button>
                         )}
                    </div>
                    {editingSceneIndex === index ? (
                        <textarea 
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 rounded-md border border-brand-wheat-300 bg-white"
                            rows={4}
                        />
                    ) : (
                        <p className="text-brand-wheat-800">{scene.text}</p>
                    )}
                </div>
              </div>
            ))}
           </div>
        </div>
      )}
    </div>
  );
}