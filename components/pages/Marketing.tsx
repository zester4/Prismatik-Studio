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
const CampaignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584M9 18l-3.362-3.362" /></svg>;
const SocialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const BrandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

export default function Marketing(): ReactElement {
  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center max-w-3xl mx-auto">
                <p className="font-semibold text-brand-teal-500">For Marketers</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 mt-2">Create Campaigns at the Speed of Thought</h1>
                <p className="mt-4 text-lg text-brand-wheat-700">
                    Tired of creative bottlenecks? Prismatik Studio's Ad Creator and generative tools are your secret weapon for launching faster, testing more, and creating higher-impact marketing campaigns.
                </p>
                <a href="/#/studio" className="mt-8 inline-block bg-brand-teal-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300">
                    Start Generating Ads
                </a>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<CampaignIcon />}
                    title="Instant Ad Generation"
                    description="Use the Ad Creator to generate complete ad sets—including compelling copy and on-brand visuals—from a single product description."
                />
                <FeatureCard 
                    icon={<SocialIcon />}
                    title="Scale Social Content"
                    description="Use the Image and Video Generators to create a month's worth of social media visuals, video clips, and post ideas in a single afternoon."
                />
                <FeatureCard 
                    icon={<BrandIcon />}
                    title="Strengthen Brand Identity"
                    description="Use the Logo Generator to rapidly prototype logos and visual styles to build a consistent and memorable brand across all channels."
                />
            </div>

            <div className="mt-24 bg-brand-wheat-50 p-10 rounded-2xl">
                 <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-wheat-900">From Brief to Broadcast in Minutes</h2>
                        <p className="mt-4 text-brand-wheat-700">The Ad Generator is your all-in-one solution for campaign creation. Simply provide your product details, target audience, and desired tone, and let the AI handle the rest.</p>
                        <ul className="mt-6 space-y-3">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Persuasive Copywriting:</strong> Get optimized headlines, body text, and calls-to-action that resonate with your chosen tone of voice.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Stunning Visuals:</strong> Generate professional product shots or dynamic video ads, with or without your own images, tailored to your target audience.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span><strong>Effortless A/B Testing:</strong> Create multiple ad variants in seconds. Tweak the tone, change the visuals, and test different CTAs to find what truly converts.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=800&auto=format&fit=crop" alt="Marketing professional at work" className="rounded-xl shadow-lg w-full h-full object-cover" />
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
}
