import React, { ReactElement, useState, PropsWithChildren, MouseEvent } from 'react';

// --- ICONS --- //
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>;
const ImageIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" /></svg>;
const VideoIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></svg>;
const StoryIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const ArticleIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const LogoIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.364c.54 0 .823.734.416 1.087l-4.36 3.162a.563.563 0 00-.182.635l2.125 5.11a.563.563 0 01-.84.622l-4.36-3.162a.563.563 0 00-.665 0l-4.36 3.162a.563.563 0 01-.84-.622l2.125-5.11a.563.563 0 00-.182-.635l-4.36-3.162a.563.563 0 01.416-1.087h5.364a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
const AdIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
const CampaignIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-1.5-1.5h-9.5m0 0l-.5 1.5m.5-1.5l.5 1.5m9-1.5l-1.5-6-3.75-3-3.75 3L9 15m0 0h3.75" /></svg>;
const PodcastIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>;
const PersonaIco = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21m-3.75-2.311V21m10.125-13.839a2.25 2.25 0 00-3.182-3.182L12 6.673l-2.843-2.843a2.25 2.25 0 00-3.182 3.182l2.843 2.843-2.843 2.843a2.25 2.25 0 103.182 3.182L12 13.327l2.843 2.843a2.25 2.25 0 103.182-3.182l-2.843-2.843 2.843-2.843z" /></svg>;
const WrenchScrewdriverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.528-1.036.92-2.17.92-3.375 0-2.83-2.31-5.14-5.14-5.14s-5.14 2.31-5.14 5.14c0 1.205.392 2.34.92 3.375l2.496 3.03m1.08-1.08l-2.496-3.03c-.528-1.036-.92-2.17-.92-3.375 0-2.83 2.31-5.14 5.14-5.14s5.14 2.31 5.14 5.14c0 1.205-.392 2.34-.92 3.375l-2.496 3.03m0 0l-1.08 1.08" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22l-.648-1.437a3.375 3.375 0 00-2.6-2.6L12 17.25l1.438-.648a3.375 3.375 0 002.6-2.6L17 12.75l.648 1.437a3.375 3.375 0 002.6 2.6l1.438.648-1.438.648a3.375 3.375 0 00-2.6 2.6z" /></svg>;
const TableCellsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125V6.375m1.125 13.125A1.125 1.125 0 004.5 18.375h15a1.125 1.125 0 001.125-1.125V6.375m-17.25 13.125v-1.5c0-.621.504-1.125 1.125-1.125h15c.621 0 1.125.504 1.125 1.125v1.5m-17.25 0h.008v.008H3.375v-.008zM3.375 6.375h17.25m-17.25 0c-.621 0-1.125-.504-1.125-1.125V4.5A1.125 1.125 0 013.375 3.375h17.25c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125m-17.25 0h.008v.008H3.375V6.375z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25v14.25" /></svg>;

// --- REUSABLE COMPONENTS --- //
const NavLink = ({ children, href, isActive, onClick, icon }: PropsWithChildren<{ href: string, isActive: boolean, onClick: (e: MouseEvent<HTMLAnchorElement>) => void, icon: ReactElement }>) => (
    <a 
        href={href} 
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-brand-teal-100 text-brand-teal-700' : 'text-brand-wheat-700 hover:bg-brand-wheat-100'}`}
    >
        {React.cloneElement(icon, { className: 'w-5 h-5 flex-shrink-0' })}
        <span>{children}</span>
    </a>
);

const CodeBlock = ({ children }: PropsWithChildren<{}>) => {
    const [copyText, setCopyText] = useState('Copy');

    const handleCopy = () => {
        if (typeof children === 'string' || (Array.isArray(children) && typeof children[0] === 'string')) {
            const textToCopy = Array.isArray(children) ? children.join('') : children as string;
            navigator.clipboard.writeText(textToCopy);
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        }
    };

    return (
        <div className="relative group my-6">
            <pre className="bg-brand-wheat-950 text-white p-4 rounded-lg text-sm overflow-x-auto">
                <code>{children}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-brand-wheat-700 hover:bg-brand-wheat-600 text-white text-xs font-semibold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {copyText}
            </button>
        </div>
    );
};

const Section: React.FC<{title: string, icon: ReactElement, children: ReactElement}> = ({title, icon, children}) => (
    <>
        <div className="flex items-center gap-4">
            <div className="bg-brand-teal-50 text-brand-teal-600 p-2 rounded-lg">
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
            <h2 className="text-3xl font-bold text-brand-wheat-900">{title}</h2>
        </div>
        <div className="mt-4">{children}</div>
    </>
);


export default function Documentation(): ReactElement {
    const [activeSection, setActiveSection] = useState('whats-new');

    const sections = {
        'whats-new': {
            title: "What's New?",
            icon: <SparklesIcon />,
            content: (
                <Section title="What's New?" icon={<SparklesIcon />}>
                    <>
                        <p className="mt-4 text-lg text-brand-wheat-700">Stay up-to-date with the latest features and improvements in Prismatik Studio.</p>
                        <hr className="my-8 border-brand-wheat-200" />
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900">November 2023: The Audio & Persona Update</h3>
                        <p className="mt-2 text-brand-wheat-700">This month, we're excited to roll out two major new features that expand your creative possibilities:</p>
                        <ul className="mt-4 list-disc list-inside space-y-4 text-brand-wheat-700">
                            <li>
                                <strong>Podcast Generator:</strong> Go from a topic to a fully synthesized podcast episode. Our new tool can generate a script with multiple speakers and then produce a high-quality audio file using advanced text-to-speech voices.
                            </li>
                             <li>
                                <strong>Persona Hub:</strong> Take control of the AI's personality! The new Persona Hub lets you create custom "System Instructions" to guide the AI's tone, expertise, and style across all generators. Switch from a "Witty Social Media Manager" to a "Formal Report Writer" with a single click.
                            </li>
                             <li>
                                <strong>Documentation Overhaul:</strong> The documentation you're reading right now! We've added more content, better navigation, a changelog, and a glossary to help you get the most out of the studio.
                            </li>
                        </ul>
                    </>
                </Section>
            )
        },
        'getting-started': {
            title: 'Getting Started',
            icon: <PlayIcon />,
            content: (
                <Section title="Getting Started" icon={<PlayIcon />}>
                    <>
                        <p className="mt-4 text-lg text-brand-wheat-700">This documentation will guide you through the features and functionalities of each tool in the studio. To begin, you'll need a Google Gemini API key.</p>
        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">1. Obtaining Your API Key</h3>
                        <p className="mt-2 text-brand-wheat-700">Prismatik Studio is a user interface that runs entirely in your browser. It requires an API key to communicate with Google's powerful AI models.</p>
                        <ol className="mt-4 list-decimal list-inside space-y-2 text-brand-wheat-700">
                            <li>Navigate to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-brand-teal-600 font-semibold hover:underline">Google AI Studio</a>.</li>
                            <li>Sign in with your Google account.</li>
                            <li>Click on the "Get API key" button.</li>
                            <li>Create a new API key in a new or existing project.</li>
                            <li>Copy the generated key. It will be a long string of letters and numbers.</li>
                        </ol>
                        <div className="mt-4 p-4 bg-brand-wheat-100 border-l-4 border-brand-wheat-300 text-brand-wheat-800">
                            <strong>Important:</strong> Treat your API key like a password. Do not share it publicly.
                        </div>
        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">2. Using Your API Key in the Studio</h3>
                        <p className="mt-2 text-brand-wheat-700">When you launch the studio, you will be prompted to enter your API key if one isn't already saved. This key is saved securely in your browser's local storage and is never sent to our servers. All API calls are made directly from your browser to Google's servers.</p>
                    </>
                </Section>
            )
        },
        'image-generator': {
            title: 'Image Generator',
            icon: <ImageIco />,
            content: (
                 <Section title="Image Generator" icon={<ImageIco />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">The Image Generator allows you to create high-quality visuals from text prompts. It also supports image-to-image editing by uploading an image.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Prompt:</strong> A detailed description of the image you want to create. More detail leads to better results. For editing, describe the changes you want to make.</li>
                            <li><strong>Model:</strong> Choose from various models like Imagen 4 for different balances of speed and quality. Editing always uses the Gemini 2.5 Flash model.</li>
                            <li><strong>Negative Prompt:</strong> (Imagen models only) Specify elements to exclude from your image (e.g., "text, blurry, watermark").</li>
                            <li><strong>Aspect Ratio:</strong> The dimensions of the output image (e.g., 16:9 for landscape, 9:16 for portrait).</li>
                            <li><strong>Style:</strong> Apply a predefined style like "Photorealistic" or "Anime" to guide the visual output.</li>
                        </ul>
        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Prompt (Creation)</h3>
                        <CodeBlock>Epic fantasy concept art. A colossal, ancient golem, constructed from moss-covered stones and intertwined with glowing blue magical vines, sits meditating in the center of a forgotten, sun-dappled clearing in a redwood forest.</CodeBlock>
                         <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Prompt (Editing)</h3>
                        <CodeBlock>(With an image of a dog uploaded)
    Add a small, futuristic visor over the dog's eyes.</CodeBlock>
                    </>
                </Section>
            )
        },
        'video-generator': {
            title: 'Video Generator',
            icon: <VideoIco />,
            content: (
                 <Section title="Video Generator" icon={<VideoIco />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">Generate short, dynamic video clips from a text prompt or animate an existing image.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Prompt:</strong> Describe the scene and action for your video. Focus on movement and visual elements.</li>
                            <li><strong>Model:</strong> The Veo model family is optimized for high-quality video generation.</li>
                            <li><strong>Aspect Ratio:</strong> Choose a widescreen (16:9) or vertical (9:16) format.</li>
                            <li><strong>Animate Image (Optional):</strong> Upload an image to serve as the starting point for the video generation. The AI will attempt to animate the contents of the image based on your prompt.</li>
                        </ul>
        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Prompt</h3>
                        <CodeBlock>A cinematic, breathtaking time-lapse of the Northern Lights (Aurora Borealis) over a snow-covered mountain range in Norway. The vibrant greens, pinks, and purples of the aurora dance and swirl across the star-filled sky.</CodeBlock>
                    </>
                </Section>
            )
        },
        'story-generator': {
            title: 'Story Generator',
            icon: <StoryIco />,
            content: (
                <Section title="Story Generator" icon={<StoryIco />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">Create illustrated, multi-scene stories from a single idea. The AI generates both the narrative text and corresponding images.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Prompt:</strong> A high-level concept or plot for your story.</li>
                            <li><strong>Number of Scenes:</strong> How many text/image pairs the story should contain.</li>
                            <li><strong>Narrative Length:</strong> Controls the amount of text generated for each scene (Short, Medium, or Detailed).</li>
                            <li><strong>Character Lock (Optional):</strong> Upload an image of a character to maintain their visual consistency throughout the story. The AI analyzes the image and uses that description for all scenes.</li>
                        </ul>
        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Prompt</h3>
                        <CodeBlock>The story of a decommissioned, gentle-giant of a sanitation robot who secretly builds a beautiful garden in the middle of a vast, metallic scrapyard.</CodeBlock>
                    </>
                </Section>
            )
        },
        'article-generator': {
            title: 'Article Generator',
            icon: <ArticleIco />,
            content: (
                <Section title="Article Generator" icon={<ArticleIco />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">Generate structured, long-form content on any topic. The AI plans the article, writes the text, and creates contextually relevant images.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Prompt (Topic):</strong> The core subject of your article.</li>
                            <li><strong>Article Type:</strong> The format of the content, such as 'Blog Post', 'Report', or 'How-To Guide'.</li>
                            <li><strong>Writing Style:</strong> The tone of the article, from 'Professional' to 'Casual' or 'Academic'.</li>
                            <li><strong>Number of Images:</strong> The AI will intelligently place this number of generated images throughout the article.</li>
                        </ul>
        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Pro-Tip: Editing & Proofreading</h3>
                        <p className="mt-2 text-brand-wheat-700">After generating, you can click to edit any paragraph or heading. The built-in proofreading tool can then be used on your edited text to check for spelling and grammar errors.</p>
                    </>
                </Section>
            )
        },
         'logo-generator': {
            title: 'Logo Generator',
            icon: <LogoIco />,
            content: (
                <Section title="Logo Generator" icon={<LogoIco />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">Rapidly prototype professional logo concepts for your brand or project.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Company Name & Slogan:</strong> Provide the brand name for context.</li>
                            <li><strong>Description:</strong> This is the most important field. Describe the company's industry, values, and target audience.</li>
                            <li><strong>Style:</strong> Choose a visual style like 'Minimalist' or 'Vintage' to guide the design.</li>
                            <li><strong>Colors:</strong> Specify the desired color palette (e.g., "forest green, light grey, vibrant orange").</li>
                        </ul>
                        <div className="mt-4 p-4 bg-brand-wheat-100 border-l-4 border-brand-wheat-300 text-brand-wheat-800">
                            <strong>Note:</strong> The Logo Generator is designed to create text-free, abstract, or symbolic marks. It will not render the company name in the image itself.
                        </div>
                    </>
                </Section>
            )
        },
        'ad-creator': {
            title: 'Ad Creator',
            icon: <AdIco />,
            content: (
                <Section title="Ad Creator" icon={<AdIco />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">Generate a complete ad—including persuasive copy and a stunning visual (image or video)—in one go.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Ad Format:</strong> Choose between an Image Ad or a Video Ad.</li>
                            <li><strong>Product Image (Optional):</strong> Upload your own product photo. The AI will enhance it and place it in an appropriate ad setting. If omitted, the AI will generate a product image from scratch.</li>
                            <li><strong>Product Details:</strong> Fill in the name, description, and target audience.</li>
                            <li><strong>Ad Tone:</strong> Select a tone of voice, from 'Professional' to 'Humorous', to guide the copywriting.</li>
                             <li><strong>Call to Action (CTA):</strong> Specify the desired action (e.g., "Shop Now", "Learn More").</li>
                        </ul>
        
                         <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Output</h3>
                        <p className="mt-2 text-brand-wheat-700">The Ad Creator produces a result card containing both the generated media (image or video) and three distinct pieces of copy: a Headline, a Body, and your Call to Action, which can be copied individually.</p>
                    </>
                </Section>
            )
        },
        'campaign-director': {
            title: 'Campaign Director',
            icon: <CampaignIco />,
            content: (
                <Section title="Campaign Director" icon={<CampaignIco />}>
                    <>
                        <p className="mt-4 text-lg text-brand-wheat-700">The Campaign Director is the most powerful tool in the studio, acting as an AI creative director. Instead of generating a single asset, it orchestrates multiple AI models to produce a complete, cohesive marketing campaign from a single high-level brief.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">How It Works</h3>
                        <p className="mt-2 text-brand-wheat-700">You provide a single, detailed prompt describing your company, product, or project. The AI then performs the following steps:</p>
                        <ol className="mt-4 list-decimal list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Strategy:</strong> It analyzes your brief to define a full brand identity, including target audience, brand mood, keywords, and a color palette.</li>
                            <li><strong>Logo Design:</strong> It generates multiple text-free logo concepts based on the new brand identity.</li>
                            <li><strong>Imagery:</strong> It creates a high-quality, photorealistic hero image for a website or landing page.</li>
                            <li><strong>Copywriting:</strong> It writes targeted ad copy, including a headline, body text, and a call-to-action.</li>
                            <li><strong>Video Production:</strong> It produces a short, eye-catching video suitable for social media platforms like Instagram Stories or TikTok.</li>
                        </ol>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Brief</h3>
                        <p className="mt-2 text-brand-wheat-700">A good brief is key to a great campaign. Be descriptive about your product, audience, and desired feeling.</p>
                        <CodeBlock>I'm launching 'Terra,' a new line of sustainable, eco-friendly backpacks made from recycled materials. The brand should feel adventurous, natural, and responsible. I need a campaign to launch the product: logos, a hero image of the backpack on a mountain trail, ad copy for social media, and a video showing the backpack in use in nature.</CodeBlock>
                    </>
                </Section>
            )
        },
        'podcast-generator': {
            title: 'Podcast Generator',
            icon: <PodcastIco />,
            content: (
                <Section title="Podcast Generator" icon={<PodcastIco />}>
                    <>
                        <p className="mt-4 text-lg text-brand-wheat-700">Create and synthesize complete podcast episodes, from short monologues to multi-speaker discussions, using text-to-speech technology.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Generation Modes</h3>
                        <p className="mt-2 text-brand-wheat-700">The generator offers a flexible two-step workflow:</p>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>From Topic:</strong> Provide a topic, format, tone, duration, and speaker names. The AI will generate a complete script for you. You can then review and edit this script before synthesizing the audio.</li>
                            <li><strong>From Script:</strong> Write or paste your own script. The generator will use this text directly for audio synthesis. For multiple speakers, use the format <code className="bg-brand-wheat-200 text-sm p-1 rounded">Speaker Name: Dialogue...</code> on each line.</li>
                        </ul>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Speakers & Voices</h3>
                        <p className="mt-2 text-brand-wheat-700">You can configure up to 5 unique speakers. For each speaker, you can assign a name and select from a list of pre-built, high-quality voices. The speaker names you configure must exactly match the names used in your script for multi-speaker synthesis to work correctly.</p>
            
                        <div className="mt-4 p-4 bg-brand-wheat-100 border-l-4 border-brand-wheat-300 text-brand-wheat-800">
                            <strong>Session Only:</strong> Like videos, generated podcast audio files are stored as temporary blob URLs and will not persist if you refresh the page. Please download any audio you wish to keep.
                        </div>
                    </>
                </Section>
            )
        },
        'persona-hub': {
            title: 'Persona Hub',
            icon: <PersonaIco />,
            content: (
                 <Section title="Persona Hub" icon={<PersonaIco />}>
                    <>
                        <p className="mt-4 text-lg text-brand-wheat-700">The Persona Hub is a powerful feature that allows you to customize the AI's personality, tone, and expertise. The active persona influences the output of all generators in the studio.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">What is a Persona?</h3>
                        <p className="mt-2 text-brand-wheat-700">A Persona is a set of instructions, known as a "System Instruction," that is sent to the AI with every request. It tells the AI *how* to behave. For example, a persona can instruct the AI to act as a witty social media manager, a formal report writer, or a creative storyteller.</p>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Creating a Custom Persona</h3>
                        <p className="mt-2 text-brand-wheat-700">You can create your own personas to tailor the AI to your specific needs. When creating a persona, you will define:</p>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>Name & Description:</strong> For your own reference.</li>
                            <li><strong>Icon:</strong> A visual representation for the hub.</li>
                            <li><strong>System Instruction:</strong> The core of the persona. This is where you give the AI its role, context, and rules.</li>
                        </ul>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example System Instruction</h3>
                        <p className="mt-2 text-brand-wheat-700">For a "Witty Social Media Manager" persona, the instruction could be:</p>
                        <CodeBlock>You are an expert social media manager. Your tone is witty, informal, and full of clever puns. You specialize in creating short, attention-grabbing copy and visually striking concepts for platforms like Twitter and Instagram. Keep text concise and use emojis where appropriate.</CodeBlock>
                        <p className="mt-2 text-brand-wheat-700">When this persona is active, the Ad Creator will produce punchier copy, and the Image Generator will better understand prompts for viral-style content.</p>
                    </>
                </Section>
            )
        },
        'pro-tips': {
            title: 'Prompting Best Practices',
            icon: <LightBulbIcon />,
            content: (
                 <Section title="Prompting Best Practices" icon={<LightBulbIcon />}>
                    <>
                        <p className="mt-4 text-lg text-brand-wheat-700">The quality of your output is directly related to the quality of your input. Here are some tips for writing effective prompts across all generators.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">1. Be Specific and Detailed</h3>
                        <p className="mt-2 text-brand-wheat-700">Vague prompts lead to generic results. Add details about the subject, the environment, and the mood.</p>
                        <p className="mt-2 text-brand-wheat-700"><strong>Good:</strong> <code className="bg-brand-wheat-200 text-sm p-1 rounded">A knight.</code></p>
                        <p className="mt-2 text-brand-wheat-700"><strong>Better:</strong> <code className="bg-brand-wheat-200 text-sm p-1 rounded">A portrait of a weary female knight with a scar over her left eye, wearing intricately engraved silver armor with gold trim.</code></p>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">2. Set the Scene</h3>
                        <p className="mt-2 text-brand-wheat-700">Describe the background, lighting, and atmosphere to create a more compelling image.</p>
                        <p className="mt-2 text-brand-wheat-700"><strong>Good:</strong> <code className="bg-brand-wheat-200 text-sm p-1 rounded">A robot in a city.</code></p>
                        <p className="mt-2 text-brand-wheat-700"><strong>Better:</strong> <code className="bg-brand-wheat-200 text-sm p-1 rounded">A lone, rusty robot stands in a rain-soaked alley of a futuristic cyberpunk city at night, illuminated by the flickering red neon sign of a noodle shop.</code></p>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">3. Specify Style and Medium</h3>
                        <p className="mt-2 text-brand-wheat-700">Use keywords to guide the artistic style. The "Style" dropdown is a great start, but you can be even more specific in your prompt.</p>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li><strong>For Medium:</strong> "oil painting", "watercolor sketch", "3D render", "photograph", "line art".</li>
                            <li><strong>For Style:</strong> "cinematic", "fantasy concept art", "anime", "art deco", "surrealism".</li>
                            <li><strong>For Lighting:</strong> "dramatic lighting", "soft morning light", "god rays", "rim lighting".</li>
                            <li><strong>For Camera:</strong> "macro shot", "wide angle lens", "low angle shot", "drone footage".</li>
                        </ul>

                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">4. Iterate and Refine</h3>
                        <p className="mt-2 text-brand-wheat-700">Your first prompt is a starting point, not the final destination. If a result isn't quite right, adjust your prompt by adding, removing, or rephrasing keywords. Use the editing and regeneration features to fine-tune specific parts of your creation. Sometimes changing just one word can make a huge difference.</p>
                    </>
                </Section>
            )
        },
        'model-comparison': {
            title: 'Model Comparison',
            icon: <TableCellsIcon />,
            content: (
                <Section title="Image Model Comparison" icon={<TableCellsIcon />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">Choosing the right model is key to getting the best results. Here's a comparison of the primary image generation models available in the studio.</p>
                        <div className="mt-8 w-full overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-brand-wheat-50">
                                        <th className="p-3 font-bold uppercase text-brand-wheat-600 text-sm text-left border border-brand-wheat-200">Model</th>
                                        <th className="p-3 font-bold uppercase text-brand-wheat-600 text-sm text-left border border-brand-wheat-200">Best For</th>
                                        <th className="p-3 font-bold uppercase text-brand-wheat-600 text-sm text-left border border-brand-wheat-200">Key Features</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-brand-wheat-50">
                                        <td className="p-3 text-brand-wheat-800 border border-brand-wheat-200 font-semibold">Imagen 4 Family</td>
                                        <td className="p-3 text-brand-wheat-800 border border-brand-wheat-200">High-quality, photorealistic images, and artistic styles. Final asset creation.</td>
                                        <td className="p-3 text-brand-wheat-800 border border-brand-wheat-200">
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Superior realism and detail.</li>
                                                <li>Supports Negative Prompts.</li>
                                                <li>Can generate multiple images at once.</li>
                                                <li>Offers various aspect ratios.</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-brand-wheat-50">
                                        <td className="p-3 text-brand-wheat-800 border border-brand-wheat-200 font-semibold">Gemini 2.5 Flash</td>
                                        <td className="p-3 text-brand-wheat-800 border border-brand-wheat-200">Creative and complex prompts, rapid iteration, and tasks involving both text and images.</td>
                                        <td className="p-3 text-brand-wheat-800 border border-brand-wheat-200">
                                             <ul className="list-disc list-inside space-y-1">
                                                <li>Extremely fast generation.</li>
                                                <li>Excellent at understanding nuanced or abstract concepts.</li>
                                                <li>Powers Image Editing, Story Generator, and Article Generator.</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                </Section>
            )
        },
        'glossary': {
            title: 'Glossary',
            icon: <BookOpenIcon />,
            content: (
                 <Section title="Glossary" icon={<BookOpenIcon />}>
                    <>
                        <p className="mt-4 text-brand-wheat-700">A quick reference for common terms used in generative AI and Prismatik Studio.</p>
                        <dl className="mt-8 space-y-6">
                            <div className="bg-brand-wheat-50 p-4 rounded-lg">
                                <dt className="font-bold text-brand-wheat-900">Model</dt>
                                <dd className="text-brand-wheat-700 mt-1">The specific AI algorithm used for generation (e.g., Imagen 4, Gemini 2.5 Flash). Different models have different strengths.</dd>
                            </div>
                            <div className="bg-brand-wheat-50 p-4 rounded-lg">
                                <dt className="font-bold text-brand-wheat-900">Prompt</dt>
                                <dd className="text-brand-wheat-700 mt-1">The text description you provide to the AI to tell it what to create.</dd>
                            </div>
                            <div className="bg-brand-wheat-50 p-4 rounded-lg">
                                <dt className="font-bold text-brand-wheat-900">Negative Prompt</dt>
                                <dd className="text-brand-wheat-700 mt-1">A supplementary prompt (used by Imagen models) that tells the AI what to *avoid* including in the image, such as "blurry, text, watermark".</dd>
                            </div>
                            <div className="bg-brand-wheat-50 p-4 rounded-lg">
                                <dt className="font-bold text-brand-wheat-900">Aspect Ratio</dt>
                                <dd className="text-brand-wheat-700 mt-1">The proportional relationship between the width and height of an image or video (e.g., 16:9 is widescreen, 1:1 is square).</dd>
                            </div>
                            <div className="bg-brand-wheat-50 p-4 rounded-lg">
                                <dt className="font-bold text-brand-wheat-900">System Instruction</dt>
                                <dd className="text-brand-wheat-700 mt-1">A high-level instruction that tells the AI *how* to behave (its persona, role, or tone) before it even sees your main prompt. Managed in the Persona Hub.</dd>
                            </div>
                        </dl>
                    </>
                </Section>
            )
        },
        'troubleshooting': {
            title: 'Troubleshooting',
            icon: <WrenchScrewdriverIcon />,
            content: (
                <Section title="Troubleshooting" icon={<WrenchScrewdriverIcon />}>
                    <>
                        <p className="mt-4 text-lg text-brand-wheat-700">Encountering an issue? Here are some solutions to common problems.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">API Key Errors</h3>
                        <p className="mt-2 text-brand-wheat-700">If you see an "API Key not valid" error:</p>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li>Ensure you have copied the entire key from Google AI Studio without any extra spaces.</li>
                            <li>Check that the project associated with your API key is enabled in your Google Cloud Console.</li>
                            <li>Make sure billing is enabled for your Google Cloud project if you are using paid features or have exceeded free tier limits.</li>
                        </ul>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Safety Policy Errors</h3>
                        <p className="mt-2 text-brand-wheat-700">If your prompt is blocked for "safety" reasons, it may have inadvertently triggered Google's safety filters. These filters are in place to prevent the generation of harmful content.</p>
                        <p className="mt-2 text-brand-wheat-700"><strong>Solution:</strong> Try rephrasing your prompt. Be more specific and avoid ambiguous or potentially sensitive terms. Even harmless words can sometimes be misinterpreted in certain contexts.</p>
                        
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Quota Exceeded Errors</h3>
                        <p className="mt-2 text-brand-wheat-700">The free tier of the Gemini API has limits on how many requests you can make per minute and per day. If you exceed these, you will see a quota error.</p>
                        <p className="mt-2 text-brand-wheat-700"><strong>Solution:</strong> You can either wait for the quota to reset (e.g., the next day) or set up billing in your Google Cloud project to move to a pay-as-you-go plan with higher limits.</p>
            
                        <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Unexpected or Low-Quality Results</h3>
                        <p className="mt-2 text-brand-wheat-700">If the AI's output isn't what you expected:</p>
                        <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                            <li>Review our <a href="#pro-tips" onClick={(e) => { e.preventDefault(); setActiveSection('pro-tips') }} className="text-brand-teal-600 font-semibold hover:underline">Prompting Best Practices</a> to add more detail and clarity to your prompt.</li>
                            <li>Try a different model. For images, Imagen is often better for photorealism, while Gemini can be more creative.</li>
                            <li>Use the regeneration features in the Story and Article generators to get a different version of a specific image or section.</li>
                            <li>For Imagen models, use the "Negative Prompt" field to explicitly exclude things you don't want to see.</li>
                        </ul>
                    </>
                </Section>
            )
        },
    };

    const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, section: string) => {
        e.preventDefault();
        setActiveSection(section);
        const contentElement = document.getElementById('doc-content');
        if (contentElement) contentElement.scrollTop = 0;
    };

    const ActiveComponent = sections[activeSection as keyof typeof sections].content;

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row">
                    {/* Mobile Navigation */}
                    <div className="md:hidden pt-8">
                         <label htmlFor="doc-nav-select" className="block text-sm font-medium text-brand-wheat-700 mb-2">Documentation Sections</label>
                         <select
                            id="doc-nav-select"
                            value={activeSection}
                            onChange={(e) => setActiveSection(e.target.value)}
                            className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500"
                        >
                            {Object.entries(sections).map(([key, { title }]) => (
                                <option key={key} value={key}>{title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block md:w-64 lg:w-72 flex-shrink-0 py-8 md:py-16 md:pr-8">
                        <nav className="sticky top-24 space-y-1">
                            {Object.entries(sections).map(([key, { title, icon }]) => (
                                <NavLink 
                                    key={key}
                                    href={`#${key}`}
                                    isActive={activeSection === key}
                                    onClick={(e) => handleNavClick(e, key)}
                                    icon={icon}
                                >
                                    {title}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main id="doc-content" className="flex-grow py-8 md:py-16 md:pl-8 border-t md:border-t-0 md:border-l border-brand-wheat-200 min-h-[calc(100vh-80px)]">
                        <div className="prose max-w-none prose-h2:text-brand-wheat-900 prose-h3:text-brand-wheat-800 prose-p:text-brand-wheat-700 prose-li:text-brand-wheat-700 prose-a:text-brand-teal-600">
                            {ActiveComponent}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
