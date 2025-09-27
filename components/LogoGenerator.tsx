import React, { useState, useCallback, ReactElement, useContext } from 'react';
import { generateLogo } from '../services/geminiService';
import { HistoryItemLogo } from '../types';
import { LOGO_STYLES, LOGO_TEMPLATES, LOGO_MODELS } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import { PersonaContext } from '../context/PersonaContext';
import LoadingSpinner from './LoadingSpinner';
import InteractiveResultCard from './InteractiveResultCard';
import Tooltip from './Tooltip';
import PromptTemplates from './PromptTemplates';

type LogoResult = Omit<HistoryItemLogo, 'id' | 'timestamp' | 'type'>;

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-wheat-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export default function LogoGenerator(): ReactElement {
  const [companyName, setCompanyName] = useState<string>('');
  const [slogan, setSlogan] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [style, setStyle] = useState<string>('modern');
  const [colors, setColors] = useState<string>('');
  const [model, setModel] = useState<string>(LOGO_MODELS[0].id);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetryable, setIsRetryable] = useState<boolean>(false);
  const [results, setResults] = useState<LogoResult[]>([]);
  
  const { addHistoryItem } = useContext(HistoryContext);
  const { activePersona } = useContext(PersonaContext);

  const selectedModelInfo = LOGO_MODELS.find(m => m.id === model);

  const handleSelectTemplate = useCallback((template: any) => {
    setCompanyName(template.companyName || '');
    setSlogan(template.slogan || '');
    setDescription(template.prompt || '');
    setStyle(template.style || 'modern');
    setColors(template.colors || '');
    setResults([]);
    setError(null);
  }, []);

  const handleSurpriseMe = useCallback(() => {
    const randomTemplate = LOGO_TEMPLATES[Math.floor(Math.random() * LOGO_TEMPLATES.length)];
    handleSelectTemplate(randomTemplate);
  }, [handleSelectTemplate]);

  const handleGenerate = useCallback(async () => {
    if (!companyName.trim() || !description.trim() || !style.trim() || !colors.trim()) {
      setError('Please fill in Company Name, Description, Style, and Colors.');
      setIsRetryable(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIsRetryable(false);
    setResults([]);

    const systemInstruction = activePersona?.systemInstruction;

    try {
      const numberOfConcepts = selectedModelInfo?.concepts || 4;
      const generatedImages = await generateLogo(companyName, description, style, colors, model, numberOfConcepts, slogan, systemInstruction);
      const newResults: LogoResult[] = generatedImages.map(imageUrl => ({
          prompt: description,
          companyName,
          imageUrl,
          model: model,
          style,
      }));
      setResults(newResults);

      newResults.forEach(result => {
        addHistoryItem({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'logo',
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
  }, [companyName, slogan, description, style, colors, model, addHistoryItem, selectedModelInfo, activePersona]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Logo Generator</h2>
        <button onClick={handleSurpriseMe} disabled={isLoading} className="flex items-center text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50 self-start sm:self-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          Surprise Me
        </button>
      </div>
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-brand-wheat-800 mb-1">Company / Brand Name *</label>
              <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} disabled={isLoading} placeholder="e.g., Nova Robotics" className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500" />
            </div>
            <div>
              <label htmlFor="slogan" className="block text-sm font-medium text-brand-wheat-800 mb-1">Slogan (Optional)</label>
              <input type="text" id="slogan" value={slogan} onChange={(e) => setSlogan(e.target.value)} disabled={isLoading} placeholder="e.g., Engineering the Future" className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500" />
            </div>
        </div>

        <div>
            <div className="flex items-center gap-2 mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-brand-wheat-800">Description *</label>
                <Tooltip text="Describe your company, its values, and what the logo should represent. The more detail, the better!">
                    <InfoIcon />
                </Tooltip>
            </div>
            <p className="text-xs text-brand-wheat-600 mb-2">The AI will generate a text-free logo based on this description.</p>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading} rows={4} placeholder="e.g., A tech company specializing in AI and eco-friendly robotics." className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500 resize-none" />
        </div>

        <PromptTemplates templates={LOGO_TEMPLATES} onSelect={handleSelectTemplate} disabled={isLoading} />
        
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-brand-wheat-800 mb-1">Logo Model</label>
          <select
            id="model" value={model} onChange={(e) => setModel(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500"
          >
            {LOGO_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <p className="text-xs text-brand-wheat-600 mt-2">
            {selectedModelInfo?.name} will generate {selectedModelInfo?.concepts} concept{selectedModelInfo?.concepts !== 1 ? 's' : ''}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="style" className="block text-sm font-medium text-brand-wheat-800 mb-1">Style *</label>
                <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                    {LOGO_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
             <div>
              <label htmlFor="colors" className="block text-sm font-medium text-brand-wheat-800 mb-1">Colors *</label>
              <input type="text" id="colors" value={colors} onChange={(e) => setColors(e.target.value)} disabled={isLoading} placeholder="e.g., navy blue, silver, white" className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500" />
            </div>
        </div>
        
        <button onClick={handleGenerate} disabled={isLoading || !companyName.trim() || !description.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Generating...' : 'Generate Logos'}
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
          <h3 className="text-xl font-semibold mb-4">Logo Concepts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <InteractiveResultCard key={index} item={{ id: `${index}`, timestamp: Date.now(), type: 'logo', ...result}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}