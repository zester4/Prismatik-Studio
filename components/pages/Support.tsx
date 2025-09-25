import React, { ReactElement } from 'react';

export default function Support(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">Support Center</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                Find the help you need to get the most out of Prismatik Studio.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <a href="/#/support/faq" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-teal-600">FAQ</h2>
                    <p className="mt-2 text-brand-wheat-700">Find answers to common questions.</p>
                </a>
                <a href="/#/support/documentation" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-teal-600">Documentation</h2>
                    <p className="mt-2 text-brand-wheat-700">Read in-depth guides for each tool.</p>
                </a>
                <a href="/#/support/api-status" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-teal-600">API Status</h2>
                    <p className="mt-2 text-brand-wheat-700">Check the current status of Google's API.</p>
                </a>
            </div>
        </div>
    </div>
  );
}
