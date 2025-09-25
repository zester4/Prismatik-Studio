import React, { useState, useCallback, ReactElement } from 'react';
import { GenerationMode } from './types';
import Header from './components/Header';
import TabSelector from './components/TabSelector';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import StoryGenerator from './components/StoryGenerator';
import ArticleGenerator from './components/ArticleGenerator';
import LogoGenerator from './components/LogoGenerator';
import AdGenerator from './components/AdGenerator';
import CreationGallery from './components/CreationGallery';
import Profile from './components/Profile';
import { HistoryProvider } from './context/HistoryContext';
import HomePage from './components/HomePage';

export default function App(): ReactElement {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.IMAGE);
  const [showStudio, setShowStudio] = useState<boolean>(false);

  const handleModeChange = useCallback((newMode: GenerationMode) => {
    setMode(newMode);
  }, []);

  const renderContent = () => {
    switch (mode) {
      case GenerationMode.IMAGE:
        return <ImageGenerator />;
      case GenerationMode.VIDEO:
        return <VideoGenerator />;
      case GenerationMode.STORY:
        return <StoryGenerator />;
      case GenerationMode.ARTICLE:
        return <ArticleGenerator />;
      case GenerationMode.LOGO:
        return <LogoGenerator />;
      case GenerationMode.AD:
        return <AdGenerator />;
      case GenerationMode.GALLERY:
        return <CreationGallery />;
      case GenerationMode.PROFILE:
        return <Profile />;
      default:
        return <ImageGenerator />;
    }
  };

  if (!showStudio) {
    return <HomePage onStartCreating={() => setShowStudio(true)} />;
  }

  return (
    <HistoryProvider>
      <div className="min-h-screen bg-brand-wheat-100 text-brand-wheat-900">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <TabSelector selectedMode={mode} onSelectMode={handleModeChange} />
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {renderContent()}
            </div>
          </div>
        </main>
        <footer className="text-center py-4 text-brand-wheat-700 text-sm">
          <p>Powered by Google Gemini. Designed with passion.</p>
        </footer>
      </div>
    </HistoryProvider>
  );
}