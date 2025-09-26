import React, { ReactElement } from 'react';

const SolutionCard = ({ href, title, description, icon }: { href: string, title: string, description: string, icon: ReactElement }) => (
    <a href={href} className="block p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div className="bg-brand-teal-100 text-brand-teal-500 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h2 className="text-2xl font-bold text-brand-teal-600">{title}</h2>
        <p className="mt-2 text-brand-wheat-700">{description}</p>
        <span className="mt-4 inline-block font-semibold text-brand-teal-500 group">
            Learn More <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </span>
    </a>
);

// Icons
const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584M9 18l-3.362-3.362" /></svg>;
const ContentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DesignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
const DevelopmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>;

export default function Solutions(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900">One Studio, Limitless Solutions</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-brand-wheat-700">
                    Prismatik Studio is more than a collection of tools; it's a versatile platform designed to accelerate creativity and productivity across various professional fields. Explore how our AI-powered suite can be tailored to fit your specific needs.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <SolutionCard 
                    href="/#/solutions/marketing"
                    title="Marketing & Advertising"
                    description="Use the Ad Creator to generate campaign copy and visuals, the Video Generator for promotional clips, and the Image Generator for social media content."
                    icon={<MarketingIcon />}
                />
                <SolutionCard 
                    href="/#/solutions/content-creation"
                    title="Content Creation"
                    description="Leverage the Story Generator to visualize narratives, the Article Generator for long-form content, and AI proofreading to polish your final draft."
                    icon={<ContentIcon />}
                />
                <SolutionCard 
                    href="/#/solutions/design"
                    title="Design & Branding"
                    description="Rapidly prototype brand identities with the Logo Generator, and create unique mood boards and assets with the versatile Image Generator."
                    icon={<DesignIcon />}
                />
                <SolutionCard 
                    href="/#/solutions/development"
                    title="Development & Gaming"
                    description="Accelerate your workflow by generating game assets like sprites and textures, UI mockups, and illustrative graphics for technical documentation."
                    icon={<DevelopmentIcon />}
                />
            </div>
        </div>
    </div>
  );
}
