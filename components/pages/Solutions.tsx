import React, { ReactElement } from 'react';

export default function Solutions(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">Solutions</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                Discover how Prismatik Studio can be tailored to fit your specific creative and professional needs.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <a href="/#/solutions/marketing" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-bold text-brand-teal-600">Marketing</h2>
                    <p className="mt-2 text-brand-wheat-700">Generate ad copy, visuals, and entire campaigns in minutes.</p>
                </a>
                <a href="/#/solutions/content-creation" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-bold text-brand-teal-600">Content Creation</h2>
                    <p className="mt-2 text-brand-wheat-700">Author illustrated stories, write articles, and generate blog content.</p>
                </a>
                <a href="/#/solutions/design" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-bold text-brand-teal-600">Design</h2>
                    <p className="mt-2 text-brand-wheat-700">Create logos, concept art, and visual assets for your projects.</p>
                </a>
                <a href="/#/solutions/development" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-bold text-brand-teal-600">Development</h2>
                    <p className="mt-2 text-brand-wheat-700">Generate game assets, UI mockups, and illustrative graphics.</p>
                </a>
            </div>
        </div>
    </div>
  );
}
