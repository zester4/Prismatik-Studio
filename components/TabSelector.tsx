import React, { ReactElement, useContext, useState, useRef, useEffect } from 'react';
import { GenerationMode } from '../types';
import { PersonaContext } from '../context/PersonaContext';
import { PERSONA_ICONS } from '../constants';

interface TabSelectorProps {
  selectedMode: GenerationMode;
  onSelectMode: (mode: GenerationMode) => void;
  onOpenPersonaHub: () => void;
}

const useOutsideClick = (ref: React.RefObject<any>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

// --- ICONS ---
const ImageIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> );
const VideoIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> );
const StoryIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> );
const ArticleIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> );
const LogoIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> );
const AdIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg> );
const CampaignIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> );
const PodcastIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> );
const TTSIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg> );
const GalleryIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> );
const ProfileIco: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const ChevronDown: React.FC<{className: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg> );

const toolCategories = [
    { name: 'Visuals', modes: [ { mode: GenerationMode.IMAGE, label: 'Image', Icon: ImageIco }, { mode: GenerationMode.VIDEO, label: 'Video', Icon: VideoIco }, { mode: GenerationMode.LOGO, label: 'Logo', Icon: LogoIco } ] },
    { name: 'Content', modes: [ { mode: GenerationMode.STORY, label: 'Story', Icon: StoryIco }, { mode: GenerationMode.ARTICLE, label: 'Article', Icon: ArticleIco }, { mode: GenerationMode.PODCAST, label: 'Podcast', Icon: PodcastIco }, { mode: GenerationMode.TTS, label: 'TTS', Icon: TTSIco } ] },
    { name: 'Marketing', modes: [ { mode: GenerationMode.AD, label: 'Ad', Icon: AdIco }, { mode: GenerationMode.CAMPAIGN, label: 'Campaign', Icon: CampaignIco } ] },
];

const DropdownMenu: React.FC<{
    label: string;
    items: { mode: GenerationMode, label: string, Icon: React.ElementType }[];
    selectedMode: GenerationMode;
    onSelectMode: (mode: GenerationMode) => void;
}> = ({ label, items, selectedMode, onSelectMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideClick(dropdownRef, () => setIsOpen(false));

    const isActive = items.some(item => item.mode === selectedMode);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center flex-shrink-0 px-3 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500 ${isActive ? "bg-brand-teal-500 text-white shadow-md" : "bg-white text-brand-wheat-800 hover:bg-brand-wheat-50"}`}>
                <span>{label}</span>
                <ChevronDown className={`w-3 h-3 ml-1.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-xl z-10 p-1 border border-brand-wheat-100">
                    {items.map(({ mode, label, Icon }) => (
                        <button key={mode} onClick={() => { onSelectMode(mode); setIsOpen(false); }} className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md ${selectedMode === mode ? 'bg-brand-teal-50 text-brand-teal-600 font-semibold' : 'text-brand-wheat-800 hover:bg-brand-wheat-50'}`}>
                            <Icon className="w-4 h-4 mr-3" />
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const IconButton: React.FC<{
  label: string;
  Icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
}> = ({ label, Icon, isSelected, onClick }) => {
  const baseClasses = "relative group flex items-center justify-center h-9 w-9 sm:h-10 sm:h-10 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500";
  const selectedClasses = "bg-brand-teal-500 text-white shadow-md";
  const unselectedClasses = "bg-white text-brand-wheat-800 hover:bg-brand-wheat-50";
  return (
    <button onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`} aria-label={label}>
      <Icon className="w-5 h-5 sm:w-6 sm:w-6" />
      <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {label}
      </span>
    </button>
  );
};

export default function TabSelector({ selectedMode, onSelectMode, onOpenPersonaHub }: TabSelectorProps): ReactElement {
  const { activePersona } = useContext(PersonaContext);
  const ActivePersonaIcon = activePersona ? PERSONA_ICONS[activePersona.icon] : PERSONA_ICONS['general'];
  
  return (
    <div className="bg-brand-wheat-100 p-1 rounded-lg flex items-center justify-between gap-1 border border-brand-wheat-200">
      <div className="flex-grow flex items-center gap-2 overflow-x-auto no-scrollbar pr-2">
        {toolCategories.map(category => (
            <DropdownMenu 
                key={category.name}
                label={category.name}
                items={category.modes}
                selectedMode={selectedMode}
                onSelectMode={onSelectMode}
            />
        ))}
        <div className="h-6 w-px bg-brand-wheat-200 mx-1"></div>
        <IconButton 
          label="Gallery" 
          Icon={GalleryIco}
          isSelected={selectedMode === GenerationMode.GALLERY}
          onClick={() => onSelectMode(GenerationMode.GALLERY)}
        />
      </div>
       <div className="flex-shrink-0 flex items-center gap-2">
           <IconButton
            label={activePersona?.name || 'Persona Hub'}
            Icon={ActivePersonaIcon}
            isSelected={false} // This button doesn't represent a "mode"
            onClick={onOpenPersonaHub}
          />
          <IconButton
            label="Profile"
            Icon={ProfileIco}
            isSelected={selectedMode === GenerationMode.PROFILE}
            onClick={() => onSelectMode(GenerationMode.PROFILE)}
          />
       </div>
    </div>
  );
}