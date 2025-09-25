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
const LogoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const AssetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const MoodboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;

export default function Design(): ReactElement {
  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center max-w-3xl mx-auto">
                <p className="font-semibold text-brand-teal-500">For Designers</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 mt-2">Your Ultimate Creative Assistant</h1>
                <p className="mt-4 text-lg text-brand-wheat-700">
                   From branding to concept art, Prismatik Studio is the perfect partner for your design workflow. Generate unique assets, explore visual directions, and iterate on ideas faster than ever before.
                </p>
                <a href="/#/studio" className="mt-8 inline-block bg-brand-teal-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300">
                    Start Designing
                </a>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<LogoIcon />}
                    title="Rapid Brand Prototyping"
                    description="Generate dozens of professional logo concepts in minutes to kickstart your next branding project."
                />
                <FeatureCard 
                    icon={<AssetIcon />}
                    title="Endless Asset Creation"
                    description="Need a specific icon, texture, or illustration? Describe it and let the Image Generator create it for you."
                />
                <FeatureCard 
                    icon={<MoodboardIcon />}
                    title="Instant Mood Boards"
                    description="Quickly generate a wide range of images in various styles to establish the visual direction for a project."
                />
            </div>

            <div className="mt-24 bg-brand-wheat-50 p-10 rounded-2xl">
                 <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-wheat-900">Iterate at Lightning Speed</h2>
                        <p className="mt-4 text-brand-wheat-700">The Image and Logo generators are built to augment your creative process, not replace it. Use them to explore possibilities you never would have had time for otherwise.</p>
                        <ul className="mt-6 space-y-3">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Explore Diverse Styles:</strong> From photorealistic to anime to 3D renders, instantly see your ideas in any style.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Fine-Tuned Control:</strong> Use negative prompts and aspect ratio controls to get the exact composition you need.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Edit with Precision:</strong> Upload your own sketches or existing designs and use text prompts to modify them.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1572044162444-24c95621ec3b?q=80&w=800&auto=format&fit=crop" alt="Designer sketching on a tablet" className="rounded-xl shadow-lg w-full h-full object-cover" />
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}