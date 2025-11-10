import React from 'react';
import { AspectRatio, Persona } from './types';

// --- ICONS for Personas ---
// FIX: Converted JSX to React.createElement to be valid in a .ts file.
const GeneralIcon: React.FC<{className: string}> = ({className}) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22l-.648-1.437a3.375 3.375 0 00-2.6-2.6L12 17.25l1.438-.648a3.375 3.375 0 002.6-2.6L17 12.75l.648 1.437a3.375 3.375 0 002.6 2.6l1.438.648-1.438.648a3.375 3.375 0 00-2.6 2.6z" })
    )
);
const SocialIcon: React.FC<{className: string}> = ({className}) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
    )
);
const WriterIcon: React.FC<{className: string}> = ({className}) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
    )
);
const FormalIcon: React.FC<{className: string}> = ({className}) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" })
    )
);
const CreativeIcon: React.FC<{className: string}> = ({className}) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" })
    )
);
const TechnicalIcon: React.FC<{className: string}> = ({className}) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" })
    )
);
const MarketingIcon: React.FC<{className: string}> = ({className}) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584M9 18l-3.362-3.362" })
    )
);

export const PERSONA_ICONS = {
    general: GeneralIcon,
    social: SocialIcon,
    writer: WriterIcon,
    formal: FormalIcon,
    creative: CreativeIcon,
    technical: TechnicalIcon,
    marketing: MarketingIcon,
};

export const DEFAULT_PERSONAS: Persona[] = [
    {
        id: 'default',
        name: 'General Assistant',
        description: 'A helpful and neutral AI assistant with no special instructions.',
        icon: 'general',
        systemInstruction: '',
    },
    {
        id: 'social-media-manager',
        name: 'Witty Social Media Manager',
        description: 'Generates creative, punchy, and engaging content perfect for social media.',
        icon: 'social',
        systemInstruction: 'You are an expert social media manager. Your tone is witty, informal, and full of clever puns. You specialize in creating short, attention-grabbing copy and visually striking concepts for platforms like Twitter and Instagram. Keep text concise and use emojis where appropriate.',
    },
    {
        id: 'formal-report-writer',
        name: 'Formal Report Writer',
        description: 'Produces structured, professional, and data-driven content suitable for reports and official documents.',
        icon: 'formal',
        systemInstruction: 'You are a professional research assistant. Your tone is formal, objective, and academic. You focus on clarity, structure, and precision. Use professional language and avoid casualisms, slang, or personal opinions. Your primary goal is to present information clearly and logically.',
    },
    {
        id: 'creative-storyteller',
        name: 'Creative Storyteller',
        description: 'Weaves imaginative narratives and rich, descriptive visuals for stories and creative writing.',
        icon: 'writer',
        systemInstruction: "You are a master storyteller. Your tone is imaginative, descriptive, and emotionally resonant. You excel at creating vivid worlds, compelling characters, and engaging plots. Focus on sensory details and creating a strong sense of atmosphere in both your writing and your visual concepts.",
    },
];

export const IMAGE_MODELS = [
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4' },
  { id: 'imagen-4.0-ultra-generate-001', name: 'Imagen 4 Ultra' },
  { id: 'imagen-4.0-fast-generate-001', name: 'Imagen 4 Fast' },
  { id: 'imagen-3.0-generate-002', name: 'Imagen 3.0' },
];

export const VIDEO_MODELS = [
  { id: 'veo-2.0-generate-001', name: 'Veo 2.0' },
  { id: 'veo-3.0-generate-001', name: 'Veo 3.0' },
];

export const TTS_VOICES = [
    { id: 'Zephyr', name: 'Aura (Female, Calm)' },
    { id: 'Puck', name: 'Leo (Male, Upbeat)' },
    { id: 'Charon', name: 'Orion (Male, Deep)' },
    { id: 'Kore', name: 'Nova (Female, Clear)' },
    { id: 'Fenrir', name: 'Jasper (Male, Raspy)' },
];

export const PODCAST_FORMATS = [
    { id: 'discussion', name: 'Roundtable Discussion' },
    { id: 'interview', name: 'Interview' },
    { id: 'solo-monologue', name: 'Solo Monologue' },
    { id: 'documentary', name: 'Documentary Narration' },
];

export const PODCAST_TONES = [
    { id: 'informative', name: 'Informative & Educational' },
    { id: 'humorous', name: 'Humorous & Casual' },
    { id: 'dramatic', name: 'Dramatic & Storytelling' },
    { id: 'professional', name: 'Professional & Corporate' },
    { id: 'inspirational', name: 'Inspirational' },
];

export const PODCAST_DURATIONS = [
    { id: '1 minute', name: 'Short (≈ 1 min)' },
    { id: '2 minutes', name: 'Medium (≈ 2 mins)' },
    { id: '5 minutes', name: 'Long (≈ 5 mins)' },
];


export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

export const VIDEO_ASPECT_RATIOS: AspectRatio[] = ["16:9", "9:16"];

export const IMAGE_STYLES = [
  { id: 'none', name: 'No Style' },
  { id: 'photorealistic', name: 'Photorealistic' },
  { id: 'cinematic', name: 'Cinematic' },
  { id: 'anime', name: 'Anime' },
  { id: 'watercolor', name: 'Watercolor' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: '3d-render', name: '3D Render' },
];

export const LOGO_STYLES = [
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'modern', name: 'Modern' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'abstract', name: 'Abstract' },
  { id: 'mascot', name: 'Mascot' },
  { id: 'hand-drawn', name: 'Hand-drawn' },
];

export const AD_TONES = [
  { id: 'professional', name: 'Professional' },
  { id: 'friendly', name: 'Friendly & Casual' },
  { id: 'humorous', name: 'Humorous & Witty' },
  { id: 'luxury', name: 'Luxury & Premium' },
  { id: 'urgent', name: 'Urgent & Action-Oriented' },
  { id: 'inspirational', name: 'Inspirational' },
  { id: 'playful', name: 'Playful & Fun' },
  { id: 'nostalgic', name: 'Nostalgic & Sentimental' },
  { id: 'authoritative', name: 'Authoritative & Expert' },
  { id: 'educational', name: 'Educational & Informative' },
];

export const LOGO_MODELS = [
  { id: 'imagen-4.0-ultra-generate-001', name: 'Imagen 4 Ultra', concepts: 4 },
  { id: 'gemini-2.5-flash-image-preview', name: 'Gemini 2.5 Flash (Preview)', concepts: 1 },
];

export const ARTICLE_TYPES = [
    { id: 'blog-post', name: 'Blog Post' },
    { id: 'report', name: 'Report' },
    { id: 'essay', name: 'Essay' },
    { id: 'how-to-guide', name: 'How-To Guide' },
    { id: 'product-description', name: 'Product Description' },
    { id: 'research-summary', name: 'Research Summary' },
];

export const WRITING_STYLES = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual & Conversational' },
    { id: 'academic', name: 'Academic & Formal' },
    { id: 'journalistic', name: 'Journalistic' },
    { id: 'storytelling', name: 'Storytelling' },
    { id: 'technical', name: 'Technical & Precise' },
];

export const PROMPT_MAX_LENGTH = 1000;

export const IMAGE_TEMPLATES = [
    {
        title: "Ancient Stone Golem",
        description: "A colossal, mossy golem meditating in a sun-dappled redwood forest.",
        prompt: "Epic fantasy concept art. A colossal, ancient golem, constructed from moss-covered stones and intertwined with glowing blue magical vines, sits meditating in the center of a forgotten, sun-dappled clearing in a redwood forest. Sunlight filters through the massive canopy, creating dramatic god rays. Small, curious forest spirits, resembling tiny, glowing foxes, peek out from behind giant mushrooms.",
        style: 'fantasy',
        negativePrompt: 'blurry, modern elements, text'
    },
    {
        title: "Cyberpunk Night Market",
        description: "A bustling, neon-drenched street market in a futuristic megacity at night.",
        prompt: "A sprawling, cyberpunk megacity street market at night, drenched in neon and perpetual rain. The shot is from a low angle, looking up at towering holographic advertisements that glitch and flicker. A diverse crowd of humans, cyborgs, and aliens bustle through the narrow street, their faces illuminated by the glow of food stalls selling strange, steaming alien cuisine. A lone, trench-coat-wearing android detective leans against a noodle bar, steam rising around them. The atmosphere is dense, moody, and Blade Runner-inspired.",
        style: 'cinematic',
        negativePrompt: 'daytime, bright, clean'
    },
    {
        title: "Surreal Floating Clock",
        description: "A giant, antique grandfather clock floating in a cosmic sea under a nebula-filled sky.",
        prompt: "Surrealism painting. An enormous, antique grandfather clock floating in a calm, cosmic sea under a nebula-filled sky with two moons. The clock face is made of swirling galaxies, and its pendulum is a swinging, caged star. Crystalline whales with translucent skin swim gracefully around the clock, their bodies containing miniature, glowing star systems. The art style should be a mix of Salvador Dalí's dreamlike landscapes and the intricate detail of a Victorian illustration.",
        style: 'fantasy',
        negativePrompt: 'photorealistic, simple, plain background'
    },
    {
        title: "Wizard's Arcane Study",
        description: "A cozy, cluttered Victorian-era study filled with magical objects and books.",
        prompt: "A cozy, cluttered Victorian-era study filled with arcane objects, books, and celestial maps. In the center, a wise old wizard with a long white beard and star-patterned robes is scrying into a crystal ball, which shows a swirling galaxy. The room is lit by candlelight and the magical glow from the orb, casting long, dancing shadows. A black cat with glowing green eyes is curled up asleep on a pile of ancient tomes. The atmosphere is one of warmth, mystery, and ancient knowledge.",
        style: 'watercolor',
        negativePrompt: 'bright lights, modern furniture'
    }
];

export const VIDEO_TEMPLATES = [
    {
        title: "Butterfly Emerging",
        description: "An extreme close-up, slow-motion video of a monarch butterfly emerging from its chrysalis.",
        prompt: "Extreme close-up macro video, slow motion (1000fps). A monarch butterfly emerges from its chrysalis. The delicate, intricate process unfolds in hypnotic detail, from the cracking of the casing to the slow, majestic unfurling of its vibrant orange and black wings. The background is a soft-focus blur of green leaves. The lighting is bright, natural morning sunlight.",
        aspectRatio: '16:9' as AspectRatio
    },
    {
        title: "Futuristic Drone Chase",
        description: "Dynamic, fast-paced drone footage flying through the canyons of a desert planet, chasing a landspeeder.",
        prompt: "Dynamic, fast-paced drone footage flying through the canyons of a futuristic desert planet. The drone chases a sleek, sand-worn landspeeder that kicks up plumes of orange dust. The speeder expertly navigates through towering rock formations carved with ancient alien symbols, occasionally firing its thrusters to make sharp turns. Lens flare from the planet's twin suns.",
        aspectRatio: '16:9' as AspectRatio
    },
    {
        title: "Stop-Motion Mouse Workshop",
        description: "A charming stop-motion animation of a tiny mouse building a miniature flying machine.",
        prompt: "A charming, stop-motion animation of a tiny mouse in a cozy, cluttered workshop, building a miniature flying machine out of matchsticks, bottle caps, and a leaf for a sail. The lighting is warm and comes from a single, tiny lantern. The mouse works diligently, with little puffs of sawdust and expressive movements. The final shot is the mouse triumphantly launching the machine, which glides across the room in a wobbly but successful flight.",
        aspectRatio: '4:3' as AspectRatio
    },
    {
        title: "Aurora Borealis Timelapse",
        description: "A cinematic, breathtaking time-lapse of the Northern Lights over a snow-covered mountain range.",
        prompt: "A cinematic, breathtaking time-lapse of the Northern Lights (Aurora Borealis) over a snow-covered mountain range in Norway. The vibrant greens, pinks, and purples of the aurora dance and swirl across the star-filled sky. The camera slowly pans across the landscape, revealing a frozen lake that reflects the celestial light show.",
        aspectRatio: '16:9' as AspectRatio
    }
];

export const STORY_TEMPLATES = [
    {
        title: "The Time Skipper",
        description: "A master clockmaker notices time itself has begun to skip and must solve the mystery before the city is erased.",
        prompt: "The story of a reclusive horologist (a master clockmaker) living in a rain-soaked, gaslamp-lit city, who is the only person to notice that time itself has begun to skip—a few seconds at first, then whole minutes. He discovers a cryptic symbol appearing on the faces of the city's great clocks just before each skip. He must follow these clues to find the source of the temporal anomaly before the city is erased from time, all while being pursued by shadowy figures who seem to exist outside the normal flow of time.",
        aspectRatio: '4:3' as AspectRatio,
        numberOfScenes: 5,
        textLength: 'medium'
    },
    {
        title: "The Lost Compass",
        description: "A young sky-sailor inherits a compass that points to 'what is lost', leading her on a quest for a mythical island.",
        prompt: "In a world where islands float in the sky on currents of wind, a young sky-sailor inherits a mysterious, sealed compass from her estranged grandmother. The compass doesn't point north; instead, it points towards 'what is lost'. She embarks on a journey aboard her small skyship, following the compass through treacherous sky-storms and past sky-pirate territories, hoping to find her grandmother's long-lost floating island, which is rumored to hold the last garden of magical, starlight-infused flora in the world.",
        aspectRatio: '16:9' as AspectRatio,
        numberOfScenes: 4,
        textLength: 'detailed'
    },
    {
        title: "The Scrapyard Garden",
        description: "A gentle sanitation robot secretly builds a beautiful garden in a vast scrapyard, which is discovered by a curious orphan.",
        prompt: "The story of a decommissioned, gentle-giant of a sanitation robot, designated 'Unit 734', who spends its days secretly building a vibrant, beautiful garden in the middle of a vast, metallic scrapyard. It uses discarded parts to create kinetic sculptures of flowers and mechanical birds. Its quiet existence is disrupted when a curious, tech-savvy orphan girl discovers its hidden oasis. Together, they must protect their secret garden from the scrapyard's automated crushers and the cold corporation that owns the land.",
        aspectRatio: '1:1' as AspectRatio,
        numberOfScenes: 6,
        textLength: 'short'
    },
    {
        title: "The Self-Writing Book",
        description: "A timid archivist finds a blank book that starts writing his story seconds before it happens, and he must learn to influence the narrative.",
        prompt: "A timid archivist working in a colossal, labyrinthine library that contains every book ever written, and every book that *could* be written. One night, he finds a blank book that starts writing a story on its own—his story, but it's describing events that happen seconds before they actually occur. He soon realizes the book is not just predicting his future, but actively writing it, and he must learn to influence the narrative to escape a dark fate the book has planned for him.",
        aspectRatio: '3:4' as AspectRatio,
        numberOfScenes: 4,
        textLength: 'medium'
    },
    {
        title: "The Crystal Cave",
        description: "A young explorer discovers a cave filled with luminous crystals that react to sound.",
        prompt: "A young, intrepid explorer with a headlamp and a backpack stumbles upon a hidden entrance to a cave. Inside, she discovers a massive cavern filled with towering, luminous crystals of all shapes and sizes. The crystals are inert at first, but when she makes a sound—a gasp of awe, a footstep's echo—they pulse with vibrant, colored light in response. She experiments, humming a simple tune that causes the entire cave to light up in a synchronized, breathtaking symphony of color and light, revealing ancient patterns on the cavern walls.",
        aspectRatio: '16:9' as AspectRatio,
        numberOfScenes: 4,
        textLength: 'medium'
    }
];

export const LOGO_TEMPLATES = [
    {
        title: "Stellar Gaze Observatory",
        description: "A modern, scientific brand for an astronomy research and education facility.",
        companyName: "Stellar Gaze Observatory",
        slogan: "Charting the Cosmos",
        prompt: "An educational and research facility focused on astronomy. We provide public access to high-powered telescopes and host lectures on astrophysics. The brand should feel inspiring, scientific, and vast.",
        style: "modern",
        colors: "Deep navy blue, silver, and a hint of glowing cyan"
    },
    {
        title: "The Gilded Page",
        description: "A vintage, intellectual brand for a boutique bookstore specializing in rare books.",
        companyName: "The Gilded Page",
        slogan: "Where Every Book is a Treasure",
        prompt: "A boutique bookstore specializing in rare, vintage, and artisanal hand-bound books. We cater to collectors and passionate readers. The atmosphere is cozy, intellectual, and timeless.",
        style: "vintage",
        colors: "Maroon, gold foil, and cream"
    },
    {
        title: "Terra-Nova Robotics",
        description: "A clean, forward-thinking brand for a tech startup building eco-friendly robots.",
        companyName: "Terra-Nova Robotics",
        slogan: "Building a Better Tomorrow",
        prompt: "A cutting-edge tech startup that designs and builds eco-friendly robots for agriculture and reforestation. Our brand is innovative, clean, and forward-thinking.",
        style: "geometric",
        colors: "Forest green, light grey, and a vibrant orange accent"
    },
    {
        title: "Nyx Apparel",
        description: "A minimalist, futuristic brand for a high-fashion streetwear company.",
        companyName: "Nyx Apparel",
        slogan: "Wear the Night",
        prompt: "A high-fashion streetwear brand inspired by cyberpunk and nocturnal city life. Our designs are edgy, futuristic, and sleek.",
        style: "minimalist",
        colors: "Black, white, and a sharp neon purple"
    }
];

export const AD_TEMPLATES = [
    {
        title: "Aura Smart Mug",
        description: "An ad for a temperature-controlled smart mug targeting tech enthusiasts and coffee lovers.",
        productName: "Aura Smart Mug",
        prompt: "A temperature-controlled smart mug that keeps your coffee or tea at the perfect temperature for hours. Connects to an app to set your ideal heat.",
        audience: "Tech enthusiasts, busy professionals, and coffee/tea lovers.",
        cta: "Never Drink Cold Coffee Again",
        tone: "professional"
    },
    {
        title: "Terra Eco-Backpack",
        description: "An ad for a sustainable backpack made from recycled ocean plastics.",
        productName: "Terra Eco-Backpack",
        prompt: "A stylish and durable backpack made entirely from recycled ocean plastics. Waterproof, lightweight, and designed for the modern adventurer.",
        audience: "Eco-conscious millennials, students, and urban explorers.",
        cta: "Shop Sustainably",
        tone: "inspirational"
    },
    {
        title: "FlowState Headphones",
        description: "An ad for high-end, noise-cancelling headphones for commuters and office workers.",
        productName: "FlowState Noise-Cancelling Headphones",
        prompt: "Immerse yourself in pure audio with our next-gen active noise-cancellation. 40-hour battery life and crystal-clear microphone for calls.",
        audience: "Commuters, open-office workers, and music audiophiles.",
        cta: "Find Your Focus",
        tone: "luxury"
    },
    {
        title: "Gourmet Garden Herb Kit",
        description: "An ad for an automated, self-watering indoor garden kit.",
        productName: "Gourmet Garden Indoor Herb Kit",
        prompt: "Grow fresh, organic herbs right in your kitchen with our automated, self-watering indoor garden. No green thumb required!",
        audience: "Home cooks, apartment dwellers, and healthy-living advocates.",
        cta: "Start Growing Today",
        tone: "friendly"
    }
];

export const ARTICLE_TEMPLATES = [
    {
        title: "Future of Renewable Energy",
        description: "An in-depth report on how renewable energy will reshape cities by 2050.",
        prompt: "An in-depth report on the future of renewable energy, focusing on how solar, wind, and geothermal technologies will reshape urban planning, architecture, and daily life in the cities of 2050.",
        type: 'report',
        style: 'professional',
        images: 3,
    },
    {
        title: "Sourdough Baking Guide",
        description: "A comprehensive, beginner-friendly guide to baking the perfect sourdough bread at home.",
        prompt: "A comprehensive, beginner-friendly guide to baking the perfect sourdough bread at home, covering everything from creating and maintaining a starter to mastering the stretch-and-fold technique and achieving a crispy crust.",
        type: 'how-to-guide',
        style: 'casual',
        images: 4,
    },
    {
        title: "The Benefits of 'Forest Bathing'",
        description: "A narrative-driven blog post exploring the psychological benefits of Shinrin-yoku.",
        prompt: "A narrative-driven blog post exploring the profound psychological and physiological benefits of 'forest bathing' (Shinrin-yoku), blending personal anecdotes with scientific research on how nature reduces stress and improves well-being.",
        type: 'blog-post',
        style: 'storytelling',
        images: 2,
    },
    {
        title: "The Shift to Remote Work",
        description: "A formal essay analyzing the long-term socio-economic effects of the global shift to remote work.",
        prompt: "A formal academic essay analyzing the long-term socio-economic effects of the global shift to remote work, discussing its impact on commercial real estate, urban-rural migration, and the future of corporate culture.",
        type: 'essay',
        style: 'academic',
        images: 1,
    }
];

export const CAMPAIGN_TEMPLATES = [
    {
        title: "Noise-Cancelling Headphones",
        description: "Launch campaign for 'Aether,' minimalist headphones for remote workers and students.",
        prompt: "I'm launching 'Aether,' a new brand of noise-cancelling headphones for focus and productivity. The target audience is remote workers and students. The vibe should be minimalist, modern, and calm. I need a full campaign: logo, hero image for the website, ad copy, and a short social video."
    },
    {
        title: "Rustic Italian Restaurant",
        description: "Branding package for 'The Crimson Fork,' a new farm-to-table Italian restaurant.",
        prompt: "I'm opening 'The Crimson Fork,' a new Italian restaurant focused on rustic, farm-to-table dining. The atmosphere should be warm, inviting, and authentic. I need a branding package including logos, a hero image of our signature pasta dish, ad copy for local newspapers, and a short video tour of the restaurant's cozy interior."
    },
    {
        title: "Eco-Friendly Backpacks",
        description: "Launch campaign for 'Terra,' a new line of sustainable backpacks made from recycled materials.",
        prompt: "We're releasing 'Terra,' a new line of sustainable, eco-friendly backpacks made from recycled materials. The brand should feel adventurous, natural, and responsible. I need a campaign to launch the product: logos, a hero image of the backpack on a mountain trail, ad copy for social media, and a video showing the backpack in use in nature."
    },
    {
        title: "Pet Adoption App",
        description: "Launch kit for 'Pixel Paws,' a mobile app that uses AI to match pets with owners.",
        prompt: "Announcing 'Pixel Paws,' a mobile app for pet adoption that uses AI to match pets with owners. The brand identity should be friendly, tech-savvy, and heartwarming. I need a complete launch kit: logos, a hero image for the app store, ad copy for online ads, and a short, animated video explaining how the app works."
    },
];

export const PODCAST_TEMPLATES = [
    {
        title: "Tech News Roundup",
        description: "A 5-minute, two-host podcast discussing the latest in AI and gadget news.",
        prompt: "A 5-minute podcast with two hosts, 'Alex' and 'Ben', discussing the latest news in AI and consumer tech. The tone should be enthusiastic and informative."
    },
    {
        title: "History of Coffee",
        description: "A short, solo-narrated documentary on the origins of coffee.",
        prompt: "A short documentary-style podcast about the history of coffee, from its discovery in Ethiopia to its global spread. The narrator should have a calm, engaging voice."
    },
    {
        title: "True Crime: The Missing Starlet",
        description: "A dramatic true crime episode about a fictional Hollywood mystery.",
        prompt: "A 10-minute true crime podcast episode about the mysterious disappearance of a fictional 1940s Hollywood actress named 'Vera Sterling'. Include a main narrator and a second voice for reading quotes."
    },
    {
        title: "Guided Meditation",
        description: "A 5-minute guided meditation for relaxation and focus.",
        prompt: "A 5-minute guided meditation session. The narrator should speak slowly and calmly, guiding the listener through breathing exercises for relaxation."
    },
];
