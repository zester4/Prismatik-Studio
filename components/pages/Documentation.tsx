import React, { ReactElement, useState } from 'react';

const NavLink = ({ children, href, isActive, onClick }: { children: React.ReactNode, href: string, isActive: boolean, onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
    <a 
        href={href} 
        onClick={onClick}
        className={`block px-4 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-brand-teal-100 text-brand-teal-700' : 'text-brand-wheat-700 hover:bg-brand-wheat-100'}`}
    >
        {children}
    </a>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-brand-wheat-950 text-white p-4 rounded-lg text-sm overflow-x-auto">
        <code>{children}</code>
    </pre>
);

const sections = {
    'getting-started': {
        title: 'Getting Started',
        content: (
            <>
                <h2 className="text-3xl font-bold text-brand-wheat-900">Welcome to the Prismatik Studio Docs</h2>
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
                <p className="mt-2 text-brand-wheat-700">The first time you use the studio, it will prompt you to enter your API key. This key is saved securely in your browser's local storage and is never sent to our servers. All API calls are made directly from your browser to Google's servers.</p>
            </>
        )
    },
    'image-generator': {
        title: 'Image Generator',
        content: (
            <>
                <h2 className="text-3xl font-bold text-brand-wheat-900">Image Generator</h2>
                <p className="mt-4 text-brand-wheat-700">The Image Generator allows you to create high-quality visuals from text prompts. It also supports image-to-image editing.</p>
                
                <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                    <li><strong>Prompt:</strong> A detailed description of the image you want to create. More detail leads to better results.</li>
                    <li><strong>Model:</strong> Choose from various models like Imagen 4 for different balances of speed and quality.</li>
                    <li><strong>Negative Prompt:</strong> (Imagen models only) Specify elements to exclude from your image (e.g., "text, blurry, watermark").</li>
                    <li><strong>Aspect Ratio:</strong> The dimensions of the output image (e.g., 16:9 for landscape, 9:16 for portrait).</li>
                    <li><strong>Style:</strong> Apply a predefined style like "Photorealistic" or "Anime" to guide the visual output.</li>
                </ul>

                <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Prompt</h3>
                <CodeBlock>
                    Epic fantasy concept art. A colossal, ancient golem, constructed from moss-covered stones and intertwined with glowing blue magical vines, sits meditating in the center of a forgotten, sun-dappled clearing in a redwood forest.
                </CodeBlock>
            </>
        )
    },
    'video-generator': {
        title: 'Video Generator',
        content: (
            <>
                <h2 className="text-3xl font-bold text-brand-wheat-900">Video Generator</h2>
                <p className="mt-4 text-brand-wheat-700">Generate short, dynamic video clips from a text prompt or animate an existing image.</p>
                
                <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                    <li><strong>Prompt:</strong> Describe the scene and action for your video. Focus on movement and visual elements.</li>
                    <li><strong>Model:</strong> The Veo model family is optimized for high-quality video generation.</li>
                    <li><strong>Aspect Ratio:</strong> Choose a widescreen (16:9) or vertical (9:16) format.</li>
                    <li><strong>Animate Image (Optional):</strong> Upload an image to serve as the starting point for the video generation.</li>
                </ul>

                <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Prompt</h3>
                <CodeBlock>
                    A cinematic, breathtaking time-lapse of the Northern Lights (Aurora Borealis) over a snow-covered mountain range in Norway. The vibrant greens, pinks, and purples of the aurora dance and swirl across the star-filled sky.
                </CodeBlock>
            </>
        )
    },
    'story-generator': {
        title: 'Story Generator',
        content: (
            <>
                <h2 className="text-3xl font-bold text-brand-wheat-900">Story Generator</h2>
                <p className="mt-4 text-brand-wheat-700">Create illustrated, multi-scene stories from a single idea. The AI generates both the narrative text and corresponding images.</p>
                
                <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Key Parameters</h3>
                <ul className="mt-4 list-disc list-inside space-y-2 text-brand-wheat-700">
                    <li><strong>Prompt:</strong> A high-level concept or plot for your story.</li>
                    <li><strong>Number of Scenes:</strong> How many text/image pairs the story should contain.</li>
                    <li><strong>Narrative Length:</strong> Controls the amount of text generated for each scene (Short, Medium, or Detailed).</li>
                    <li><strong>Character Lock (Optional):</strong> Upload an image of a character to maintain their visual consistency throughout the story.</li>
                </ul>

                <h3 className="text-2xl font-bold text-brand-wheat-900 mt-8">Example Prompt</h3>
                <CodeBlock>
                    The story of a decommissioned, gentle-giant of a sanitation robot who secretly builds a beautiful garden in the middle of a vast, metallic scrapyard.
                </CodeBlock>
            </>
        )
    },
};

export default function Documentation(): ReactElement {
    const [activeSection, setActiveSection] = useState('getting-started');

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
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
                    {/* Sidebar */}
                    <aside className="md:w-64 flex-shrink-0 py-8 md:py-16 md:pr-8">
                        <nav className="sticky top-24 space-y-2">
                            {Object.entries(sections).map(([key, { title }]) => (
                                <NavLink 
                                    key={key}
                                    href={`#${key}`}
                                    isActive={activeSection === key}
                                    onClick={(e) => handleNavClick(e, key)}
                                >
                                    {title}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main id="doc-content" className="flex-grow py-8 md:py-16 md:pl-8 border-t md:border-t-0 md:border-l border-brand-wheat-200 min-h-[calc(100vh-80px)]">
                        <div className="prose max-w-none">
                            {ActiveComponent}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}