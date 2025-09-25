import React, { useState, useCallback, ReactElement, useContext } from 'react';
import { generateArticle, generateImages } from '../services/geminiService';
import { HistoryItemArticle, ArticleBlock } from '../types';
import { ARTICLE_TYPES, WRITING_STYLES, CREATIVE_ARTICLE_PROMPTS } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';

type ArticleResult = Omit<HistoryItemArticle, 'id' | 'timestamp' | 'type'>;

const RegenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

export default function ArticleGenerator(): ReactElement {
  const [prompt, setPrompt] = useState<string>('');
  const [articleType, setArticleType] = useState<string>(ARTICLE_TYPES[0].id);
  const [writingStyle, setWritingStyle] = useState<string>(WRITING_STYLES[0].id);
  const [numImages, setNumImages] = useState<number>(2);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRetryable, setIsRetryable] = useState<boolean>(false);
  const [result, setResult] = useState<ArticleResult | null>(null);

  const [imageRegenId, setImageRegenId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const [isSavingPdf, setIsSavingPdf] = useState<boolean>(false);
  const [copyMarkdownText, setCopyMarkdownText] = useState('Copy as Markdown');

  const { addHistoryItem } = useContext(HistoryContext);

  const handleSurpriseMe = useCallback(() => {
    const randomPrompt = CREATIVE_ARTICLE_PROMPTS[Math.floor(Math.random() * CREATIVE_ARTICLE_PROMPTS.length)];
    setPrompt(randomPrompt.topic);
    setArticleType(randomPrompt.type);
    setWritingStyle(randomPrompt.style);
    setNumImages(randomPrompt.images);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic for your article.');
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
      const { title, content } = await generateArticle(prompt, articleType, writingStyle, numImages, onProgress);
      
      const newResult: ArticleResult = { title, content, prompt };
      setResult(newResult);
      
      addHistoryItem({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'article',
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
  }, [prompt, articleType, writingStyle, numImages, addHistoryItem]);

  const handleRegenerateImage = useCallback(async (block: Extract<ArticleBlock, { type: 'image' }>) => {
    if (!result) return;
    setImageRegenId(block.id);
    try {
      const newImageUrls = await generateImages(block.imagePrompt, 1, "16:9", 'none', 'gemini-2.5-flash-image-preview');
      if (newImageUrls.length > 0) {
        const newContent = result.content.map(b => 
            b.id === block.id ? { ...b, imageUrl: newImageUrls[0] } : b
        );
        setResult({ ...result, content: newContent as ArticleBlock[] });
      }
    } catch (e) {
      setError(e instanceof Error ? `Failed to regenerate image: ${e.message}` : 'An unknown error occurred.');
    } finally {
      setImageRegenId(null);
    }
  }, [result]);

  const handleStartEditing = (block: Extract<ArticleBlock, { type: 'heading' | 'paragraph' }>) => {
    setEditingBlockId(block.id);
    setEditText(block.content);
  };

  const handleSaveText = (blockId: string) => {
    if (!result) return;
    const newContent = result.content.map(b => 
        b.id === blockId ? { ...b, content: editText } : b
    );
    setResult({ ...result, content: newContent as ArticleBlock[] });
    setEditingBlockId(null);
  };
  
  const handleSaveAsPdf = async () => {
    if (!result) return;
    setIsSavingPdf(true);
    setError(null);
    try {
      // @ts-ignore - jspdf is loaded from CDN
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentW = pageW - margin * 2;
      let yPos = margin;

      const addPageIfNeeded = (heightNeeded: number) => {
        if (yPos + heightNeeded > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPos = margin;
        }
      };
      
      doc.setFontSize(22);
      addPageIfNeeded(20);
      const titleLines = doc.splitTextToSize(result.title, contentW);
      doc.text(titleLines, margin, yPos);
      yPos += titleLines.length * 10;

      for (const block of result.content) {
          yPos += 5; // spacing
          if (block.type === 'heading') {
              doc.setFontSize(16);
              addPageIfNeeded(15);
              const lines = doc.splitTextToSize(block.content, contentW);
              doc.text(lines, margin, yPos);
              yPos += lines.length * 7;
          } else if (block.type === 'paragraph') {
              doc.setFontSize(12);
              addPageIfNeeded(10);
              const lines = doc.splitTextToSize(block.content, contentW);
              doc.text(lines, margin, yPos);
              yPos += lines.length * 5;
          } else if (block.type === 'image') {
              const img = new Image();
              img.src = block.imageUrl;
              await new Promise(resolve => img.onload = resolve);
              
              const aspect = img.width / img.height;
              const imgW = contentW;
              const imgH = imgW / aspect;
              addPageIfNeeded(imgH + 5);
              doc.addImage(block.imageUrl, 'JPEG', margin, yPos, imgW, imgH);
              yPos += imgH + 5;
          }
      }

      doc.save(`${result.title.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      setError(e instanceof Error ? `Failed to save PDF: ${e.message}` : 'An unknown error occurred while saving PDF.');
    } finally {
      setIsSavingPdf(false);
    }
  };
  
  const handleCopyAsMarkdown = () => {
    if (!result) return;
    let markdown = `# ${result.title}\n\n`;
    result.content.forEach(block => {
      if (block.type === 'heading') {
        markdown += `## ${block.content}\n\n`;
      } else if (block.type === 'paragraph') {
        markdown += `${block.content}\n\n`;
      } else if (block.type === 'image') {
        markdown += `![${block.imagePrompt}](${block.imageUrl})\n\n`;
      }
    });
    navigator.clipboard.writeText(markdown);
    setCopyMarkdownText('Copied!');
    setTimeout(() => setCopyMarkdownText('Copy as Markdown'), 2000);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Article Generator</h2>
        <button onClick={handleSurpriseMe} disabled={isLoading} className="flex items-center text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50 self-start sm:self-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
          Surprise Me
        </button>
      </div>
      <div className="space-y-6">
        <PromptInput 
          prompt={prompt} 
          setPrompt={setPrompt} 
          placeholder="e.g., The history and impact of the printing press."
          disabled={isLoading}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="articleType" className="block text-sm font-medium text-brand-wheat-800 mb-1">Article Type</label>
              <select id="articleType" value={articleType} onChange={(e) => setArticleType(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                {ARTICLE_TYPES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="writingStyle" className="block text-sm font-medium text-brand-wheat-800 mb-1">Writing Style</label>
              <select id="writingStyle" value={writingStyle} onChange={(e) => setWritingStyle(e.target.value)} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                {WRITING_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="numImages" className="block text-sm font-medium text-brand-wheat-800 mb-1">Number of Images</label>
              <select id="numImages" value={numImages} onChange={(e) => setNumImages(Number(e.target.value))} disabled={isLoading} className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
        </div>
        
        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
          {isLoading && <LoadingSpinner />}
          {isLoading ? 'Generating Article...' : 'Generate Article'}
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center p-3 bg-blue-100 text-blue-800 rounded-md">
          <p className="font-semibold">Generation in progress...</p>
          <p className="text-sm">{progress || "This may take a moment. Please be patient."}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md flex justify-between items-center">
          <span>{error}</span>
          {isRetryable && !isLoading && (
            <button onClick={handleGenerate} className="font-semibold text-sm bg-red-200 hover:bg-red-300 px-3 py-1 rounded-md">Retry</button>
          )}
        </div>
      )}
      
      {result && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-xl font-semibold">Your Article</h3>
            <div className="flex gap-2 self-start sm:self-center flex-wrap">
              <button onClick={handleSaveAsPdf} disabled={isLoading || isSavingPdf} className="flex items-center justify-center bg-brand-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300">{isSavingPdf && <LoadingSpinner />}{isSavingPdf ? 'Saving...' : 'Save as PDF'}</button>
              <button onClick={handleCopyAsMarkdown} disabled={isLoading} className="flex items-center justify-center bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 disabled:bg-gray-400">{copyMarkdownText}</button>
            </div>
          </div>
          <div className="bg-brand-wheat-50 rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
            <h2 className="text-3xl font-bold text-brand-wheat-900 border-b-2 border-brand-wheat-200 pb-4">{result.title}</h2>
            {result.content.map(block => (
              <div key={block.id}>
                {block.type === 'heading' && (
                  <div>
                    {editingBlockId === block.id ? (
                      <div className="flex items-start gap-2">
                         <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-2 rounded-md border border-brand-wheat-300 bg-white text-2xl font-bold" rows={2}/>
                         <button onClick={() => handleSaveText(block.id)} className="flex-shrink-0 flex items-center gap-1 text-sm bg-brand-teal-500 text-white px-3 py-2 rounded-md font-semibold"><SaveIcon /> Save</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <h3 className="text-2xl font-bold text-brand-wheat-800">{block.content}</h3>
                        <button onClick={() => handleStartEditing(block)} className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm text-brand-wheat-600 hover:text-brand-wheat-800 font-semibold"><EditIcon /> Edit</button>
                      </div>
                    )}
                  </div>
                )}
                {block.type === 'paragraph' && (
                  <div>
                     {editingBlockId === block.id ? (
                      <div className="flex items-start gap-2">
                         <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-2 rounded-md border border-brand-wheat-300 bg-white leading-relaxed" rows={6}/>
                         <button onClick={() => handleSaveText(block.id)} className="flex-shrink-0 flex items-center gap-1 text-sm bg-brand-teal-500 text-white px-3 py-2 rounded-md font-semibold"><SaveIcon /> Save</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <p className="text-brand-wheat-800 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                        <button onClick={() => handleStartEditing(block)} className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-sm text-brand-wheat-600 hover:text-brand-wheat-800 font-semibold self-start"><EditIcon /></button>
                      </div>
                    )}
                  </div>
                )}
                {block.type === 'image' && (
                  <div className="relative group my-4">
                    <img src={block.imageUrl} alt={block.imagePrompt} className="w-full rounded-lg object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                      <button onClick={() => handleRegenerateImage(block)} disabled={imageRegenId !== null} className="text-white text-sm font-bold bg-black bg-opacity-60 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 disabled:opacity-50"><RegenerateIcon /> Regenerate</button>
                    </div>
                    {imageRegenId === block.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg"><LoadingSpinner /><span className="text-white ml-2">Regenerating...</span></div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}