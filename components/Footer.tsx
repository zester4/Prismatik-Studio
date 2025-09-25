import React, { ReactElement } from 'react';

// Social Icons
const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);
const GitHubIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
);
const DribbbleIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.27 25.27 0 00-4.244-3.177c2.226-2.823 4.816-5.467 7.44-6.417zM4.755 9.445A8.52 8.52 0 0112 3.5c-1.475 0-2.866.42-4.12 1.153a25.201 25.201 0 00-1.928 4.794h5.216a23.94 23.94 0 01-.035 1.341H3.064A8.51 8.51 0 014.755 9.445zM12 20.5c-1.475 0-2.866-.42-4.12-1.153a25.2 25.2 0 001.928-4.794h-5.216a23.94 23.94 0 01.035-1.341h8.848a23.944 23.944 0 01-4.244 3.177c-2.226 2.823-4.816 5.467-7.44 6.417A8.502 8.502 0 0112 20.5z" clipRule="evenodd" />
    </svg>
);

export default function Footer(): ReactElement {
    return (
        <footer className="bg-white border-t border-brand-wheat-200">
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Branding Section */}
                    <div className="md:col-span-4">
                        <div className="flex items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-teal-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 8.5l10 6.5 10-6.5L12 2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 8.5l10 6.5V22" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M22 8.5l-10 6.5V22" />
                            </svg>
                            <h2 className="text-2xl font-bold text-brand-wheat-900">
                                Prismatik <span className="text-brand-teal-500">Studio</span>
                            </h2>
                        </div>
                        <p className="text-brand-wheat-700 text-sm max-w-xs">
                            An all-in-one suite of generative AI tools to transform your simple text prompts into stunning creations.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-brand-wheat-500 hover:text-brand-teal-500 transition">
                                <span className="sr-only">Twitter</span>
                                <TwitterIcon />
                            </a>
                            <a href="#" className="text-brand-wheat-500 hover:text-brand-teal-500 transition">
                                <span className="sr-only">GitHub</span>
                                <GitHubIcon />
                            </a>
                            <a href="#" className="text-brand-wheat-500 hover:text-brand-teal-500 transition">
                                <span className="sr-only">Dribbble</span>
                                <DribbbleIcon />
                            </a>
                        </div>
                    </div>
                    
                    {/* Links Sections */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-brand-wheat-900 tracking-wider uppercase">Solutions</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">Marketing</a></li>
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">Content Creation</a></li>
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">Design</a></li>
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">Development</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-brand-wheat-900 tracking-wider uppercase">Support</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">FAQ</a></li>
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">Documentation</a></li>
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">API Status</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-brand-wheat-900 tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">About</a></li>
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">Blog</a></li>
                                <li><a href="#" className="text-base text-brand-wheat-700 hover:text-brand-teal-500 transition">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-brand-wheat-200 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-brand-wheat-600">
                        &copy; {new Date().getFullYear()} Prismatik Studio. All rights reserved.
                    </p>
                    <p className="text-sm text-brand-wheat-600 mt-4 sm:mt-0">
                        Powered by <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand-teal-500 transition">Google Gemini</a>.
                    </p>
                </div>
            </div>
        </footer>
    );
}