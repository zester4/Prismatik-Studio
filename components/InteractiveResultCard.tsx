import React, { ReactElement, useState, useCallback, useContext } from 'react';
import { HistoryItem, HistoryItemImage, HistoryItemVideo, HistoryItemStory, HistoryItemLogo, HistoryItemAd, HistoryItemArticle, ArticleBlock, HistoryItemCampaign, HistoryItemPodcast } from '../types';
import { IMAGE_MODELS, VIDEO_MODELS } from '../constants';
import ImageModal from './ImageModal';
import StoryModal from './StoryModal';
import ArticleModal from './ArticleModal';
import CampaignModal from './CampaignModal';
import { HistoryContext } from '../context/HistoryContext';

interface InteractiveResultCardProps {
  item: HistoryItem;
}

const getModelName = (id: string) => {
    const model = IMAGE_MODELS.find(m => m.id === id);
    if (model) return model.name;
    if (id === 'gemini-2.5-flash-image-preview' || id === 'gemini-2.5-flash-image') return 'Gemini 2.5 Flash';
    return id;
}

const getVideoModelName = (id: string | undefined): string => {
    if (!id) return 'Veo';
    const model = VIDEO_MODELS.find(m => m.id === id);
    return model ? model.name : 'Veo';
}

const getStyleName = (id: string) => {
    if (id === 'edit') return 'Edit';
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const StarIconFilled: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const StarIconOutline: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);


const InteractiveResultCard: React.FC<InteractiveResultCardProps> = ({ item }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Prompt');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const { favoritePrompts, addFavoritePrompt, removeFavoritePrompt } = useContext(HistoryContext);
  
  const isFavorited = favoritePrompts.includes(item.prompt);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening when clicking the star
    if (isFavorited) {
      removeFavoritePrompt(item.prompt);
    } else {
      addFavoritePrompt(item.prompt);
    }
  }, [isFavorited, item.prompt, addFavoritePrompt, removeFavoritePrompt]);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(item.prompt);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy Prompt'), 2000);
  }, [item.prompt]);

  const handleCopyGenericText = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleDownload = useCallback(() => {
    if (item.type === 'story' || item.type === 'article' || item.type === 'campaign') return;

    const link = document.createElement('a');
    let href = '';
    let promptForFilename = item.prompt;
    let fileExtension = 'jpg';
    
    if (item.type === 'image') {
        href = (item as HistoryItemImage).imageUrl;
    } else if (item.type === 'logo') {
        const logoItem = item as HistoryItemLogo;
        href = logoItem.imageUrl;
        promptForFilename = logoItem.companyName;
    } else if (item.type === 'video') {
        href = (item as HistoryItemVideo).videoUrl;
        fileExtension = 'mp4';
    } else if (item.type === 'ad') {
        const adItem = item as HistoryItemAd;
        href = adItem.mediaUrl;
        promptForFilename = adItem.productName;
        fileExtension = adItem.adType === 'video' ? 'mp4' : 'jpg';
    } else if (item.type === 'podcast') {
        href = (item as HistoryItemPodcast).audioUrl;
        fileExtension = 'wav';
    }
    
    link.href = href;
    const fileName = `${promptForFilename.substring(0, 20).replace(/\s+/g, '_')}_${item.id.substring(0, 4)}.${fileExtension}`;

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [item]);

  const openImageModal = () => {
    if (item.type === 'image' || item.type === 'logo') {
      setIsImageModalOpen(true);
    }
  };
  const closeImageModal = () => setIsImageModalOpen(false);
  
  const openStoryModal = () => {
    if (item.type === 'story') {
      setIsStoryModalOpen(true);
    }
  };
  const closeStoryModal = () => setIsStoryModalOpen(false);
  
  const openArticleModal = () => {
    if (item.type === 'article') {
      setIsArticleModalOpen(true);
    }
  };
  const closeArticleModal = () => setIsArticleModalOpen(false);

  const openCampaignModal = () => {
    if (item.type === 'campaign') {
      setIsCampaignModalOpen(true);
    }
  };
  const closeCampaignModal = () => setIsCampaignModalOpen(false);


  if (item.type === 'campaign') {
    return (
      <>
        <div className="bg-brand-wheat-50 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl flex flex-col">
          <div className="relative group cursor-pointer" onClick={openCampaignModal}>
            <img src={item.heroImage} alt={item.brandIdentity.companyName} className="w-full object-cover" style={{aspectRatio: '16/9'}} />
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-bold bg-black bg-opacity-60 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">View Campaign</span>
             </div>
             <button onClick={handleToggleFavorite} title={isFavorited ? "Remove from favorites" : "Add to favorites"} className="absolute top-2 left-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                {isFavorited ? <StarIconFilled className="w-5 h-5 text-yellow-400" /> : <StarIconOutline className="w-5 h-5" />}
             </button>
             <div className="absolute top-2 right-2 bg-brand-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Campaign
             </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h4 className="text-lg font-bold text-brand-wheat-900">{item.brandIdentity.companyName}</h4>
            <p className="text-sm text-brand-wheat-700 leading-relaxed flex-grow mt-2">"{item.prompt}"</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={handleCopyPrompt} className="text-sm w-full bg-brand-wheat-100 hover:bg-brand-wheat-200 text-brand-wheat-800 font-semibold py-2 px-3 rounded-md transition duration-200">
                {copyButtonText === 'Copied!' ? 'Copied!' : 'Copy Brief'}
              </button>
              <button onClick={openCampaignModal} className="text-sm w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200">
                View Campaign
              </button>
            </div>
          </div>
        </div>
        {isCampaignModalOpen && (
          <CampaignModal campaign={item} onClose={closeCampaignModal} />
        )}
      </>
    );
  }

  if (item.type === 'story') {
    return (
      <>
        <div className="bg-brand-wheat-50 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl flex flex-col">
          <div className="relative group cursor-pointer" onClick={openStoryModal}>
            <img src={item.scenes[0].imageUrl} alt={item.prompt} className="w-full object-cover" style={{aspectRatio: item.aspectRatio.replace(':', '/')}} />
             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-bold bg-black bg-opacity-60 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">View Story</span>
             </div>
             <button onClick={handleToggleFavorite} title={isFavorited ? "Remove from favorites" : "Add to favorites"} className="absolute top-2 left-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                {isFavorited ? <StarIconFilled className="w-5 h-5 text-yellow-400" /> : <StarIconOutline className="w-5 h-5" />}
             </button>
             <div className="absolute top-2 right-2 bg-brand-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Story - {item.scenes.length} Scenes
             </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <p className="text-sm text-brand-wheat-700 leading-relaxed flex-grow">"{item.prompt}"</p>
             <div className="text-xs text-brand-wheat-500 mt-3 pt-3 border-t border-brand-wheat-200">
                <span>Model: <strong>Story AI</strong> | Aspect: <strong>{item.aspectRatio}</strong></span>
             </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={handleCopyPrompt} className="text-sm w-full bg-brand-wheat-100 hover:bg-brand-wheat-200 text-brand-wheat-800 font-semibold py-2 px-3 rounded-md transition duration-200">
                {copyButtonText}
              </button>
              <button onClick={openStoryModal} className="text-sm w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200">
                View Story
              </button>
            </div>
          </div>
        </div>
        {isStoryModalOpen && (
          <StoryModal scenes={item.scenes} onClose={closeStoryModal} />
        )}
      </>
    );
  }

  if (item.type === 'article') {
    const firstImage = item.content.find(block => block.type === 'image') as Extract<ArticleBlock, { type: 'image' }> | undefined;
    const firstParagraph = item.content.find(block => block.type === 'paragraph') as Extract<ArticleBlock, { type: 'paragraph' }> | undefined;

    return (
      <>
        <div className="bg-brand-wheat-50 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl flex flex-col">
          {firstImage && (
            <div className="relative group cursor-pointer" onClick={openArticleModal}>
              <img src={firstImage.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-bold bg-black bg-opacity-60 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">View Article</span>
              </div>
               <button onClick={handleToggleFavorite} title={isFavorited ? "Remove from favorites" : "Add to favorites"} className="absolute top-2 left-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                {isFavorited ? <StarIconFilled className="w-5 h-5 text-yellow-400" /> : <StarIconOutline className="w-5 h-5" />}
             </button>
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow">
            <h4 className="text-lg font-bold text-brand-wheat-900">{item.title}</h4>
            {firstParagraph && <p className="text-sm text-brand-wheat-700 mt-2 line-clamp-3">{firstParagraph.content}</p>}
            <div className="flex-grow"></div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={handleCopyPrompt} className="text-sm w-full bg-brand-wheat-100 hover:bg-brand-wheat-200 text-brand-wheat-800 font-semibold py-2 px-3 rounded-md transition duration-200">
                {copyButtonText === 'Copied!' ? 'Copied!' : 'Copy Topic'}
              </button>
              <button onClick={openArticleModal} className="text-sm w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200">
                View Article
              </button>
            </div>
          </div>
        </div>
        {isArticleModalOpen && (
          <ArticleModal article={item} onClose={closeArticleModal} />
        )}
      </>
    );
  }

  if (item.type === 'ad') {
    const adItem = item as HistoryItemAd;
    return (
       <div className="bg-brand-wheat-50 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl flex flex-col">
          <div className="relative group">
            {adItem.adType === 'image' ? (
                <img src={adItem.mediaUrl} alt={adItem.productName} className="w-full object-cover" style={{aspectRatio: '1.91/1'}} />
            ) : (
                <video src={adItem.mediaUrl} controls autoPlay loop muted className="w-full" style={{aspectRatio: '16/9'}}/>
            )}
             <button onClick={handleToggleFavorite} title={isFavorited ? "Remove from favorites" : "Add to favorites"} className="absolute top-2 left-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                {isFavorited ? <StarIconFilled className="w-5 h-5 text-yellow-400" /> : <StarIconOutline className="w-5 h-5" />}
             </button>
             <div className="absolute top-2 right-2 bg-brand-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {adItem.adType === 'image' ? 'Image Ad' : 'Video Ad'}
             </div>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h4 className="text-lg font-bold text-brand-wheat-900">{adItem.productName}</h4>
            <div className="mt-4 space-y-3">
                <div>
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-brand-wheat-600 uppercase">Headline</label>
                        <button onClick={() => handleCopyGenericText(adItem.adCopy.headline)} className="text-xs font-bold text-brand-teal-600 hover:underline">COPY</button>
                    </div>
                    <p className="text-base font-semibold text-brand-wheat-800 mt-1">{adItem.adCopy.headline}</p>
                </div>
                 <div>
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-brand-wheat-600 uppercase">Body</label>
                        <button onClick={() => handleCopyGenericText(adItem.adCopy.body)} className="text-xs font-bold text-brand-teal-600 hover:underline">COPY</button>
                    </div>
                    <p className="text-sm text-brand-wheat-700 mt-1">{adItem.adCopy.body}</p>
                </div>
                 <div>
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-brand-wheat-600 uppercase">Call to Action</label>
                        <button onClick={() => handleCopyGenericText(adItem.adCopy.cta)} className="text-xs font-bold text-brand-teal-600 hover:underline">COPY</button>
                    </div>
                    <p className="text-sm font-semibold bg-brand-wheat-100 inline-block px-2 py-1 rounded mt-1">{adItem.adCopy.cta}</p>
                </div>
            </div>
          </div>
           <div className="p-4 mt-auto border-t border-brand-wheat-100">
             <button onClick={handleDownload} className="text-sm w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200">
                Download Ad Media
            </button>
           </div>
        </div>
    );
  }

  if (item.type === 'podcast') {
    return (
      <div className="bg-brand-wheat-50 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl flex flex-col">
        <div className="p-4 flex flex-col flex-grow">
            <div className="relative group bg-brand-wheat-900 p-6 rounded-lg flex items-center justify-center aspect-video">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                 <div className="absolute top-2 right-2 bg-brand-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Podcast
                 </div>
                 <button onClick={handleToggleFavorite} title={isFavorited ? "Remove from favorites" : "Add to favorites"} className="absolute top-2 left-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                    {isFavorited ? <StarIconFilled className="w-5 h-5 text-yellow-400" /> : <StarIconOutline className="w-5 h-5" />}
                </button>
            </div>
            <audio controls src={item.audioUrl} className="w-full mt-4"></audio>
            <p className="text-sm text-brand-wheat-700 leading-relaxed flex-grow mt-4">
                "{item.prompt}"
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={handleCopyPrompt} className="text-sm w-full bg-brand-wheat-100 hover:bg-brand-wheat-200 text-brand-wheat-800 font-semibold py-2 px-3 rounded-md transition duration-200">
                {copyButtonText}
              </button>
              <button onClick={handleDownload} className="text-sm w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200">
                Download
              </button>
            </div>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="bg-brand-wheat-50 rounded-xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl flex flex-col">
        {item.type === 'image' || item.type === 'logo' ? (
           <div className="relative group cursor-pointer" onClick={openImageModal}>
            <img src={item.imageUrl} alt={item.prompt} className="w-full object-cover" style={{aspectRatio: item.type === 'image' ? item.aspectRatio.replace(':', '/') : '1/1'}} />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300 transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
             <button onClick={handleToggleFavorite} title={isFavorited ? "Remove from favorites" : "Add to favorites"} className="absolute top-2 left-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                {isFavorited ? <StarIconFilled className="w-5 h-5 text-yellow-400" /> : <StarIconOutline className="w-5 h-5" />}
             </button>
             {item.type === 'image' && item.isEdit && (
                <div className="absolute top-2 right-2 bg-brand-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                    Edited
                </div>
            )}
            {item.type === 'logo' && (
                <div className="absolute top-2 right-2 bg-brand-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Logo
                </div>
            )}
          </div>
        ) : (
          <div className="relative group bg-black">
            <video src={item.videoUrl} controls autoPlay loop muted className="w-full" style={{aspectRatio: item.aspectRatio.replace(':', '/')}}/>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <PlayIcon className="h-16 w-16 text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
            </div>
            <button onClick={handleToggleFavorite} title={isFavorited ? "Remove from favorites" : "Add to favorites"} className="absolute top-2 left-2 z-10 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                {isFavorited ? <StarIconFilled className="w-5 h-5 text-yellow-400" /> : <StarIconOutline className="w-5 h-5" />}
            </button>
            <div className="absolute top-2 right-2 bg-brand-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Video
            </div>
          </div>
        )}
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-sm text-brand-wheat-700 leading-relaxed flex-grow">
            {item.type === 'logo' ? <strong>{item.companyName}</strong> : `"${item.prompt}"`}
          </p>
          <div className="text-xs text-brand-wheat-500 mt-3 pt-3 border-t border-brand-wheat-200">
            {item.type === 'image' && <span>Model: <strong>{getModelName(item.model)}</strong> | Style: <strong>{getStyleName(item.style)}</strong> | Aspect: <strong>{item.aspectRatio}</strong></span>}
            {item.type === 'video' && <span>Model: <strong>{getVideoModelName(item.model)}</strong> | Aspect: <strong>{item.aspectRatio}</strong></span>}
            {item.type === 'logo' && <span>Style: <strong>{getStyleName(item.style)}</strong> | Prompt: "{item.prompt}"</span>}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button onClick={handleCopyPrompt} className="text-sm w-full bg-brand-wheat-100 hover:bg-brand-wheat-200 text-brand-wheat-800 font-semibold py-2 px-3 rounded-md transition duration-200">
              {copyButtonText}
            </button>
            <button onClick={handleDownload} className="text-sm w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200">
              Download
            </button>
          </div>
        </div>
      </div>
      {(isImageModalOpen && (item.type === 'image' || item.type === 'logo')) && (
        <ImageModal imageUrl={item.imageUrl} onClose={closeImageModal} />
      )}
    </>
  );
};

export default InteractiveResultCard;