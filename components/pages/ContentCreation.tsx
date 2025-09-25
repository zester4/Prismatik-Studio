import React, { ReactElement } from 'react';

const FeatureCard = ({ title, description, icon }: { title: string, description: string, icon: ReactElement }) => (
    <div className="bg-brand-wheat-50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
            <div className="bg-brand-teal-100 text-brand-teal-500 p-3 rounded-lg flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-brand-wheat-900">{title}</h3>
                <p className="mt-1 text-brand-wheat-700">{description}</p>
            </div>
        </div>
    </div>
);

// Icons
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ArticleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ProofreadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default function ContentCreation(): ReactElement {
  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center max-w-3xl mx-auto">
                <p className="font-semibold text-brand-teal-500">For Creators</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 mt-2">Where Ideas Become Masterpieces</h1>
                <p className="mt-4 text-lg text-brand-wheat-700">
                   Whether you're an author, blogger, or screenwriter, Prismatik Studio provides the tools to conquer writer's block, visualize your narratives, and produce polished, ready-to-publish content.
                </p>
                <a href="/#/studio" className="mt-8 inline-block bg-brand-teal-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300">
                    Start Writing
                </a>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<StoryIcon />}
                    title="Visualize Your Narrative"
                    description="Turn your story concepts into fully illustrated scenes, bringing your characters and worlds to life instantly."
                />
                <FeatureCard 
                    icon={<ArticleIcon />}
                    title="Draft with Intelligence"
                    description="Generate well-structured articles, blog posts, and reports on any topic, complete with context-aware imagery."
                />
                <FeatureCard 
                    icon={<ProofreadIcon />}
                    title="Polish to Perfection"
                    description="Use AI-powered proofreading to refine your text, correcting grammar and spelling mistakes with a single click."
                />
            </div>

            <div className="mt-24 bg-brand-wheat-50 p-10 rounded-2xl">
                 <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-wheat-900">Your AI Writing Partner</h2>
                        <p className="mt-4 text-brand-wheat-700">The Story and Article generators are designed to be collaborative partners in your creative process, helping you from initial concept to final draft.</p>
                        <ul className="mt-6 space-y-3">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Character Consistency:</strong> Upload a character image to maintain their appearance across every scene in your story.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Total Creative Control:</strong> Easily edit generated text and regenerate any image until it perfectly matches your vision.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Multiple Export Options:</strong> Save your work as a professional PDF or copy the content as Markdown for easy publishing.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop" alt="Writer working on a laptop" className="rounded-xl shadow-lg w-full h-full object-cover" />
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}