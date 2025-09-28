import React, { ReactElement, useState } from 'react';

const ChevronDownIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const FaqItem = ({ question, answer }: { question: string; answer: ReactElement }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-brand-wheat-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-5 text-left gap-4">
                <h4 className="text-lg font-semibold text-brand-wheat-800">{question}</h4>
                <div className="w-6 h-6 flex-shrink-0 bg-brand-wheat-200 rounded-full flex items-center justify-center">
                    <ChevronDownIcon className={`w-4 h-4 text-brand-wheat-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                 <div className="overflow-hidden">
                    <div className="pb-5 text-brand-wheat-700 pr-10 space-y-4">{answer}</div>
                 </div>
            </div>
        </div>
    );
};

// FIX: Add explicit type to faqData to resolve type inference issue.
const faqData: { question: string; answer: ReactElement }[] = [
    {
        question: "What do I need to use Prismatik Studio?",
        answer: (
            <>
                <p>The only thing you need is a Google Gemini API key. Prismatik Studio is a user interface that sits on top of Google's powerful AI models. To use it, you must provide your own API key, which the application uses to make requests directly from your browser to the Google API.</p>
                <p>You can obtain a free API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-brand-teal-600 font-semibold hover:underline">Google AI Studio</a>.</p>
            </>
        )
    },
    {
        question: "Is my API key and data secure?",
        answer: (
             <p>Yes. Your privacy and security are paramount. Your Google Gemini API key and all of your creations are stored exclusively in your browser's local storage. They are never transmitted to, or stored on, any Prismatik Studio servers. All communication happens directly between your browser and the Google API endpoints.</p>
        )
    },
    {
        question: "What's the difference between the image models (e.g., Imagen 4 vs Gemini)?",
        answer: (
             <>
                <p>Each model has its strengths:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Imagen Models:</strong> These are specialized for high-quality, photorealistic image generation. They offer more control through parameters like negative prompts and styles, and can generate multiple images at once. They are ideal for final assets and professional design work.</li>
                    <li><strong>Gemini 2.5 Flash (Preview):</strong> This is a powerful multi-modal model. It excels at understanding complex prompts and is used for features that combine text and images, like our Image Editor, Story Generator, and Article Generator. It's incredibly fast and versatile.</li>
                </ul>
             </>
        )
    },
    {
        question: "Can I edit the content I generate?",
        answer: (
            <p>Yes! The Story and Article generators have built-in editing features. You can click to edit any block of text, regenerate any image that doesn't fit your vision, and even use AI-powered proofreading to polish your writing. For standalone images, you can upload a generated image back into the Image Generator to perform edits with a new prompt.</p>
        )
    },
    {
        question: "How does 'Character Lock' in the Story Generator work?",
        answer: (
            <p>When you upload a character image, the AI first analyzes the visual information to create a detailed text description of the character (e.g., "A girl with curly red hair, wearing a yellow raincoat."). This description is then automatically and consistently included in the image prompt for every scene of your story, ensuring the character looks the same throughout the narrative.</p>
        )
    },
    {
        question: "Why do my video generations disappear when I refresh the page?",
        answer: (
            <p>Generated videos are stored as temporary "blob URLs" in your browser's memory. These URLs are not persistent and will be cleared when you close or refresh your browser tab. All other creations like images, logos, stories, and articles are saved to your browser's local storage and will persist between sessions. Be sure to download any videos you want to keep!</p>
        )
    },
     {
        question: "I'm getting an error message. What should I do?",
        answer: (
            <>
                <p>Error messages are designed to be as informative as possible. Here are some common ones:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>API Key Error:</strong> Double-check that you have entered your API key correctly and that it is active in your Google AI Studio account.</li>
                    <li><strong>Prompt Issue / Safety Blocked:</strong> Your prompt may have triggered Google's safety filters. Try rephrasing your request to be more specific and compliant with their policies.</li>
                    <li><strong>Quota Exceeded:</strong> The free tier of the Gemini API has usage limits. You may have exceeded your daily or per-minute quota. Please check your Google Cloud Console for details.</li>
                    <li><strong>Network Error:</strong> This usually indicates a problem with your internet connection or a temporary issue reaching Google's servers.</li>
                </ul>
            </>
        )
    },
];

export default function FAQ(): ReactElement {
  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900">Frequently Asked Questions</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700">
                    Find answers to common questions about how Prismatik Studio works, security, and best practices.
                </p>
            </div>
            <div className="max-w-3xl mx-auto mt-12">
                {faqData.map((item, index) => (
                    <FaqItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    </div>
  );
}
