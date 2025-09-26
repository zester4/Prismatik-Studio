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
const GameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536A9.004 9.004 0 0112 15c-1.285 0-2.52.288-3.654.815M15 1.5a9 9 0 11-6 0M12 21a9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9z" /></svg>;
const UiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.042.502.092.752.152v9.248M9.75 3.104c.621.206 1.278.466 1.944.796v9.248m-1.944-.332l.01-.01m1.933.342c.312.162.63.328.953.502v-9.248m.953.332l.01-.01m.943-.342c.621.206 1.278.466 1.944.796v9.248m-1.944-.332l.01-.01m1.933.342a2.25 2.25 0 002.186 2.186v5.714a2.25 2.25 0 00-1.591-.659L15 14.5M14.25 3.104c.251.042.502.092.752.152v9.248" /></svg>;
const DataIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-5.304-5.304L4.098 14.6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-6.402 6.401a3.75 3.75 0 005.304 5.304l6.402-6.401a3.75 3.75 0 000-5.304z" /></svg>;

export default function Development(): ReactElement {
  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center max-w-3xl mx-auto">
                <p className="font-semibold text-brand-teal-500">For Developers</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 mt-2">Build Faster, Not Harder</h1>
                <p className="mt-4 text-lg text-brand-wheat-700">
                   Stop wasting time on placeholder assets and tedious graphic design. Prismatik Studio helps developers and technical professionals accelerate their projects by generating high-quality visual assets on demand.
                </p>
                <a href="/#/studio" className="mt-8 inline-block bg-brand-teal-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300">
                    Generate Assets
                </a>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<GameIcon />}
                    title="Game Asset Production"
                    description="Generate sprites, seamless textures, character portraits, and concept art for your next indie game."
                />
                <FeatureCard 
                    icon={<UiIcon />}
                    title="UI & UX Mockups"
                    description="Instantly create custom icons, placeholder user avatars, background images, and other UI elements for your web and mobile applications."
                />
                <FeatureCard 
                    icon={<DataIcon />}
                    title="Synthetic Data & Docs"
                    description="Create illustrative images for technical documentation, presentations, or training computer vision models."
                />
            </div>

            <div className="mt-24 bg-brand-wheat-50 p-10 rounded-2xl">
                 <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-wheat-900">Focus on Your Code, Not on Graphics</h2>
                        <p className="mt-4 text-brand-wheat-700">Integrate AI-powered asset generation directly into your development pipeline to maintain momentum and bring your projects to life faster.</p>
                        <ul className="mt-6 space-y-3">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Consistent Art Styles:</strong> Use detailed prompts and the 'Style' parameter to maintain a consistent visual language across all your generated assets.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>High-Resolution Outputs:</strong> Generate images ready for use in your applications, with various aspect ratios available to fit any component or screen.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>API-First Potential:</strong> While Prismatik is a UI, it's built on the powerful Gemini API, showcasing what's possible for programmatic asset generation in your own apps.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?q=80&w=800&auto=format&fit=crop" alt="Code on a screen" className="rounded-xl shadow-lg w-full h-full object-cover" />
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}
