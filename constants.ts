import { AspectRatio } from './types';

export const IMAGE_MODELS = [
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4' },
  { id: 'imagen-4.0-ultra-generate-001', name: 'Imagen 4 Ultra' },
  { id: 'imagen-4.0-fast-generate-001', name: 'Imagen 4 Fast' },
  { id: 'imagen-3.0-generate-002', name: 'Imagen 3.0' },
  { id: 'gemini-2.5-flash-image-preview', name: 'Gemini 2.5 Flash (Preview)' },
];

export const VIDEO_MODELS = [
  { id: 'veo-2.0-generate-001', name: 'Veo 2.0' },
  { id: 'veo-3.0-generate-001', name: 'Veo 3.0' },
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

export const CREATIVE_IMAGE_PROMPTS = [
    "Epic fantasy concept art. A colossal, ancient golem, constructed from moss-covered stones and intertwined with glowing blue magical vines, sits meditating in the center of a forgotten, sun-dappled clearing in a redwood forest. Sunlight filters through the massive canopy, creating dramatic god rays that illuminate floating dust motes. Small, curious forest spirits, resembling tiny, glowing foxes, peek out from behind giant mushrooms. The style should be highly detailed, reminiscent of Studio Ghibli's environmental art, with cinematic lighting and a wide-angle shot to capture the scale.",
    "A sprawling, cyberpunk megacity street market at night, drenched in neon and perpetual rain. The shot is from a low angle, looking up at towering holographic advertisements that glitch and flicker. A diverse crowd of humans, cyborgs, and aliens bustle through the narrow street, their faces illuminated by the glow of food stalls selling strange, steaming alien cuisine. A lone, trench-coat-wearing android detective leans against a noodle bar, steam rising around them. The atmosphere is dense, moody, and Blade Runner-inspired. Ultra-realistic, 8k resolution, cinematic color grading with deep blues and vibrant pinks.",
    "Surrealism painting. An enormous, antique grandfather clock floating in a calm, cosmic sea under a nebula-filled sky with two moons. The clock face is made of swirling galaxies, and its pendulum is a swinging, caged star. Crystalline whales with translucent skin swim gracefully around the clock, their bodies containing miniature, glowing star systems. The art style should be a mix of Salvador Dalí's dreamlike landscapes and the intricate detail of a Victorian illustration. Ethereal, magical lighting.",
    "Photorealistic macro shot of a single drop of dew on a spider's web. Inside the droplet, the entire surrounding forest landscape is refracted in perfect, miniature detail. The delicate strands of the web are covered in even smaller micro-droplets, shimmering with rainbow colors in the soft morning light. The focus is razor-sharp on the main droplet, with the background beautifully blurred. A testament to the beauty of nature's tiny details. shallow depth of field, high-resolution photography.",
    "A cozy, cluttered Victorian-era study filled with arcane objects, books, and celestial maps. In the center, a wise old wizard with a long white beard and star-patterned robes is scrying into a crystal ball, which shows a swirling galaxy. The room is lit by candlelight and the magical glow from the orb, casting long, dancing shadows. A black cat with glowing green eyes is curled up asleep on a pile of ancient tomes. The atmosphere is one of warmth, mystery, and ancient knowledge. Digital painting, detailed, warm lighting.",
    "An elegant, Art Nouveau-style elven city built into the side of a massive waterfall. The architecture is all flowing, organic curves, seamlessly integrated with the natural rock and plant life. Graceful, glowing bridges made of woven light connect different levels of the city. Elves with long, flowing hair and intricate clothing walk along the balconies. The mist from the waterfall creates a soft, dreamlike atmosphere. Style of Alphonse Mucha and Hayao Miyazaki."
];

export const CREATIVE_VIDEO_PROMPTS = [
    "Extreme close-up macro video, slow motion (1000fps). A monarch butterfly emerges from its chrysalis. The delicate, intricate process unfolds in hypnotic detail, from the cracking of the casing to the slow, majestic unfurling of its vibrant orange and black wings. The background is a soft-focus blur of green leaves. The lighting is bright, natural morning sunlight. Serene, mesmerizing, and awe-inspiring.",
    "Dynamic, fast-paced drone footage flying through the canyons of a futuristic desert planet. The drone chases a sleek, sand-worn landspeeder that kicks up plumes of orange dust. The speeder expertly navigates through towering rock formations carved with ancient alien symbols, occasionally firing its thrusters to make sharp turns. Lens flare from the planet's twin suns. The video has the feel of a high-speed chase scene from a sci-fi blockbuster. Cinematic, anamorphic aspect ratio.",
    "A charming, stop-motion animation of a tiny mouse in a cozy, cluttered workshop, building a miniature flying machine out of matchsticks, bottle caps, and a leaf for a sail. The lighting is warm and comes from a single, tiny lantern. The mouse works diligently, with little puffs of sawdust and expressive movements. The final shot is the mouse triumphantly launching the machine, which glides across the room in a wobbly but successful flight. A heartwarming and whimsical short clip.",
    "A cinematic, breathtaking time-lapse of the Northern Lights (Aurora Borealis) over a snow-covered mountain range in Norway. The vibrant greens, pinks, and purples of the aurora dance and swirl across the star-filled sky. The camera slowly pans across the landscape, revealing a frozen lake that reflects the celestial light show. The video conveys a sense of wonder and the immense beauty of the natural world.",
    "A visually satisfying, seamless loop animation of a complex Rube Goldberg machine. A steel marble drops, triggering a series of dominoes that fall perfectly, which in turn release a toy car down a ramp. The car hits a lever, which launches a small paper airplane, all flowing in one continuous, perfect motion before the marble drops again. The machine is made of common household objects and has a playful, colorful aesthetic. 3D render, smooth animation."
];

export const CREATIVE_STORY_PROMPTS = [
    "The story of a reclusive horologist (a master clockmaker) living in a rain-soaked, gaslamp-lit city, who is the only person to notice that time itself has begun to skip—a few seconds at first, then whole minutes. He discovers a cryptic symbol appearing on the faces of the city's great clocks just before each skip. He must follow these clues to find the source of the temporal anomaly before the city is erased from time, all while being pursued by shadowy figures who seem to exist outside the normal flow of time.",
    "In a world where islands float in the sky on currents of wind, a young sky-sailor inherits a mysterious, sealed compass from her estranged grandmother. The compass doesn't point north; instead, it points towards 'what is lost'. She embarks on a journey aboard her small skyship, following the compass through treacherous sky-storms and past sky-pirate territories, hoping to find her grandmother's long-lost floating island, which is rumored to hold the last garden of magical, starlight-infused flora in the world.",
    "The story of a decommissioned, gentle-giant of a sanitation robot, designated 'Unit 734', who spends its days secretly building a vibrant, beautiful garden in the middle of a vast, metallic scrapyard. It uses discarded parts to create kinetic sculptures of flowers and mechanical birds. Its quiet existence is disrupted when a curious, tech-savvy orphan girl discovers its hidden oasis. Together, they must protect their secret garden from the scrapyard's automated crushers and the cold corporation that owns the land.",
    "A timid archivist working in a colossal, labyrinthine library that contains every book ever written, and every book that *could* be written. One night, he finds a blank book that starts writing a story on its own—his story, but it's describing events that happen seconds before they actually occur. He soon realizes the book is not just predicting his future, but actively writing it, and he must learn to influence the narrative to escape a dark fate the book has planned for him.",
    "In a near-future city where all citizens are augmented with a 'Chroma' implant that allows them to mute their emotions, a black-market 'emotion dealer' sells vials of pure, unfiltered feelings: rage, joy, grief. He's a cynic who never partakes in his own supply. His life changes when he's hired by a wealthy client to find a legendary, rumored emotion known only as 'Wonder,' a quest that forces him to confront his own suppressed past and the true cost of a world without feeling."
];

export const CREATIVE_LOGO_PROMPTS = [
    {
        companyName: "Stellar Gaze Observatory",
        slogan: "Charting the Cosmos",
        description: "An educational and research facility focused on astronomy. We provide public access to high-powered telescopes and host lectures on astrophysics. The brand should feel inspiring, scientific, and vast.",
        style: "modern",
        colors: "Deep navy blue, silver, and a hint of glowing cyan"
    },
    {
        companyName: "The Gilded Page",
        slogan: "Where Every Book is a Treasure",
        description: "A boutique bookstore specializing in rare, vintage, and artisanal hand-bound books. We cater to collectors and passionate readers. The atmosphere is cozy, intellectual, and timeless.",
        style: "vintage",
        colors: "Maroon, gold foil, and cream"
    },
    {
        companyName: "Terra-Nova Robotics",
        slogan: "Building a Better Tomorrow",
        description: "A cutting-edge tech startup that designs and builds eco-friendly robots for agriculture and reforestation. Our brand is innovative, clean, and forward-thinking.",
        style: "geometric",
        colors: "Forest green, light grey, and a vibrant orange accent"
    },
    {
        companyName: "The Wandering Bean",
        slogan: "Your Daily Adventure",
        description: "A mobile coffee cart that sources single-origin beans from around the world. We're known for our high-quality coffee and friendly, adventurous spirit.",
        style: "hand-drawn",
        colors: "Earthy brown, tan, and sky blue"
    },
    {
        companyName: "Nyx Apparel",
        slogan: "Wear the Night",
        description: "A high-fashion streetwear brand inspired by cyberpunk and nocturnal city life. Our designs are edgy, futuristic, and sleek.",
        style: "minimalist",
        colors: "Black, white, and a sharp neon purple"
    }
];

export const CREATIVE_AD_PROMPTS = [
    {
        productName: "Aura Smart Mug",
        description: "A temperature-controlled smart mug that keeps your coffee or tea at the perfect temperature for hours. Connects to an app to set your ideal heat.",
        audience: "Tech enthusiasts, busy professionals, and coffee/tea lovers.",
        cta: "Never Drink Cold Coffee Again"
    },
    {
        productName: "Terra Eco-Backpack",
        description: "A stylish and durable backpack made entirely from recycled ocean plastics. Waterproof, lightweight, and designed for the modern adventurer.",
        audience: "Eco-conscious millennials, students, and urban explorers.",
        cta: "Shop Sustainably"
    },
    {
        productName: "FlowState Noise-Cancelling Headphones",
        description: "Immerse yourself in pure audio with our next-gen active noise-cancellation. 40-hour battery life and crystal-clear microphone for calls.",
        audience: "Commuters, open-office workers, and music audiophiles.",
        cta: "Find Your Focus"
    },
    {
        productName: "Gourmet Garden Indoor Herb Kit",
        description: "Grow fresh, organic herbs right in your kitchen with our automated, self-watering indoor garden. No green thumb required!",
        audience: "Home cooks, apartment dwellers, and healthy-living advocates.",
        cta: "Start Growing Today"
    },
    {
        productName: "'Zentil' Artisanal Dog Treats",
        description: "Delicious, all-natural, and grain-free dog treats made with human-grade ingredients. Packed with vitamins for a healthy coat and happy pup.",
        audience: "Health-conscious dog owners and pet lovers.",
        cta: "Treat Them Well"
    }
];

export const CREATIVE_AD_EXAMPLES = [
    {
        imageUrl: 'https://images.unsplash.com/photo-1596702737375-398233365921?q=80&w=800&auto=format&fit=crop',
        productName: "Chronos Watch Co.",
        description: "An elegant, minimalist timepiece crafted from surgical-grade stainless steel and sapphire crystal. A modern classic for the discerning individual.",
        audience: "Style-conscious professionals, watch enthusiasts.",
        cta: "Discover Timeless Style",
        tone: "luxury"
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1627483262079-9571b058a369?q=80&w=800&auto=format&fit=crop',
        productName: "Bloom Organic Skincare",
        description: "A refreshing facial serum made with 100% natural, plant-based ingredients to hydrate and rejuvenate your skin.",
        audience: "Health-conscious consumers, fans of natural beauty products.",
        cta: "Get Glowing",
        tone: "friendly"
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        productName: "Momentum Trail Runners",
        description: "Lightweight, durable, and high-traction running shoes designed to conquer any terrain, from city parks to mountain peaks.",
        audience: "Runners, hikers, outdoor adventurers.",
        cta: "Unleash Your Trail",
        tone: "inspirational"
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1618355799105-67657b238383?q=80&w=800&auto=format&fit=crop',
        productName: "Wanderlust Coffee",
        description: "A rich, full-bodied dark roast coffee with notes of chocolate and cherry, sourced ethically from the highlands of Colombia.",
        audience: "Coffee connoisseurs, remote workers, cafe lovers.",
        cta: "Start Your Day Boldly",
        tone: "professional"
    }
];

export const CREATIVE_ARTICLE_PROMPTS = [
    {
        topic: "An in-depth report on the future of renewable energy, focusing on how solar, wind, and geothermal technologies will reshape urban planning, architecture, and daily life in the cities of 2050.",
        type: 'report',
        style: 'professional',
        images: 3,
    },
    {
        topic: "A comprehensive, beginner-friendly guide to baking the perfect sourdough bread at home, covering everything from creating and maintaining a starter to mastering the stretch-and-fold technique and achieving a crispy crust.",
        type: 'how-to-guide',
        style: 'casual',
        images: 4,
    },
    {
        topic: "A narrative-driven blog post exploring the profound psychological and physiological benefits of 'forest bathing' (Shinrin-yoku), blending personal anecdotes with scientific research on how nature reduces stress and improves well-being.",
        type: 'blog-post',
        style: 'storytelling',
        images: 2,
    },
    {
        topic: "A formal academic essay analyzing the long-term socio-economic effects of the global shift to remote work, discussing its impact on commercial real estate, urban-rural migration, and the future of corporate culture.",
        type: 'essay',
        style: 'academic',
        images: 1,
    },
    {
        topic: "A technical research summary detailing the latest breakthroughs in conversational AI and large language models, explaining concepts like transformers and fine-tuning in an accessible way for a tech-savvy audience.",
        type: 'research-summary',
        style: 'technical',
        images: 2,
    },
];

export const CREATIVE_CAMPAIGN_PROMPTS = [
    "I'm launching 'Aether,' a new brand of noise-cancelling headphones for focus and productivity. The target audience is remote workers and students. The vibe should be minimalist, modern, and calm. I need a full campaign: logo, hero image for the website, ad copy, and a short social video.",
    "I'm opening 'The Crimson Fork,' a new Italian restaurant focused on rustic, farm-to-table dining. The atmosphere should be warm, inviting, and authentic. I need a branding package including logos, a hero image of our signature pasta dish, ad copy for local newspapers, and a short video tour of the restaurant's cozy interior.",
    "We're releasing 'Terra,' a new line of sustainable, eco-friendly backpacks made from recycled materials. The brand should feel adventurous, natural, and responsible. I need a campaign to launch the product: logos, a hero image of the backpack on a mountain trail, ad copy for social media, and a video showing the backpack in use in nature.",
    "Announcing 'Pixel Paws,' a mobile app for pet adoption that uses AI to match pets with owners. The brand identity should be friendly, tech-savvy, and heartwarming. I need a complete launch kit: logos, a hero image for the app store, ad copy for online ads, and a short, animated video explaining how the app works.",
];