import React, { ReactElement } from 'react';

const SupportCard = ({ href, title, description, icon }: { href: string, title: string, description: string, icon: ReactElement }) => (
    <a href={href} className="block p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
        <div className="bg-brand-teal-100 text-brand-teal-500 rounded-lg w-16 h-16 flex items-center justify-center mb-6 mx-auto">
            {icon}
        </div>
        <h2 className="text-2xl font-bold text-brand-teal-600">{title}</h2>
        <p className="mt-2 text-brand-wheat-700">{description}</p>
        <span className="mt-6 inline-block font-semibold text-brand-teal-500 group">
            Go to {title} <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </span>
    </a>
);

// Icons
const FaqIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DocsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const StatusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

export default function Support(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900">Support Center</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700">
                    Welcome to the Prismatik Studio help hub. Find the resources you need to troubleshoot issues, learn best practices, and get the most out of your creative workflow. We're here to help you succeed.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <SupportCard
                    href="/#/support/faq"
                    title="FAQ"
                    description="Have a quick question? Find answers to the most common queries about API keys, features, and usage."
                    icon={<FaqIcon />}
                />
                <SupportCard
                    href="/#/support/documentation"
                    title="Documentation"
                    description="Dive deep into our comprehensive guides for each tool, with detailed parameter explanations and pro tips."
                    icon={<DocsIcon />}
                />
                <SupportCard
                    href="/#/support/api-status"
                    title="API Status"
                    description="Check the real-time operational status of the underlying Google Gemini services that power the studio."
                    icon={<StatusIcon />}
                />
            </div>
        </div>
    </div>
  );
}
