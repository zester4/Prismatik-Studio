import React, { ReactElement } from 'react';

export default function Header(): ReactElement {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <a href="/#/" className="flex items-center no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-brand-teal-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 8.5l10 6.5 10-6.5L12 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 8.5l10 6.5V22" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 8.5l-10 6.5V22" />
          </svg>
          <h1 className="text-2xl font-bold text-brand-wheat-900">
            Prismatik <span className="text-brand-teal-500">Studio</span>
          </h1>
        </a>
      </div>
    </header>
  );
}