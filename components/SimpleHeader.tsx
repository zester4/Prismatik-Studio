import React, { ReactElement } from 'react';

export default function SimpleHeader(): ReactElement {
  return (
    <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
             <a href="/#/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-teal-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 8.5l10 6.5 10-6.5L12 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 8.5l10 6.5V22" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 8.5l-10 6.5V22" />
                </svg>
                <h1 className="text-2xl font-bold text-brand-wheat-900">
                    Prismatik <span className="text-brand-teal-500">Studio</span>
                </h1>
            </a>
            <a href="/#/studio" className="bg-brand-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-teal-600 transition duration-300 shadow-sm hover:shadow-md">
                Launch Studio
            </a>
        </div>
    </header>
  );
}
