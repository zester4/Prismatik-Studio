import React, { ReactElement } from 'react';

export default function NotFound(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-24 text-center">
            <h1 className="text-6xl font-extrabold text-brand-teal-500">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-brand-wheat-900">Page Not Found</h2>
            <p className="mt-4 max-w-md mx-auto text-lg text-brand-wheat-700">
                Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-8">
                <a href="/#/" className="bg-brand-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-teal-600 transition duration-300">
                    Go back home
                </a>
            </div>
        </div>
    </div>
  );
}
