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
import PodcastGenerator from './PodcastGenerator';
import TTSGenerator from './TTSGenerator';
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

  // FIX: Added handler for onWorkflowAction to pass to CreationGallery.
  const handleWorkflowAction = useCallback((action: string, data: any) => {
    // NOTE: This is a simplified handler. A full implementation would require
    // a mechanism (like context or state lifting) to pass the `data` payload
    // to the target generator to pre-fill its form. For now, it just switches modes.
    console.log("Workflow action triggered:", action, data);

    if (action.includes('-to-video') || action === 'action:extend-video') {
        setMode(GenerationMode.VIDEO);
    } else if (action.includes('-to-story')) {
        setMode(GenerationMode.STORY);
    } else if (action.includes('-to-ad')) {
        setMode(GenerationMode.AD);
    } else if (action.includes('-to-campaign')) {
        setMode(GenerationMode.CAMPAIGN);
    }
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
      case GenerationMode.PODCAST:
        return <PodcastGenerator />;
      case GenerationMode.TTS:
        return <TTSGenerator />;
      case GenerationMode.LOGO:
        return <LogoGenerator />;
      case GenerationMode.AD:
        return <AdGenerator />;
      case GenerationMode.CAMPAIGN:
        return <CampaignGenerator />;
      case GenerationMode.GALLERY:
        return <CreationGallery onWorkflowAction={handleWorkflowAction} />;
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