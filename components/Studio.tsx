import React, { useState, useCallback, ReactElement } from 'react';
import { GenerationMode } from '../types';
import Header from './Header';
import TabSelector from './TabSelector';
import ImageGenerator from './ImageGenerator';
import VideoGenerator from './VideoGenerator';
import StoryGenerator from './StoryGenerator';
import ArticleGenerator from './ArticleGenerator';
import LogoGenerator from './LogoGenerator';
import AdGenerator from './AdGenerator';
import CampaignGenerator from './CampaignGenerator';
import CreationGallery from './CreationGallery';
import Profile from './Profile';
import PersonaHub from './PersonaHub';
import { HistoryProvider } from '../context/HistoryContext';
import { PersonaProvider } from '../context/PersonaContext';

function StudioContent(): ReactElement {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.IMAGE);
  const [isPersonaHubOpen, setIsPersonaHubOpen] = useState(false);

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
      case GenerationMode.CAMPAIGN:
        return <CampaignGenerator />;
      case GenerationMode.GALLERY:
        return <CreationGallery />;
      case GenerationMode.PROFILE:
        return <Profile />;
      default:
        return <ImageGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-wheat-100 text-brand-wheat-900 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <TabSelector 
            selectedMode={mode} 
            onSelectMode={handleModeChange}
            onOpenPersonaHub={() => setIsPersonaHubOpen(true)}
          />
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-4 sm:p-8">
            {renderContent()}
          </div>
        </div>
      </main>
      {isPersonaHubOpen && <PersonaHub onClose={() => setIsPersonaHubOpen(false)} />}
    </div>
  );
}

export default function Studio(): ReactElement {
    return (
      <HistoryProvider>
        <PersonaProvider>
          <StudioContent />
        </PersonaProvider>
      </HistoryProvider>
    )
}