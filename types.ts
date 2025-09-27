import { ReactElement } from "react";

export enum GenerationMode {
  IMAGE = 'image',
  VIDEO = 'video',
  STORY = 'story',
  ARTICLE = 'article',
  LOGO = 'logo',
  AD = 'ad',
  CAMPAIGN = 'campaign',
  GALLERY = 'gallery',
  PROFILE = 'profile',
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface HistoryItemBase {
  id: string;
  timestamp: number;
  prompt: string;
}

export interface HistoryItemImage extends HistoryItemBase {
  type: 'image';
  imageUrl: string;
  model: string;
  style: string;
  aspectRatio: AspectRatio;
  isEdit?: boolean;
}

export interface HistoryItemVideo extends HistoryItemBase {
  type: 'video';
  videoUrl: string; // This will be a blob URL, not persistent across sessions
  aspectRatio: AspectRatio;
  model: string;
}

export interface StoryScene {
  imageUrl: string;
  text: string;
  imagePrompt: string;
}

export interface HistoryItemStory extends HistoryItemBase {
  type: 'story';
  scenes: StoryScene[];
  aspectRatio: AspectRatio;
}

export interface HistoryItemLogo extends HistoryItemBase {
    type: 'logo';
    imageUrl: string;
    model: string;
    style: string;
    companyName: string;
}

export interface AdCopy {
  headline: string;
  body: string;
  cta: string;
}

export interface HistoryItemAd extends HistoryItemBase {
  type: 'ad';
  adType: 'image' | 'video';
  mediaUrl: string; // Can be image data URL or video blob URL
  productName: string;
  adCopy: AdCopy;
}

export type ArticleBlock =
  | { id: string; type: 'heading'; content: string }
  | { id: string; type: 'paragraph'; content: string }
  | { id: string; type: 'image'; imageUrl: string; imagePrompt: string };

export interface HistoryItemArticle extends HistoryItemBase {
  type: 'article';
  title: string;
  content: ArticleBlock[];
}

export interface BrandIdentity {
  companyName: string;
  colors: string[];
  mood: string[];
  keywords: string[];
  targetAudience: string;
}

export interface HistoryItemCampaign extends HistoryItemBase {
  type: 'campaign';
  brandIdentity: BrandIdentity;
  logos: string[];
  heroImage: string;
  adCopy: AdCopy;
  socialVideoUrl: string; // This will be a blob URL
}


export type HistoryItem = HistoryItemImage | HistoryItemVideo | HistoryItemStory | HistoryItemLogo | HistoryItemAd | HistoryItemArticle | HistoryItemCampaign;

// --- Persona Hub Types ---
export type PersonaIconName = 'general' | 'social' | 'writer' | 'formal' | 'creative' | 'technical' | 'marketing';

export interface Persona {
  id: string;
  name: string;
  description: string;
  icon: PersonaIconName;
  systemInstruction: string;
}